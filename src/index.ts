import { extname, join } from 'node:path';
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
  } = {
    '/': {
      path: join(root, entry),
      contentType: tryGetContentType(entry),
    },
  } as const;

  readdirSync(root, { encoding: 'utf8', recursive: true }).map(path => {
    const stat = lstatSync(join(root, path));

    if (!stat.isFile()) {
      return;
    }

    staticFiles[`/${path}`] = {
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
 * Generates an HTTP server for serving up static resources.
 *
 * @example readStaticAssetsSync('./public', 'index.html');
 * @param {Object} options
 * @param {Number} options.port Port to run HTTP server from.
 * @param {String} options.root Relative path to the root of a given directory.
 * @param {String} options.entry The default resource to return when accessing the root of the main directory.
 * @return {[key: string]: { path: string; contentType: string; }} The list of file paths and content types.
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
      if (!req.url) {
        return;
      }

      if (!Object.keys(staticFiles).includes(req.url)) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`404 ${req.url}`);
        }

        res.writeHead(404);

        res.end('Not found');

        return;
      }

      const { path, contentType } = staticFiles[req.url];

      if (process.env.NODE_ENV === 'development') {
        console.log(`200 ${path} ${contentType}`);
      }

      const content = readFileSync(path);

      res.setHeader('Content-type', contentType);

      res.writeHead(200);

      res.end(content);
    } catch (error) {
      res.writeHead(500);

      res.end('Internal server error');
    }
  }).listen(port);
};

export default server;
