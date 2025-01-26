import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserToCreateDTO } from "../types/user/dtos";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UserPresenter } from "../types/user/presenters";
import { IUser } from "../models/user.model";
import { SuccessResponse, ErrorResponse } from "../utils/response.util"; // Importez les classes utilitaires

const userService = new UserService();

interface CustomRequest extends Request {
  user?: IUser;
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userToCreateDTO = plainToInstance(UserToCreateDTO, req.body, { excludeExtraneousValues: true });
    const dtoErrors = await validate(userToCreateDTO);
    if (dtoErrors.length > 0) {
      const errorFields = dtoErrors.map(error => ({
        name: error.property,
        errMsg: Object.values(error.constraints || {}).join(", ")
      }));
      res.status(400).json(ErrorResponse.form("UserToCreateDTO", errorFields));
      return;
    }

    const user = await userService.registerUser(userToCreateDTO);
    const createdUser = plainToInstance(UserPresenter, user.toObject(), { excludeExtraneousValues: true });
    res.status(201).json(SuccessResponse.simple(createdUser));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "USER_REGISTRATION_FAILED", error.message));
  }
};

export const getUserProfile = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(400).json(ErrorResponse.simple(400, "USER_ID_MISSING", "User ID is missing"));
      return;
    }

    const userId = req.user._id || req.user.id;
    const user = await userService.findById(userId);
    if (!user) {
      res.status(404).json(ErrorResponse.simple(404, "USER_NOT_FOUND", "User not found"));
      return;
    }

    const userProfile = plainToInstance(UserPresenter, user.toObject(), { excludeExtraneousValues: true });
    res.status(200).json(SuccessResponse.simple(userProfile));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "USER_PROFILE_FETCH_FAILED", error.message));
  }
};

export const deleteUser = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(400).json(ErrorResponse.simple(400, "USER_ID_MISSING", "User ID is missing"));
      return;
    }

    const userId = req.user._id || req.user.id;
    const user = await userService.deleteUser(userId);
    if (!user) {
      res.status(404).json(ErrorResponse.simple(404, "USER_NOT_FOUND", "User not found"));
      return;
    }

    res.status(200).json(SuccessResponse.simple({ message: "User deleted successfully" }));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "USER_DELETION_FAILED", error.message));
  }
};