import { LogModel } from "../models/log.model";

export class LoggerService {
  async logAction(action: string, entityId: string, userId: string): Promise<void> {
    const log = new LogModel({ action, entityId, userId }); 
    await log.save();
  }
}
