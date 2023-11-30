import { basename, dirname, extname, join, normalize } from 'node:path';
import { lstatSync, readdirSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';

import { contentType } from 'mime-types';

/**
 * Returns a list of file paths and their content types found recursively in a given path.
 *
 * @example readStaticAssetsSync('./public', 'index.html');
 * @param {String} root Relative path to the root of a given directory.
 * @param {String} entry The default resource to return when accessing the root of the main directory.
 * @return {{[key: string]: { path: string; contentType: string; }}} The list of file paths and content types.
 */
export const readStaticAssetsSync = (root: string, entry: string) => {
  const staticFiles: {
    [key: string]: {
      path: string;
      contentType: string;
    };
  } = {} as const;

  readdirSync(root, { encoding: 'utf8', recursive: true }).map(path => {
    const stat = lstatSync(join(root, path));

    if (!stat.isFile()) {
      return;
    }

    if (basename(path) === entry) {
      staticFiles[normalize(`/${dirname(path)}`)] = {
        path: join(root, path),
        contentType: tryGetContentType(path),
      };
    }

    staticFiles[normalize(`/${path}`)] = {
      path: join(root, path),
      contentType: tryGetContentType(path),
    };
  });

  return staticFiles;
};

/**
 * Returns the content type of a file for use in an HTTP response header.
 *
 * @example tryGetContentType('./public/index.html');
 * @param {String} path A relative file path.
 * @return {String} The content type for the given file path.
 */
export const tryGetContentType = (path: string) => {
  const result = contentType(extname(path));

  if (!result) {
    throw TypeError('Path specified was not valid.');
  }

  return result;
};

/**
 * Returns a parsed URL. If the URL is to a directory, the trailing slash is removed.
 *
 * @example tryParseUrl('/docs/index.html');
 * @example tryParseUrl('/docs/');
 * @param {String} url The requested URL.
 * @return {String} The parsed URL.
 */
export const tryParseUrl = (url: string | undefined) => {
  if (!url) {
    throw TypeError('URL is missing');
  }

  if (url === '/') {
    return url;
  }

  return url.replace(/\/$/, '');
};

/**
 * Generates an HTTP server for serving up static resources.
 *
 * @example server({ port: 8080, root: './public', entry: 'index.html' });
 * @param {Object} options
 * @param {Number} options.port Port to run HTTP server from.
 * @param {String} options.root Relative path to the root of a given directory.
 * @param {String} options.entry The default resource to return when accessing the root of the main directory.
 * @return {Server<typeof IncomingMessage, typeof ServerResponse>} HTTP server.
 */
const server = ({
  port,
  root = './public',
  entry = 'index.html',
}: {
  port: number;
  root?: string;
  entry?: string;
}) => {
  const staticFiles = readStaticAssetsSync(root, entry);

  return createServer((req, res) => {
    try {
      const url = tryParseUrl(req.url);

      if (!Object.keys(staticFiles).includes(url)) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`404 ${url}`);
        }

        res.writeHead(404);

        res.end('Not found');

        return;
      }

      const { path, contentType } = staticFiles[url];

      if (process.env.NODE_ENV === 'development') {
        console.log(`200 ${path} ${contentType}`);
      }

      const content = readFileSync(path);

      res.setHeader('Content-type', contentType);

      res.writeHead(200);

      res.end(content);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('500', error);
      }

      res.writeHead(500);

      res.end('Internal server error');
    }
  }).listen(port);
};

export default server;
