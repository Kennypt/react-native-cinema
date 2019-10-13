import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';

const TheaterShortType = new GraphQLObjectType({
  name: 'TheaterShort',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

const RegionType = new GraphQLObjectType({
  name: 'Region',
  fields: () => ({
    name: { type: GraphQLID },
    theaters: {
      type: new GraphQLList(TheaterShortType),
    },
  }),
});

const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: () => ({
    name: { type: GraphQLString },
    code: { type: GraphQLID },
    regions: {
      type: new GraphQLList(RegionType),
    },
  }),
});

export default LocationType;

