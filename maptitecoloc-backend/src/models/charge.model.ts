import { Schema, model, Document } from 'mongoose';

interface ICharge extends Document {
  description: string;
  amount: number;
  sharedBy: { userId: string, amount: number }[];
  colocationId: string;
  date: Date;
  amountPaid: number;
  remainingAmount: number;
  userId: string;
}

const chargeSchema = new Schema<ICharge>({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  sharedBy: [{ userId: { type: Schema.Types.String, ref: 'User' }, amount: { type: Number, required: true } }],
  colocationId: { type: Schema.Types.String, ref: 'Colocation', required: true },
  date: { type: Date, default: Date.now },
  amountPaid: { type: Number, default: 0 },
  userId: { type: Schema.Types.String, ref: 'User', required: true }
});

chargeSchema.virtual('remainingAmount').get(function() {
  return this.amount - this.amountPaid;
});

const ChargeModel = model<ICharge>('Charge', chargeSchema);

export { ChargeModel, ICharge };
