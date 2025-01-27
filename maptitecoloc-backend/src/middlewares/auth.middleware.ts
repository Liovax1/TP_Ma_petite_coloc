import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { IUser } from '../models/user.model';
import { AuthService } from '../services/auth.service';

dotenv.config();

const authService = new AuthService();

interface CustomRequest extends Request {
  user?: IUser;
}

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Invalid token format' });
    return;
  }

  try {
    console.log("Received token:", token);

    const decoded = authService.verifyToken(token);
    console.log("Decoded token:", decoded);

    req.user = decoded as IUser;
    req.user._id = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
