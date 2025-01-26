import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserToCreateDTO } from '../types/user/dtos';
import bcrypt from 'bcrypt';
import { IUser } from '../models/user.model';

const authService = new AuthService();
const userService = new UserService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const userToCreateDTO = plainToInstance(UserToCreateDTO, req.body, { excludeExtraneousValues: true });
    const dtoErrors = await validate(userToCreateDTO);
    if (dtoErrors.length > 0) {
      console.log(dtoErrors);
      throw new Error("Invalid fields");
    }

    const user = await userService.registerUser(userToCreateDTO);
    const token = authService.generateToken(user);
    const refreshToken = authService.generateRefreshToken(user);

    res.status(201).json({ id: user._id, token, refreshToken });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error('Invalid email or password');
    }

    const token = await authService.login(user);
    const refreshToken = authService.generateRefreshToken(user);

    res.status(200).json({ id: user._id, token, refreshToken });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const decoded = authService.verifyRefreshToken(refreshToken);
    const user = await userService.findById(decoded.id);
    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const newToken = authService.generateToken(user);
    const newRefreshToken = authService.generateRefreshToken(user);

    res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
