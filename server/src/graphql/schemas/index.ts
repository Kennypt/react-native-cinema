import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
} from 'graphql';

import movieSchema from './movie';
import { getMovieById } from '../../controllers/dataCollectors/movies/info';
import { getMoviesInExhibition } from '../../controllers/handlers/movies';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    movie: {
      type: movieSchema,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args: { id: string }) {
        console.log('>>>>>>movie<<<<<<<<<');
        return await getMovieById(args)
      }
    },
    in_exhibition: {
      type: new GraphQLList(movieSchema),
      args: {
        country_code: { type: GraphQLString },
        theater_ids: { type: GraphQLList(GraphQLID) },
        movie_genres: { type: GraphQLList(GraphQLString) },
      },
      async resolve(parent, args: {
        id: string;
        country_code: string;
        theater_ids: string[];
        movie_genres: string[];
      }) {
        console.log('>>>>>>in_exhibition<<<<<<<<<');
        return await getMoviesInExhibition(args)
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
