import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLFloat,
} from 'graphql';

const SessionScheduleType = new GraphQLObjectType({
  name: 'SessionSchedule',
  fields: () => ({
    time: { type: GraphQLString },
    info_abbr: { type: GraphQLString },
    info_desc: { type: GraphQLString },
  }),
});

const RoomSessionType = new GraphQLObjectType({
  name: 'RoomSession',
  fields: () => ({
    day: { type: GraphQLString },
    day_of_week: { type: GraphQLString },
    session_schedule: {
      type: new GraphQLList(SessionScheduleType),
    },
  }),
});

const TheaterSessionType = new GraphQLObjectType({
  name: 'TheaterSession',
  fields: () => ({
    room_number: { type: GraphQLString },
    room_sessions: {
      type: new GraphQLList(RoomSessionType),
    },
  }),
});

const NowPlayingMovieType = new GraphQLObjectType({
  name: 'NowPlayingMovie',
  fields: () => ({
    movie_id: { type: GraphQLString },
    theater_sessions: {
      type: new GraphQLList(TheaterSessionType),
    },
  }),
});

const AddressType = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
    name: { type: GraphQLString },
    street: { type: GraphQLString },
    postal_code: { type: GraphQLString },
    locality: { type: GraphQLString },
    region: { type: GraphQLString },
    country: { type: GraphQLString },
  }),
});

const PriceDefType = new GraphQLObjectType({
  name: 'PriceDef',
  fields: () => ({
    values: { type: new GraphQLList(GraphQLString) },
    days_of_week: { type: new GraphQLList(GraphQLString) },
    start_time: { type: GraphQLString },
    end_time: { type: GraphQLString },
    is_valid_on_holidays: { type: GraphQLBoolean },
    is_addition: { type: GraphQLBoolean },
    is_extras: { type: GraphQLBoolean },
  }),
});

const PriceType = new GraphQLObjectType({
  name: 'Price',
  fields: () => ({
    description: { type: GraphQLString },
    price_desc: { type: GraphQLString },
    price: { type: GraphQLFloat },
    types: { type: new GraphQLList(PriceDefType) },
  }),
});

const TicketPriceType = new GraphQLObjectType({
  name: 'TicketPrice',
  fields: () => ({
    default: { type: new GraphQLList(PriceType) },
    special: { type: new GraphQLList(PriceType) },
    extras: { type: new GraphQLList(GraphQLString) },
  }),
});

const TheaterType = new GraphQLObjectType({
  name: 'Theater',
  fields: () => ({
    name: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    maps_uri: { type: GraphQLString },
    now_playing_movies: {
      type: new GraphQLList(NowPlayingMovieType),
    },
    has_3d: { type: GraphQLBoolean },
    has_imax: { type: GraphQLBoolean },
    address: { type: AddressType },
    ticket_prices: { type: TicketPriceType },
  }),
});

export default TheaterType;
