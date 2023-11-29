# http-simple-serve

> ⚙️ HTTP server for use with static resources.

[![Build](https://github.com/neogeek/http-simple-serve/actions/workflows/build.workflow.yml/badge.svg)](https://github.com/neogeek/http-simple-serve/actions/workflows/build.workflow.yml)
[![Lint](https://github.com/neogeek/http-simple-serve/actions/workflows/lint.workflow.yml/badge.svg)](https://github.com/neogeek/http-simple-serve/actions/workflows/lint.workflow.yml)
[![NPM Version](http://img.shields.io/npm/v/http-simple-serve.svg?style=flat)](https://www.npmjs.org/package/http-simple-serve)

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

## Debugging

This will output all requests to the console with the path and response status code.

```bash
$ NODE_ENV=development npm start
```
