import { Document } from 'mongoose';

export interface IMovieInfo extends Document {
  id: number,
  locale: string;
  adult: boolean;
  backdrop_path?: string;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget?: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ],
  homepage?: string;
  imdb_id?: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity?: number;
  poster_path?: string;
  poster_url?: string;
  production_companies?: [
    {
      id: number;
      logo_path?: string;
      name: string;
      origin_country: string;
    }
  ],
  production_countries?: [
    {
      iso_3166_1: string;
      name: string;
    }
  ],
  release_date?: string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: [
    {
      iso_639_1: string;
      name: string;
    }
  ],
  status?: string;
  tagline?: string;
  title?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
  theater_ids?: Array<string>;
}
