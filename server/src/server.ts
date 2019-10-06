/* eslint-disable no-console */
import chalk from 'chalk';
import terminalLink from 'terminal-link';
import config from './config';
import App from './App';

const port = parseInt(config.port, 10);


const start = async () => {
  try {
    const app = new App();
    app.instance.keepAliveTimeout = config.timeout;

    await app.instance.listen(port);

    const link = `http://localhost:${app.instance.server.address().port}${config.urlBasePath}`;
    console.log(
      `[${new Date().toISOString()}]`,
      chalk.cyanBright(`Download App Web is running: 🌎 ${terminalLink(link, link)}`)
    );

    /*await app.instance.ready();

    const query = '{ movie(id: "574088") { id title } }'
    const res = await app.instance.graphql(query)

    console.log('>>>>>> res', res.data);*/

    app.instance.server.on('error', error => {
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
