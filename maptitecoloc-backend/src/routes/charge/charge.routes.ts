import { Router } from 'express';
import * as chargeController from "../../controllers/charge.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const routes = Router();

// Route pour ajouter une charge
routes.post("/", authenticate, chargeController.addCharge);

// Route pour supprimer une charge
routes.delete("/:id", authenticate, chargeController.deleteCharge);

// Route pour obtenir l'historique des charges d'une colocation
routes.get("/:colocationId", authenticate, chargeController.getChargesByColocation);

// Route pour obtenir l'historique des paiements d'une colocation
routes.get("/:colocationId/history", authenticate, chargeController.getPaymentHistory);

// Route pour payer/rembourser un membre mais à retirer car plus besoin
routes.post("/:id/payMember", authenticate, chargeController.payMember);

// Route pour payer une charge
routes.post("/:id/pay", authenticate, chargeController.payCharge);

export default routes;
