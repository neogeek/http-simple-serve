# http-simple-serve

> ⚙️ Simple HTTP server for use with static resources.

[![Test](https://github.com/neogeek/http-simple-serve/actions/workflows/test.workflow.yml/badge.svg)](https://github.com/neogeek/http-simple-serve/actions/workflows/test.workflow.yml)
[![Lint](https://github.com/neogeek/http-simple-serve/actions/workflows/lint.workflow.yml/badge.svg)](https://github.com/neogeek/http-simple-serve/actions/workflows/lint.workflow.yml)
[![Build](https://github.com/neogeek/http-simple-serve/actions/workflows/build.workflow.yml/badge.svg)](https://github.com/neogeek/http-simple-serve/actions/workflows/build.workflow.yml)
[![NPM Version](http://img.shields.io/npm/v/http-simple-serve.svg?style=flat)](https://www.npmjs.org/package/http-simple-serve)
[![Documentation](https://doxdox.org/images/badge-flat.svg)](https://doxdox.org/)

## Install

```bash
$ npm install http-simple-serve
```

## Usage

```javascript
import http from 'http-simple-serve';

http({
  port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  root: 'public/',
  entry: 'index.html',
});
```

## Custom Server

```javascript
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
```

## Debugging

This will output all requests to the console with the path and response status code.

```bash
$ NODE_ENV=development npm start
```
