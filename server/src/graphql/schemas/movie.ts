import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLBoolean,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
} from 'graphql';

const localeDataType = new GraphQLObjectType({
  name: 'LocaleData',
  fields: () => ({
    iso_3166_1: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

const productionCompanyType = new GraphQLObjectType({
  name: 'ProductionCompany',
  fields: () => ({
    id: { type: GraphQLID },
    logo_path: { type: GraphQLString },
    name: { type: GraphQLString },
    origin_country: { type: GraphQLString },
  }),
});

const genresType = new GraphQLObjectType({
  name: 'Genres',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

const belongsToCollectionType = new GraphQLObjectType({
  name: 'BelongsToCollection',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    poster_url: { type: GraphQLString },
    backdrop_path: { type: GraphQLString },
  }),
});

const movieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    adult: { type: GraphQLBoolean },
    backdrop_path: { type: GraphQLString },
    belongs_to_collection: {
      type: belongsToCollectionType,
    },
    budget: { type: GraphQLInt },
    genres: {
      type: new GraphQLList(genresType)
    },
    homepage: { type: GraphQLString },
    imdb_id: { type: GraphQLString },
    original_language: { type: GraphQLString },
    original_title: { type: GraphQLString },
    overview: { type: GraphQLString },
    popularity: { type: GraphQLFloat },
    poster_url: { type: GraphQLString },
    production_companies: {
      type: new GraphQLList(productionCompanyType)
    },
    production_countries: {
      type: new GraphQLList(localeDataType)
    },
    release_date: { type: GraphQLString },
    revenue: { type: GraphQLInt },
    runtime: { type: GraphQLInt },
    spoken_languages: {
      type: new GraphQLList(localeDataType)
    },
    status: { type: GraphQLString },
    tagline: { type: GraphQLString },
    title: { type: GraphQLString },
    video: { type: GraphQLBoolean },
    vote_average: { type: GraphQLFloat },
    vote_count: { type: GraphQLInt },
    theater_ids: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});

export default movieType;

