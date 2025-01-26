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
    const charge = await chargeService.addCharge(req.body);
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
    const { chargeId, memberId, amount } = req.body;
    await chargeService.payMember(chargeId, memberId, amount);
    res.status(200).json({ message: `Paid ${amount} to member ${memberId}` });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const charges = await chargeService.getPaymentHistory(req.params.colocationId);
    res.status(200).json(charges);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const payCharge = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    const charge = await chargeService.payCharge(req.params.id, amount);
    res.status(200).json({ charge, remainingAmount: charge?.remainingAmount });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
