/* eslint-env node */

import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';

import { readStaticAssetsSync } from 'http-simple-serve';

const staticFiles = readStaticAssetsSync('./public', 'index.html');

createServer(async (req, res) => {
  try {
    if (!req.url) {
      return;
    }

    if (Object.keys(staticFiles).includes(req.url)) {
      const { path, contentType } = staticFiles[req.url];

      const content = readFileSync(path);

      res.setHeader('Content-type', contentType);

      res.writeHead(200);

      res.end(content);
    } else if (req.url === '/robots.txt') {
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
