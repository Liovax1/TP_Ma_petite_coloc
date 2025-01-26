import { UserModel, IUser } from "../models/user.model";
import { UserToCreateDTO } from "../types/user/dtos";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import { LoggerService } from "../services/logger.service"; // Ajoutez cette ligne

const loggerService = new LoggerService(); // Ajoutez cette ligne

export class UserService {
  async registerUser(userToCreate: UserToCreateDTO): Promise<IUser> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await UserModel.findOne({ email: userToCreate.email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hasher le mot de passe
    const password_hash = await bcrypt.hash(userToCreate.password, 10);

    // Créer l'utilisateur
    const createdUser = new UserModel({ ...userToCreate, password_hash });

    // Sauvegarder l'utilisateur
    const savedUser = await createdUser.save();
    await loggerService.logAction('register', savedUser._id); // Ajoutez cette ligne

    // Retourner l'utilisateur créé
    return savedUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async findById(id: string | mongoose.Types.ObjectId): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async deleteUser(id: string | mongoose.Types.ObjectId): Promise<IUser | null> { // Ajoutez cette méthode
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (deletedUser) {
      await loggerService.logAction('delete', deletedUser._id); // Ajoutez cette ligne
    }
    return deletedUser;
  }
}