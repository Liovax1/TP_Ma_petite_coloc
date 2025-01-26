import { ChargeModel, ICharge } from "../models/charge.model";
import { LoggerService } from "../services/logger.service"; // Ajoutez cette ligne
import mongoose from "mongoose"; // Ajoutez cette ligne

const loggerService = new LoggerService(); // Ajoutez cette ligne

export class ChargeService {
  async addCharge(data: Partial<ICharge>): Promise<ICharge> {
    const charge = new ChargeModel(data);
    const savedCharge: ICharge = await charge.save();
    await loggerService.logAction('add_charge', (savedCharge._id as mongoose.Types.ObjectId).toString()); // Utilisez une assertion de type
    return savedCharge;
  }

  async deleteCharge(id: string): Promise<ICharge | null> {
    const deletedCharge = await ChargeModel.findByIdAndDelete(id);
    if (deletedCharge) {
      await loggerService.logAction('delete_charge', (deletedCharge._id as mongoose.Types.ObjectId).toString()); // Utilisez une assertion de type
    }
    return deletedCharge;
  }

  async getChargesByColocation(colocationId: string): Promise<ICharge[]> {
    return ChargeModel.find({ colocationId }).populate('sharedBy.userId');
  }

  async payMember(chargeId: string, memberId: string, amount: number): Promise<void> {
    console.log(`Paying ${amount} to member ${memberId} for charge ${chargeId}`);
    await loggerService.logAction('pay_member', chargeId); // Ajoutez cette ligne
    // Logique de paiement à ajouter ici
  }

  async getPaymentHistory(colocationId: string): Promise<ICharge[]> {
    return ChargeModel.find({ colocationId }).populate('sharedBy.userId');
  }

  async payCharge(chargeId: string, amount: number): Promise<ICharge | null> {
    const charge = await ChargeModel.findById(chargeId);
    if (!charge) {
      throw new Error("Charge not found");
    }

    charge.amountPaid += amount;
    if (charge.amountPaid > charge.amount) {
      throw new Error("Amount exceeds the total charge");
    }

    await charge.save();
    await loggerService.logAction('pay_charge', chargeId); // Ajoutez cette ligne
    return charge;
  }
}

