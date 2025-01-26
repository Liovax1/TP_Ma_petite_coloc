import { Request, Response } from "express";
import { ColocationService } from "../services/colocation.service";
import { IUser } from "../models/user.model";
import { IColocation } from "../models/colocation.model";
import { SuccessResponse, ErrorResponse } from "../utils/response.util";

const colocationService = new ColocationService();

interface CustomRequest extends Request {
  user?: IUser;
}

export const createColocation = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json(ErrorResponse.simple(400, "USER_ID_MISSING", "User ID is missing"));
      return;
    }
    const colocation: IColocation = await colocationService.createColocation({ ...req.body, owner: req.user._id });
    res.status(201).json(SuccessResponse.simple(colocation));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "COLOCATION_CREATION_FAILED", error.message));
  }
};

export const getColocationsByUser = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json(ErrorResponse.simple(400, "USER_ID_MISSING", "User ID is missing"));
      return;
    }
    const colocations = await colocationService.getColocationsByUser(req.user._id);
    res.status(200).json(SuccessResponse.list(colocations));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "COLOCATIONS_FETCH_FAILED", error.message));
  }
};

export const getColocationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const colocation = await colocationService.getColocationById(req.params.id);
    if (!colocation) {
      res.status(404).json(ErrorResponse.simple(404, "COLOCATION_NOT_FOUND", "Colocation not found"));
      return;
    }
    res.status(200).json(SuccessResponse.simple(colocation));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "COLOCATION_FETCH_FAILED", error.message));
  }
};

export const deleteColocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const colocation = await colocationService.deleteColocation(req.params.id);
    if (!colocation) {
      res.status(404).json(ErrorResponse.simple(404, "COLOCATION_NOT_FOUND", "Colocation not found"));
      return;
    }
    res.status(200).json(SuccessResponse.simple({ message: "Colocation deleted successfully" }));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "COLOCATION_DELETION_FAILED", error.message));
  }
};

export const addMember = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json(ErrorResponse.simple(400, "USER_ID_MISSING", "User ID is missing"));
      return;
    }
    const colocation = await colocationService.getColocationById(req.params.id);
    if (!colocation) {
      res.status(404).json(ErrorResponse.simple(404, "COLOCATION_NOT_FOUND", "Colocation not found"));
      return;
    }
    if (colocation.owner !== req.user._id.toString()) {
      res.status(403).json(ErrorResponse.simple(403, "FORBIDDEN", "Only the owner can add members"));
      return;
    }
    const updatedColocation = await colocationService.addMember(req.params.id, req.body.userId);
    res.status(200).json(SuccessResponse.simple(updatedColocation));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "ADD_MEMBER_FAILED", error.message));
  }
};

export const removeMember = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json(ErrorResponse.simple(400, "USER_ID_MISSING", "User ID is missing"));
      return;
    }
    const colocation = await colocationService.getColocationById(req.params.id);
    if (!colocation || colocation.owner !== req.user._id.toString()) {
      res.status(403).json(ErrorResponse.simple(403, "FORBIDDEN", "Only the owner can remove members"));
      return;
    }
    const updatedColocation = await colocationService.removeMember(req.params.id, req.body.userId);
    res.status(200).json(SuccessResponse.simple(updatedColocation));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "REMOVE_MEMBER_FAILED", error.message));
  }
};

export const transferOwnership = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json(ErrorResponse.simple(400, "USER_ID_MISSING", "User ID is missing"));
      return;
    }
    const colocation = await colocationService.getColocationById(req.params.id);
    if (!colocation || colocation.owner !== req.user._id.toString()) {
      res.status(403).json(ErrorResponse.simple(403, "FORBIDDEN", "Only the owner can transfer ownership"));
      return;
    }
    const updatedColocation = await colocationService.transferOwnership(req.params.id, req.body.newOwnerId);
    res.status(200).json(SuccessResponse.simple(updatedColocation));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "TRANSFER_OWNERSHIP_FAILED", error.message));
  }
};
