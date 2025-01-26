import { LogModel } from "../models/log.model"; // Assurez-vous de créer ce modèle

export class LoggerService {
  async logAction(action: string, userId: string): Promise<void> {
    const log = new LogModel({ action, userId, timestamp: new Date() });
    await log.save();
  }
}
