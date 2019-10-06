import mongoose, { Schema } from 'mongoose';

import { ITheaterInfo } from '../../types/models/TheaterInfo';

const TheaterInfoSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  phone_number: { type: String },
  uri: { type: String, required: true },
  maps_uri: { type: String, required: true },
  now_playing_movies: {
    movie_id: { type: Number },
    theater_sessions: [{
      room_number: { type: String },
      room_sessions: [{
        day: { type: String },
        day_of_week: { type: String },
        session_schedule: [{
          time: { type: String },
          info_abbr: { type: String },
          info_desc: { type: String },
        }],
      }],
    }],
  },
  has_3d: { type: Boolean },
  has_imax: { type: Boolean },
  address: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    postal_code: { type: String, required: true },
    locality: { type: String, required: true },
    region: { type: String, required: true },
    country: { type: String, required: true },
  },
  ticket_prices: {
    default: [{
      description: { type: String, required: true },
      types: [{
        values: [{ type: String }],
        days_of_week: [{ type: String }],
        start_time: { type: String },
        end_time: { type: String },
        is_valid_on_holidays: { type: Boolean },
        is_addition: { type: Boolean },
        is_extras: { type: Boolean },
      }],
      price_desc: { type: String, required: true },
      price: { type: Number, required: true },
    }],
    special: [{
      campaign: { type: String},
      types: [{
        values: [{ type: String }],
        days_of_week: [{ type: String }],
        start_time: { type: String },
        end_time: { type: String },
        is_valid_on_holidays: { type: Boolean },
        is_addition: { type: Boolean },
        is_extras: { type: Boolean },
      }],
      price_desc: { type: String },
      price: { type: Number },
    }],
    extras: [{ type: String }],
  }
}, {
  timestamps: true,
});

export default mongoose.model<ITheaterInfo>('TheaterInfo', TheaterInfoSchema);
