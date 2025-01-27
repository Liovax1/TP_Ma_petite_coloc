import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import { LoggerService } from "../services/logger.service";

const loggerService = new LoggerService();

export class AuthService {
  generateToken(user: IUser): string {
    const payload = { id: user._id, email: user.email };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }

  generateRefreshToken(user: IUser): string {
    const payload = { id: user._id, email: user.email };
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
  }

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
  }

  async login(user: IUser): Promise<string> {
    const token = this.generateToken(user);
    await loggerService.logAction('login', user._id.toString(), user._id.toString());
    return token;
  }
}
