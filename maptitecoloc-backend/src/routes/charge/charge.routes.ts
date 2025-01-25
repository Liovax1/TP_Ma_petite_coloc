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

// Route pour payer/rembourser un membre
routes.post("/:id/pay", authenticate, chargeController.payMember);

export default routes;
