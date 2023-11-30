/* node:coverage disable */

import test from 'node:test';
import assert from 'node:assert';

import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';

import http, {
  readStaticAssetsSync,
  tryGetContentType,
  tryParseUrl,
} from './index.js';

void test('http', async t => {
  await t.test(
    'start server and serve an entry file (indirectly)',
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

      const response = await fetch(`http://localhost:${address.port}`);

      assert.strictEqual(
        await response.text(),
        readFileSync('./demo/public/index.html', 'utf8')
      );

      server.close();
    }
  );
  await t.test('start server and serve an entry file (directly)', async () => {
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
  await t.test('start server and serve a specific file', async () => {
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
  await t.test('start server and serve a CSS file', async () => {
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
  await t.test(
    'start server and fail to serve file that gets deleted after the server starts',
    async () => {
      writeFileSync('./demo/public/500.html', '');

      const server = http({
        port: 0,
        root: './demo/public',
        entry: 'index.html',
      });

      unlinkSync('./demo/public/500.html');

      const address = server.address();

      if (!address || typeof address !== 'object') {
        throw new Error('Server address not set correctly.');
      }

      const response = await fetch(`http://localhost:${address.port}/500.html`);

      assert.strictEqual(response.status, 500);

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
        '/index.html': {
          contentType: 'text/html; charset=utf-8',
          path: 'demo/public/index.html',
        },
        '/css/styles.css': {
          contentType: 'text/css; charset=utf-8',
          path: 'demo/public/css/styles.css',
        },
        '/docs': {
          contentType: 'text/html; charset=utf-8',
          path: 'demo/public/docs/index.html',
        },
        '/docs/index.html': {
          contentType: 'text/html; charset=utf-8',
          path: 'demo/public/docs/index.html',
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

void test('tryParseUrl', async t => {
  await t.test('get root url', () => {
    assert.strictEqual(tryParseUrl('/'), '/');
  });
  await t.test('get file path', () => {
    assert.strictEqual(tryParseUrl('/index.html'), '/index.html');
  });
  await t.test('get sub directory with trailing slash', () => {
    assert.strictEqual(tryParseUrl('/docs/'), '/docs');
  });
  await t.test('get sub directory without trailing slash', () => {
    assert.strictEqual(tryParseUrl('/docs'), '/docs');
  });
  await t.test('get file in sub directory', () => {
    assert.strictEqual(tryParseUrl('/docs/index.html'), '/docs/index.html');
  });
  await t.test('fail to parse url when url is missing', () => {
    assert.throws(
      () => {
        tryParseUrl(undefined);
      },
      {
        name: 'TypeError',
        message: 'URL is missing',
      }
    );
  });
});
