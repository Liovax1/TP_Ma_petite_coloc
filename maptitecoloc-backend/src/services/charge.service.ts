import { ChargeModel, ICharge } from "../models/charge.model";
import { LoggerService } from "../services/logger.service";
import mongoose from "mongoose";

const loggerService = new LoggerService();

export class ChargeService {
  async addCharge(data: Partial<ICharge>, userId?: string): Promise<ICharge> {
    const charge = new ChargeModel(data);
    const savedCharge: ICharge = await charge.save();
    if (userId) {
      await loggerService.logAction('add_charge', (savedCharge._id as mongoose.Types.ObjectId).toString(), userId);
    }
    return savedCharge;
  }

  async deleteCharge(id: string, userId?: string): Promise<ICharge | null> {
    const deletedCharge = await ChargeModel.findByIdAndDelete(id);
    if (deletedCharge && userId) {
      await loggerService.logAction('delete_charge', (deletedCharge._id as mongoose.Types.ObjectId).toString(), userId);
    }
    return deletedCharge;
  }

  async getChargesByColocation(colocationId: string): Promise<ICharge[]> {
    return ChargeModel.find({ colocationId }).populate('sharedBy.userId');
  }

  async payMember(chargeId: string, memberId: string, amount: number, userId?: string): Promise<void> {
    console.log(`Paying ${amount} to member ${memberId} for charge ${chargeId}`);
    if (userId) {
      await loggerService.logAction('pay_member', chargeId, userId);
    }
  }

  async getPaymentHistory(colocationId: string): Promise<ICharge[]> {
    return ChargeModel.find({ colocationId }).populate('sharedBy.userId');
  }

  async payCharge(chargeId: string, amount: number, userId?: string): Promise<ICharge | null> {
    const charge = await ChargeModel.findById(chargeId);
    if (!charge) {
      throw new Error("Charge not found");
    }

    charge.amountPaid += amount;
    if (charge.amountPaid > charge.amount) {
      throw new Error("Amount exceeds the total charge");
    }

    await charge.save();
    if (userId) {
      await loggerService.logAction('pay_charge', chargeId, userId);
    }
    return charge;
  }
}

