import { ColocationModel, IColocation } from "../models/colocation.model";
import { IUser } from "../models/user.model";
import { LoggerService } from "../services/logger.service";
import mongoose from "mongoose";

const loggerService = new LoggerService();

export class ColocationService {
  async createColocation(data: Partial<IColocation>): Promise<IColocation> {
    const colocation = new ColocationModel({ ...data, members: [data.owner] }); // On ajoute le créateur comme membre
    const savedColocation: IColocation = await colocation.save();
    await loggerService.logAction('create_colocation', (savedColocation._id as mongoose.Types.ObjectId).toString(), data.owner as string);
    return savedColocation;
  }

  async getColocationsByUser(userId: string): Promise<IColocation[]> {
    return ColocationModel.find({ members: userId, isActive: true }).populate('members');
  }

  async getColocationById(id: string): Promise<IColocation | null> {
    return ColocationModel.findById(id).populate('members');
  }

  async deleteColocation(id: string): Promise<IColocation | null> {
    return ColocationModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async addMember(colocationId: string, userId: string): Promise<IColocation | null> {
    const updatedColocation = await ColocationModel.findByIdAndUpdate(
      colocationId,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate('members');
    if (updatedColocation) {
      await loggerService.logAction('add_member', colocationId, userId);
    }
    return updatedColocation;
  }

  async removeMember(colocationId: string, userId: string): Promise<IColocation | null> {
    const updatedColocation = await ColocationModel.findByIdAndUpdate(
      colocationId,
      { $pull: { members: userId } },
      { new: true }
    ).populate('members');
    if (updatedColocation) {
      await loggerService.logAction('remove_member', colocationId, userId);
    }
    return updatedColocation;
  }

  async transferOwnership(colocationId: string, newOwnerId: string): Promise<IColocation | null> {
    return ColocationModel.findByIdAndUpdate(
      colocationId,
      { owner: newOwnerId },
      { new: true }
    ).populate('members');
  }
}
