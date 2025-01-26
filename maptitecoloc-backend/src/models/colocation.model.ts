import { Schema, model, Document } from 'mongoose';

interface IColocation extends Document {
  name: string;
  location: string;
  surface: number;
  rooms: number;
  owner: string;
  isActive: boolean;
  members: string[];
}

const colocationSchema = new Schema<IColocation>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  surface: { type: Number, required: true },
  rooms: { type: Number, required: true },
  owner: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const ColocationModel = model<IColocation>('Colocation', colocationSchema);

export { ColocationModel, IColocation };
