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
    const chargeData = { ...req.body, userId: req.user._id }; // Ajoutez userId aux données de la charge
    const charge = await chargeService.addCharge(chargeData, req.user._id);
    res.status(201).json(charge);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCharge = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }
    const charge = await chargeService.deleteCharge(req.params.id, req.user._id);
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

export const payMember = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }
    const { chargeId, memberId, amount } = req.body;
    await chargeService.payMember(chargeId, memberId, amount, req.user._id);
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

export const payCharge = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }
    const { amount } = req.body;
    const charge = await chargeService.payCharge(req.params.id, amount, req.user._id);
    if (!charge) {
      res.status(404).json({ message: "Charge not found" });
      return;
    }

    const remainingAmount = charge.amount - charge.amountPaid;
    const remainingAmountPerPerson = charge.sharedBy.map(share => ({
      userId: share.userId,
      remainingAmount: share.amount - (charge.amountPaid * (share.amount / charge.amount))
    }));

    res.status(200).json({ charge, remainingAmount, remainingAmountPerPerson });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
