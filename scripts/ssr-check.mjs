import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const routes = [
  '/',
  '/infix-to-postfix',
  '/postfix-to-infix',
  '/infix-to-prefix',
  '/prefix-to-infix',
  '/postfix-to-prefix',
  '/prefix-to-postfix',
  '/about',
];

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx');

  let failed = false;
  for (const path of routes) {
    try {
      const html = renderToString(
        React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(App))
      );
      console.log(`OK ${path} (${html.length} chars)`);
    } catch (e) {
      failed = true;
      console.error('FAIL ' + path + ':', e.stack ? e.stack.split('\n').slice(0,6).join('\n') : e);
    }
  }
  process.exit(failed ? 1 : 0);
} finally {
  await vite.close();
}

