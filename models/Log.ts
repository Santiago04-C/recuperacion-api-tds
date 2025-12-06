import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  userId: string;
  action: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

const LogSchema = new Schema<ILog>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

export default mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);
