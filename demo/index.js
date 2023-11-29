/* eslint-env node */

import http from 'http-simple-serve';

http({
  port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  root: 'public/',
  entry: 'index.html',
});
