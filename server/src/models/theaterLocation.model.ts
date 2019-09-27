import mongoose, { Schema } from 'mongoose';

import { ITheaterLocation } from '../types/models/TheaterLocation';
import CountryCodes from '../enums/countries';

const TheaterLocationSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, default: 'Portugal' },
  code: { type: String, required: true, unique: true, default: CountryCodes.PORTUGAL },
  regions: { type: [{
    name: { type: String, required: true },
    theaters: { type: [{
      name: { type: String, required: true },
      uri: { type: String, required: true },
    }]}
  }], required: true }
}, {
  timestamps: true,
});

export default mongoose.model<ITheaterLocation>('TheaterLocation', TheaterLocationSchema);
