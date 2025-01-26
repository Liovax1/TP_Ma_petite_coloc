import { Schema, model, Document } from 'mongoose';

interface ILog extends Document {
  action: string;
  entityId: string;
  userId: string; // Ajoutez userId
  timestamp: Date;
}

const logSchema = new Schema<ILog>({
  action: { type: String, required: true },
  entityId: { type: String, required: true },
  userId: { type: String, required: true }, // Ajoutez userId au schéma
  timestamp: { type: Date, default: Date.now }
});

const LogModel = model<ILog>('Log', logSchema);

export { LogModel, ILog };
