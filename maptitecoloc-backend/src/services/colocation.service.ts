import { ColocationModel, IColocation } from "../models/colocation.model";
import { IUser } from "../models/user.model";

export class ColocationService {
  async createColocation(data: Partial<IColocation>): Promise<IColocation> {
    const colocation = new ColocationModel({ ...data, members: [data.owner] }); // Ajoutez le créateur comme membre
    return colocation.save();
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
    return ColocationModel.findByIdAndUpdate(
      colocationId,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate('members');
  }

  async removeMember(colocationId: string, userId: string): Promise<IColocation | null> {
    return ColocationModel.findByIdAndUpdate(
      colocationId,
      { $pull: { members: userId } },
      { new: true }
    ).populate('members');
  }

  async transferOwnership(colocationId: string, newOwnerId: string): Promise<IColocation | null> {
    return ColocationModel.findByIdAndUpdate(
      colocationId,
      { owner: newOwnerId },
      { new: true }
    ).populate('members');
  }
}
