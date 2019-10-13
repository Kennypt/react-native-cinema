import mongoose, { Schema } from 'mongoose';

import { IGenres } from '../../types/models/Genres';

const Genres: Schema = new Schema({
  locale: { type: String, required: true, unique: true },
  list: [{
    id: Number,
    name: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.model<IGenres>('Genres', Genres);
