import { Schema, model, Document } from 'mongoose';

interface ICharge extends Document {
  description: string;
  amount: number;
  sharedBy: { userId: string, amount: number }[]; // Array of user IDs and their share
  colocationId: string; // Colocation ID
  date: Date;
  amountPaid: number; // Montant payé
  remainingAmount: number; // Montant restant à payer
  userId: string; // Ajoutez userId
}

const chargeSchema = new Schema<ICharge>({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  sharedBy: [{ userId: { type: Schema.Types.String, ref: 'User' }, amount: { type: Number, required: true } }],
  colocationId: { type: Schema.Types.String, ref: 'Colocation', required: true },
  date: { type: Date, default: Date.now },
  amountPaid: { type: Number, default: 0 }, // Montant payé initialisé à 0
  userId: { type: Schema.Types.String, ref: 'User', required: true } // Ajoutez userId au schéma
});

chargeSchema.virtual('remainingAmount').get(function() {
  return this.amount - this.amountPaid;
});

const ChargeModel = model<ICharge>('Charge', chargeSchema);

export { ChargeModel, ICharge };
