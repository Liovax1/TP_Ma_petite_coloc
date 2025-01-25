import { Request, Response } from "express";
import { ChargeService } from "../services/charge.service";
import { IUser } from "../models/user.model";

const chargeService = new ChargeService();

interface CustomRequest extends Request {
  user?: IUser;
}

export const addCharge = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }
    const charge = await chargeService.addCharge({ ...req.body, paidBy: req.user._id });
    res.status(201).json(charge);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCharge = async (req: Request, res: Response): Promise<void> => {
  try {
    const charge = await chargeService.deleteCharge(req.params.id);
    if (!charge) {
      res.status(404).json({ message: "Charge not found" });
      return;
    }
    res.status(200).json({ message: "Charge deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getChargesByColocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const charges = await chargeService.getChargesByColocation(req.params.colocationId);
    res.status(200).json(charges);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const payMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, memberId } = req.body;
    console.log(`Paying ${amount} to member ${memberId}`);
    res.status(200).json({ message: `Paid ${amount} to member ${memberId}` });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
