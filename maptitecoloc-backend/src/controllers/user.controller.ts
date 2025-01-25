import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserToCreateDTO } from "../types/user/dtos";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UserPresenter } from "../types/user/presenters";
import { IUser } from "../models/user.model";

const userService = new UserService();

interface CustomRequest extends Request {
  user?: IUser;
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Request body:", req.body); // Ajoutez ce log pour vérifier les données reçues

    const userToCreateDTO = plainToInstance(UserToCreateDTO, req.body, { excludeExtraneousValues: true });

    const dtoErrors = await validate(userToCreateDTO);
    if (dtoErrors.length > 0) {
      console.log("Validation errors:", dtoErrors); // Ajoutez ce log pour vérifier les erreurs de validation
      throw new Error("Invalid fields");
    }

    const user = await userService.registerUser(userToCreateDTO);
    // appeler le logger service pour enregistrer QUI a créé un utilisateur (peut être un admin ou l'utilisateur lui-même)

    const createdUser = plainToInstance(UserPresenter, user.toObject(), { excludeExtraneousValues: true });
    res.status(201).json(createdUser); // à vous de créer une classe pour gérer les success
  } catch (error: any) {
    console.log("Error:", error.message); // Ajoutez ce log pour vérifier les erreurs
    res.status(400).json({ message: error.message });
  }
};

export const getUserProfile = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    console.log("Decoded user:", req.user); // Ajoutez ce log pour vérifier l'utilisateur décodé

    const userId = req.user._id || req.user.id; // Utiliser _id ou id selon ce qui est disponible
    const user = await userService.findById(userId); // Utiliser l'ID pour la recherche
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userProfile = plainToInstance(UserPresenter, user.toObject(), { excludeExtraneousValues: true });
    res.status(200).json(userProfile); // Retourner uniquement userProfile
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    const userId = req.user._id || req.user.id; // Utiliser _id ou id selon ce qui est disponible
    const user = await userService.deleteUser(userId); // Utiliser l'ID pour la suppression
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};