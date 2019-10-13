import mongoose, { Schema } from 'mongoose';

import { IMovieInfo } from '../../types/models/MovieInfo';

const MovieInfoSchema: Schema = new Schema({
  id: { type: Number },
  locale: { type: String },
  adult: { type: Boolean },
  backdrop_path: { type: String },
  belongs_to_collection: {
    id: { type: Number },
    name: { type: String },
    poster_path: { type: String },
    backdrop_path: { type: String },
  },
  budget: { type: Number },
  genres: [
    {
      id: { type: Number },
      name: { type: String },
    },
  ],
  homepage: { type: String },
  imdb_id: { type: String },
  original_language: { type: String },
  original_title: { type: String },
  overview: { type: String },
  popularity: { type: Number },
  poster_path: { type: String },
  poster_url: { type: String },
  production_companies: [
    {
      id: { type: Number },
      name: { type: String },
      logo_path: { type: String },
      origin_country: { type: String },
    }
  ],
  production_countries: [
    {
      iso_3166_1: { type: String },
      name: { type: String },
    }
  ],
  release_date: { type: String },
  revenue: { type: Number },
  runtime: { type: Number },
  spoken_languages: [
    {
      iso_3166_1: { type: String },
      name: { type: String },
    }
  ],
  status: { type: String },
  tagline: { type: String },
  title: { type: String },
  video: { type: Boolean },
  vote_average: { type: Number },
  vote_count: { type: Number },
  theater_ids: [{ type: String }],
}, {
  timestamps: true,
});

export default mongoose.model<IMovieInfo>('MovieInfo', MovieInfoSchema);
