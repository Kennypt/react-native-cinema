/* eslint-disable no-console */
import chalk from 'chalk';
import terminalLink from 'terminal-link';
import config from './config';
import App from './App';

const port = parseInt(config.PORT, 10);


const start = async () => {
  try {
    const app = new App();
    app.server.keepAliveTimeout = config.TIMEOUT;

    await app.server.listen(port);

    const link = `https://localhost:${app.server.server.address().port}${config.urlBasePath}`;
    console.log(
      `[${new Date().toISOString()}]`,
      chalk.cyanBright(`Download App Web is running: 🌎 ${terminalLink(link, link)}`)
    );

    app.server.on('error', error => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${port} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`Port ${port} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();

process.on('uncaughtException', error => {
  console.error('process > uncaughtException', error);
});

if (config.isDevelopment) {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at: Promise', promise, 'reason:', reason);
  });
}
