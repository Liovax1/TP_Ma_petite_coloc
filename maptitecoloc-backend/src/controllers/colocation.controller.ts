import { Request, Response } from "express";
import { ColocationService } from "../services/colocation.service";
import { IUser } from "../models/user.model";
import { IColocation } from "../models/colocation.model"; // Ajoutez cette ligne

const colocationService = new ColocationService();

interface CustomRequest extends Request {
  user?: IUser;
}

export const createColocation = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }
    console.log("User ID:", req.user._id); // Ajoutez ce log pour vérifier l'ID de l'utilisateur
    const colocation: IColocation = await colocationService.createColocation({ ...req.body, owner: req.user._id });
    res.status(201).json(colocation);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getColocationsByUser = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }
    console.log("User ID:", req.user._id); // Ajoutez ce log pour vérifier l'ID de l'utilisateur
    const colocations = await colocationService.getColocationsByUser(req.user._id);
    res.status(200).json(colocations);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getColocationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const colocation = await colocationService.getColocationById(req.params.id);
    if (!colocation) {
      res.status(404).json({ message: "Colocation not found" });
      return;
    }
    res.status(200).json(colocation);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteColocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const colocation = await colocationService.deleteColocation(req.params.id);
    if (!colocation) {
      res.status(404).json({ message: "Colocation not found" });
      return;
    }
    res.status(200).json({ message: "Colocation deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const addMember = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }
    console.log("User ID:", req.user._id); // Ajoutez ce log pour vérifier l'ID de l'utilisateur
    const colocation = await colocationService.getColocationById(req.params.id);
    if (!colocation) {
      res.status(404).json({ message: "Colocation not found" });
      return;
    }
    console.log("Colocation owner ID:", colocation.owner); // Ajoutez ce log pour vérifier l'ID du propriétaire
    if (colocation.owner !== req.user._id.toString()) {
      res.status(403).json({ message: "Only the owner can add members" });
      return;
    }
    const updatedColocation = await colocationService.addMember(req.params.id, req.body.userId);
    res.status(200).json(updatedColocation);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const removeMember = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }
    console.log("User ID:", req.user._id); // Ajoutez ce log pour vérifier l'ID de l'utilisateur
    const colocation = await colocationService.getColocationById(req.params.id);
    if (!colocation || colocation.owner !== req.user._id.toString()) {
      res.status(403).json({ message: "Only the owner can remove members" });
      return;
    }
    const updatedColocation = await colocationService.removeMember(req.params.id, req.body.userId);
    res.status(200).json(updatedColocation);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const transferOwnership = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }
    console.log("User ID:", req.user._id); // Ajoutez ce log pour vérifier l'ID de l'utilisateur
    const colocation = await colocationService.getColocationById(req.params.id);
    if (!colocation || colocation.owner !== req.user._id.toString()) {
      res.status(403).json({ message: "Only the owner can transfer ownership" });
      return;
    }
    const updatedColocation = await colocationService.transferOwnership(req.params.id, req.body.newOwnerId);
    res.status(200).json(updatedColocation);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
