import { createServer } from 'vite';

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const [{ renderToString }, React, { MemoryRouter }] = await Promise.all([
    vite.ssrLoadModule('react-dom/server'),
    vite.ssrLoadModule('react'),
    vite.ssrLoadModule('react-router-dom'),
  ]);

  const routes = [
    ['/', 'Home'],
    ['/infix-to-postfix', 'InfixToPostfix'],
    ['/postfix-to-infix', 'PostfixToInfix'],
    ['/infix-to-prefix', 'InfixToPrefix'],
    ['/prefix-to-infix', 'PrefixToInfix'],
    ['/postfix-to-prefix', 'PostfixToPrefix'],
    ['/prefix-to-postfix', 'PrefixToPostfix'],
    ['/about', 'About'],
  ];

  const pages = {};
  for (const name of [
    'Home',
    'InfixToPostfix',
    'PostfixToInfix',
    'InfixToPrefix',
    'PrefixToInfix',
    'PostfixToPrefix',
    'PrefixToPostfix',
    'About',
  ]) {
    const mod = await vite.ssrLoadModule(`/src/pages/${name}.jsx`);
    pages[name] = mod.default;
  }
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx');

  // Render full app per route
  let failed = false;
  for (const [path] of routes) {
    try {
      const html = renderToString(
        React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(App))
      );
      console.log(`OK ${path} (${html.length} chars)`);
    } catch (e) {
      failed = true;
      console.error(`FAIL ${path}:`, e.message);
    }
  }

  process.exit(failed ? 1 : 0);
} finally {
  await vite.close();
}
