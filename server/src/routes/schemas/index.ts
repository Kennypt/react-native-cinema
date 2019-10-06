import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLSchema,
} from 'graphql';

import movieSchema from './movie';
import { getMovieById } from '../../controllers/dataCollectors/movies/info';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    movie: {
      type: movieSchema,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args: { id: string }) {
        return await getMovieById(args)
      }
    },
  },
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {}
});

export default new GraphQLSchema({
  query: RootQuery,
  // mutation: Mutations
});
