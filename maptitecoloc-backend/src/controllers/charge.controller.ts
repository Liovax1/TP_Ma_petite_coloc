import { Request, Response } from "express";
import { ChargeService } from "../services/charge.service";
import { IUser } from "../models/user.model";
import { SuccessResponse, ErrorResponse } from "../utils/response.util";

const chargeService = new ChargeService();

interface CustomRequest extends Request {
  user?: IUser;
}

export const addCharge = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json(ErrorResponse.simple(400, "USER_ID_MISSING", "User ID is missing"));
      return;
    }
    const chargeData = { ...req.body, userId: req.user._id };
    const charge = await chargeService.addCharge(chargeData, req.user._id);
    res.status(201).json(SuccessResponse.simple(charge));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "CHARGE_CREATION_FAILED", error.message));
  }
};

export const deleteCharge = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json(ErrorResponse.simple(400, "USER_ID_MISSING", "User ID is missing"));
      return;
    }
    const charge = await chargeService.deleteCharge(req.params.id, req.user._id);
    if (!charge) {
      res.status(404).json(ErrorResponse.simple(404, "CHARGE_NOT_FOUND", "Charge not found"));
      return;
    }
    res.status(200).json(SuccessResponse.simple({ message: "Charge deleted successfully" }));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "CHARGE_DELETION_FAILED", error.message));
  }
};

export const getChargesByColocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const charges = await chargeService.getChargesByColocation(req.params.colocationId);
    res.status(200).json(SuccessResponse.list(charges));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "CHARGES_FETCH_FAILED", error.message));
  }
};

export const payMember = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json(ErrorResponse.simple(400, "USER_ID_MISSING", "User ID is missing"));
      return;
    }
    const { chargeId, memberId, amount } = req.body;
    await chargeService.payMember(chargeId, memberId, amount, req.user._id);
    res.status(200).json(SuccessResponse.simple({ message: `Paid ${amount} to member ${memberId}` }));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "PAY_MEMBER_FAILED", error.message));
  }
};

export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const charges = await chargeService.getPaymentHistory(req.params.colocationId);
    res.status(200).json(SuccessResponse.list(charges));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "PAYMENT_HISTORY_FETCH_FAILED", error.message));
  }
};

export const payCharge = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(400).json(ErrorResponse.simple(400, "USER_ID_MISSING", "User ID is missing"));
      return;
    }
    const { amount } = req.body;
    const charge = await chargeService.payCharge(req.params.id, amount, req.user._id);
    if (!charge) {
      res.status(404).json(ErrorResponse.simple(404, "CHARGE_NOT_FOUND", "Charge not found"));
      return;
    }

    const remainingAmount = charge.amount - charge.amountPaid;
    const remainingAmountPerPerson = charge.sharedBy.map(share => ({
      userId: share.userId,
      remainingAmount: share.amount - (charge.amountPaid * (share.amount / charge.amount))
    }));

    res.status(200).json(SuccessResponse.simple({ charge, remainingAmount, remainingAmountPerPerson }));
  } catch (error: any) {
    res.status(400).json(ErrorResponse.simple(400, "PAY_CHARGE_FAILED", error.message));
  }
};
