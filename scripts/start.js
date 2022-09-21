import esbuild from 'esbuild';
import open from 'open';
import chalk from 'chalk';

import buildOptions from './build.options.js';
import browsers from './browsers.js';

const browser = browsers.chrome;
esbuild.serve({
  servedir: 'www',
  host: 'localhost',
  port: 2022,
}, buildOptions)
  .then((server) => {
    const url = `http://${server.host}:${server.port}`;
    console.log(chalk.green('\n\n🚀 Server running on'), chalk.green.underline(url));
    try {
      const app = { name: browser.name, arguments: [browser.private] };
      void open(`${server.host}:${server.port}`, { app, wait: true }).then(() => server.stop());
      console.log(chalk.green('🔭 Client running on', browser.name))
    } catch (error) {
      console.log(chalk.redBright('🔥 Error opening the browser:', error));
    }
  })
  .catch((error) => console.log(chalk.red.bold('🔥 Error on server:', error)));