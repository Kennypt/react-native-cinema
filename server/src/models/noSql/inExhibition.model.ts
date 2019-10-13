import mongoose, { Schema } from 'mongoose';

import { IInExhibition } from '../../types/models/InExhibition';

const InExhibitionSchema: Schema = new Schema({
  country_code: { type: String, required: true, unique: true },
  list: [ { type: Number } ],
}, {
  timestamps: true,
});

export default mongoose.model<IInExhibition>('InExhibition', InExhibitionSchema);
