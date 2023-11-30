/* eslint-env node */

import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';

import { readStaticAssetsSync, tryParseUrl } from 'http-simple-serve';

const staticFiles = readStaticAssetsSync('./public', 'index.html');

createServer(async (req, res) => {
  try {
    const url = tryParseUrl(req.url);

    if (Object.keys(staticFiles).includes(url)) {
      const { path, contentType } = staticFiles[url];

      const content = readFileSync(path);

      res.setHeader('Content-type', contentType);

      res.writeHead(200);

      res.end(content);
    } else if (url === '/robots.txt') {
      res.writeHead(200);

      res.end('User-agent: *\nAllow: /');
    } else {
      res.writeHead(404);

      res.end('Not found');
    }
  } catch (error) {
    res.writeHead(500);

    res.end('Internal server error');
  }
}).listen(process.env.PORT ? parseInt(process.env.PORT) : 8080);
