import { LogModel } from "../models/log.model";

export class LoggerService {
  async logAction(action: string, entityId: string, userId: string): Promise<void> { // Ajoutez userId comme paramètre
    const log = new LogModel({ action, entityId, userId }); // Créez un nouveau log avec userId
    await log.save();
  }
}
