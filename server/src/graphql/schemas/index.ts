import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import movieSchema from './movie';
import locationSchema from './location';
import theaterSchema from './theater';
import { getMovieById } from '../../controllers/dataCollectors/movies/info';
import { getMoviesInExhibition } from '../../controllers/handlers/movies';
import getLocations from '../../controllers/handlers/locations';
import getTheaterById from '../../controllers/handlers/theaters';
import BackdropSizes from '../../enums/backdropSizes';
import PosterSizes from '../../enums/posterSizes';
import Locales from '../../enums/locales';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    movie: {
      type: movieSchema,
      args: {
        id: { type: GraphQLID },
        locale: { type: GraphQLString },
        backdrop_size: { type: GraphQLString },
        poster_size: { type: GraphQLString },
      },
      async resolve(parent, args: {
        id: string;
        backdrop_size: BackdropSizes;
        poster_size: PosterSizes;
        locale: Locales;
      }) {
        return await getMovieById(args)
      }
    },
    in_exhibition: {
      type: new GraphQLList(movieSchema),
      args: {
        country_code: { type: GraphQLString },
        adult: { type: GraphQLBoolean },
        theater_ids: { type: GraphQLList(GraphQLID) },
        movie_genres: { type: GraphQLList(GraphQLString) },
        backdrop_size: { type: GraphQLString },
        poster_size: { type: GraphQLString },
        locale: { type: GraphQLString },
      },
      async resolve(parent, args: {
        id: string;
        adult: boolean;
        country_code: string;
        theater_ids: string[];
        movie_genres: string[];
        backdrop_size: BackdropSizes;
        poster_size: PosterSizes;
        locale: Locales;
      }) {
        return await getMoviesInExhibition(args)
      }
    },
    location: {
      type: locationSchema,
      args: {
        country_code: { type: GraphQLString },
        name: { type: GraphQLString },
      },
      async resolve(parent, args: {
        country_code: string;
        name: string;
      }) {
        return await getLocations(args)
      }
    },
    theater: {
      type: theaterSchema,
      args: {
        name: { type: GraphQLString },
      },
      async resolve(parent, args: {
        name: string;
      }) {
        return await getTheaterById(args)
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
