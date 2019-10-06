import { Document } from 'mongoose';

export interface ITheaterInfo extends Document {
  name: string;
  address: {
    name: string;
    street: string;
    postal_code: string;
    locality: string;
    region: string;
    country: string;
  };
  phone_number?: string;
  uri: string;
  maps_uri: string;
  now_playing_movies: {
    movie_id: number;
    theater_sessions: [{
      room_number: string;
      room_sessions: [{
        day: string;
        day_of_week: string;
        session_schedule: [{
          time: string;
          info_abbr?: string;
          info_desc?: string;
        }];
      }];
    }];
  };
  has_3d?: boolean,
  has_imax?: boolean,
  ticket_prices: {
    default: [{
      description: string;
      types?: [{
        values?: [string],
        days_of_week?: [string],
        start_time?: string,
        end_time?: string,
        is_valid_on_holidays?: boolean,
        is_addition?: boolean,
        is_extras?: boolean,
      }],
      price_desc: string;
      price: number;
    }];
    special?: [{
      campaign: string;
      description: string;
      types?: [{
        values?: [string],
        days_of_week?: [string],
        start_time?: string,
        end_time?: string,
        is_valid_on_holidays?: boolean,
        is_addition?: boolean,
        is_extras?: boolean,
      }],
      price_desc: string;
      price: number;
    }];
    extras?: [string];
  };
}
