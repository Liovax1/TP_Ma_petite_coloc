import { Schema, model, Document } from 'mongoose';

interface ICharge extends Document {
  description: string;
  amount: number;
  paidBy: string; // User ID
  sharedBy: { userId: string, amount: number }[]; // Array of user IDs and their share
  colocationId: string; // Colocation ID
  date: Date;
}

const chargeSchema = new Schema<ICharge>({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: Schema.Types.String, ref: 'User', required: true },
  sharedBy: [{ userId: { type: Schema.Types.String, ref: 'User' }, amount: { type: Number, required: true } }],
  colocationId: { type: Schema.Types.String, ref: 'Colocation', required: true },
  date: { type: Date, default: Date.now }
});

const ChargeModel = model<ICharge>('Charge', chargeSchema);

export { ChargeModel, ICharge };
