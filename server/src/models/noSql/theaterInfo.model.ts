import mongoose, { Schema } from 'mongoose';

import { ITheaterInfo } from '../../types/models/TheaterInfo';

const TheaterInfoSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  uri: { type: String, required: true },
  mapsUri: { type: String, required: true },
  nowPlayingMovies: {
    movieId: { type: String },
    theaterSessions: [{
      roomNumber: { type: String },
      roomSessions: [{
        day: { type: String },
        dayOfWeek: { type: String },
        sessionSchedule: [{
          time: { type: String },
          infoAbbr: { type: String },
          infoDesc: { type: String },
        }],
      }],
    }],
  },
  has3D: { type: Boolean },
  hasImax: { type: Boolean },
  address: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    locality: { type: String, required: true },
    region: { type: String, required: true },
    country: { type: String, required: true },
  },
  ticketPrices: {
    default: [{
      description: { type: String, required: true },
      types: [{
        values: [{ type: String }],
        daysOfWeek: [{ type: String }],
        startTime: { type: String },
        endTyme: { type: String },
        isValidOnHolidays: { type: Boolean },
        isAddition: { type: Boolean },
        isExtras: { type: Boolean },
      }],
      priceDesc: { type: String, required: true },
      price: { type: Number, required: true },
    }],
    special: [{
      campaign: { type: String},
      types: [{
        values: [{ type: String }],
        daysOfWeek: [{ type: String }],
        startTime: { type: String },
        endTyme: { type: String },
        isValidOnHolidays: { type: Boolean },
        isAddition: { type: Boolean },
        isExtras: { type: Boolean },
      }],
      priceDesc: { type: String },
      price: { type: Number },
    }],
    extras: [{ type: String }],
  }
}, {
  timestamps: true,
});

export default mongoose.model<ITheaterInfo>('TheaterInfo', TheaterInfoSchema);
