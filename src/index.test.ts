/* node:coverage disable */

import test from 'node:test';
import assert from 'node:assert';

import { readFileSync } from 'node:fs';

import http, { readStaticAssetsSync, tryGetContentType } from './index.js';

void test('http', async t => {
  await t.test('start server and serve up entry file', async () => {
    const server = http({
      port: 0,
      root: './demo/public',
      entry: 'index.html',
    });

    const address = server.address();

    if (!address || typeof address !== 'object') {
      throw new Error('Server address not set correctly.');
    }

    const response = await fetch(`http://localhost:${address.port}`);

    assert.strictEqual(
      await response.text(),
      readFileSync('./demo/public/index.html', 'utf8')
    );

    server.close();
  });
  await t.test('start server and serve up HTML file', async () => {
    const server = http({
      port: 0,
      root: './demo/public',
      entry: 'index.html',
    });

    const address = server.address();

    if (!address || typeof address !== 'object') {
      throw new Error('Server address not set correctly.');
    }

    const response = await fetch(`http://localhost:${address.port}/index.html`);

    assert.strictEqual(
      await response.text(),
      readFileSync('./demo/public/index.html', 'utf8')
    );

    server.close();
  });
  await t.test('start server and serve up CSS file', async () => {
    const server = http({
      port: 0,
      root: './demo/public',
      entry: 'index.html',
    });

    const address = server.address();

    if (!address || typeof address !== 'object') {
      throw new Error('Server address not set correctly.');
    }

    const response = await fetch(
      `http://localhost:${address.port}/css/styles.css`
    );

    assert.strictEqual(
      await response.text(),
      readFileSync('./demo/public/css/styles.css', 'utf8')
    );

    server.close();
  });
  await t.test(
    'start server and serve a 404 for a invalid resource',
    async () => {
      const server = http({
        port: 0,
        root: './demo/public',
        entry: 'index.html',
      });

      const address = server.address();

      if (!address || typeof address !== 'object') {
        throw new Error('Server address not set correctly.');
      }

      const response = await fetch(
        `http://localhost:${address.port}/js/main.js`
      );

      assert.strictEqual(response.status, 404);

      server.close();
    }
  );
});

void test('readStaticAssetsSync', async t => {
  await t.test('get files in directory', () => {
    assert.deepStrictEqual(
      readStaticAssetsSync('./demo/public', 'index.html'),
      {
        '/': {
          contentType: 'text/html; charset=utf-8',
          path: 'demo/public/index.html',
        },
        '/css/styles.css': {
          contentType: 'text/css; charset=utf-8',
          path: 'demo/public/css/styles.css',
        },
        '/index.html': {
          contentType: 'text/html; charset=utf-8',
          path: 'demo/public/index.html',
        },
      }
    );
  });
});

void test('tryGetContentType', async t => {
  await t.test('get content type from path', () => {
    assert.strictEqual(
      tryGetContentType('./public/index.html'),
      'text/html; charset=utf-8'
    );
  });
  await t.test('fail to get content type from invalid path', () => {
    assert.throws(
      () => {
        tryGetContentType('./public/');
      },
      {
        name: 'TypeError',
        message: 'Path specified was not valid.',
      }
    );
  });
});
