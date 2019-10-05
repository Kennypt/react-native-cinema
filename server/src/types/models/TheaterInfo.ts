import { Document } from 'mongoose';

export interface ITheaterInfo extends Document {
  name: string;
  address: {
    name: string;
    street: string;
    postalCode: string;
    locality: string;
    region: string;
    country: string;
  };
  phoneNumber?: string;
  uri: string;
  mapsUri: string;
  nowPlayingMovies: {
    movieId: number;
    theaterSessions: [{
      roomNumber: string;
      roomSessions: [{
        day: string;
        dayOfWeek: string;
        sessionSchedule: [{
          time: string;
          infoAbbr?: string;
          infoDesc?: string;
        }];
      }];
    }];
  };
  has3D?: boolean,
  hasImax?: boolean,
  ticketPrices: {
    default: [{
      description: string;
      types?: [{
        values?: [string],
        daysOfWeek?: [string],
        startTime?: string,
        endTyme?: string,
        isValidOnHolidays?: boolean,
        isAddition?: boolean,
        isExtras?: boolean,
      }],
      priceDesc: string;
      price: number;
    }];
    special?: [{
      campaign: string;
      description: string;
      types?: [{
        values?: [string],
        daysOfWeek?: [string],
        startTime?: string,
        endTyme?: string,
        isValidOnHolidays?: boolean,
        isAddition?: boolean,
        isExtras?: boolean,
      }],
      priceDesc: string;
      price: number;
    }];
    extras?: [string];
  };
}
