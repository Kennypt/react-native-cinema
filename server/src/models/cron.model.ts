import mongoose, { Schema } from 'mongoose';
import { ICron } from '../types/models/Cron';

const CronSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  startDate: { type: Number, required: true },
  endDate: { type: Number, required: true },
  status: { type: String, required: true },
  retries: { type: Number, required: true, default: 0 },
}, {
  timestamps: true,
});

export default mongoose.model<ICron>('Cron', CronSchema);
