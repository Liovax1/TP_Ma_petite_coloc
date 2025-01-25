import { ChargeModel, ICharge } from "../models/charge.model";

export class ChargeService {
  async addCharge(data: Partial<ICharge>): Promise<ICharge> {
    const charge = new ChargeModel(data);
    return charge.save();
  }

  async deleteCharge(id: string): Promise<ICharge | null> {
    return ChargeModel.findByIdAndDelete(id);
  }

  async getChargesByColocation(colocationId: string): Promise<ICharge[]> {
    return ChargeModel.find({ colocationId }).populate('paidBy sharedBy.userId');
  }
}

