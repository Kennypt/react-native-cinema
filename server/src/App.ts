import compression from 'compression';
import Fastify from 'fastify';
import GQL from 'fastify-gql';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';

import './boot';

import securityMiddleware from './middlewares/security';
import errorHandlerMiddleware from './middlewares/errorHandler';
// import loggerMiddleware from './middlewares/logger';

// import mainRouter from './routes';

class App {
  public readonly server;

  constructor() {
    this.server = Fastify();
    this.setUp();
    this.addMiddleware();
    this.addRoutes();
    this.addSchemas();

    // Added after everything is loaded into the app
    this.server.use(errorHandlerMiddleware);
  }

  setUp() {
    this.server.set('etag', false);
    this.server.set('strict routing', true);

    // this.server.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  }

  addMiddleware() {
    // this.server.use(loggerMiddleware());
    this.server.use(securityMiddleware());
    this.server.use(compression());
    this.server.use(cors());
  }

  addSchemas() {
    const typeDefs = `
      type Query {
        add(x: Int, y: Int): Int
      }
    `

    const resolvers = {
      Query: {
        add: async (_, { x, y }) => x + y
      }
    }

    this.server.register(GQL, {
      schema: makeExecutableSchema({ typeDefs, resolvers })
    });
  }

  addRoutes() {
    // this.server.use(mainRouter);
  }
}

export default App;
