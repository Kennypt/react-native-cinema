import compression from 'compression';
import fastify from 'fastify';
import GQL from 'fastify-gql';
import helmet from 'fastify-helmet';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
import dnsPrefetchControl from 'dns-prefetch-control';
import frameguard from 'frameguard';
import hidePoweredBy from 'hide-powered-by';
import hsts from 'hsts';
import ienoopen from 'ienoopen';
import xXssProtection from 'x-xss-protection';

import './boot';

import errorHandlerMiddleware from './middlewares/errorHandler';
// import loggerMiddleware from './middlewares/logger';

// import mainRouter from './routes';

class App {
  public readonly instance;

  constructor() {
    this.instance = fastify();
    this.setUp();
    this.addMiddleware();
    this.addRoutes();
    this.addSchemas();

    // Added after everything is loaded into the app
    this.instance.use(errorHandlerMiddleware);
  }

  setUp() {
    // this.server.set('etag', false);
    // this.server.set('strict routing', true);

    // this.server.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  }

  addMiddleware() {
    // this.server.use(loggerMiddleware());
    this.instance.use(compression());
    this.instance.use(cors());
    this.instance.use(dnsPrefetchControl());
    this.instance.use(frameguard());
    this.instance.use(hidePoweredBy());
    this.instance.use(hsts());
    this.instance.use(ienoopen());
    this.instance.use(xXssProtection());

    this.instance.register(helmet);
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

    this.instance.register(GQL, {
      schema: makeExecutableSchema({ typeDefs, resolvers })
    });
  }

  addRoutes() {
    // this.server.use(mainRouter);
  }
}

export default App;
