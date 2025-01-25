import { Router } from 'express';
import * as colocationController from "../../controllers/colocation.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const routes = Router();

// Route pour créer une colocation
routes.post("/", authenticate, colocationController.createColocation);

// Route pour lister les colocations d'un utilisateur
routes.get("/", authenticate, colocationController.getColocationsByUser);

// Route pour obtenir les informations d'une colocation
routes.get("/:id", authenticate, colocationController.getColocationById);

// Route pour supprimer une colocation
routes.delete("/:id", authenticate, colocationController.deleteColocation);

// Route pour ajouter un membre à une colocation
routes.put("/:id/members", authenticate, colocationController.addMember);

// Route pour supprimer un membre d'une colocation
routes.delete("/:id/members", authenticate, colocationController.removeMember);

// Route pour transférer la colocation à un autre membre
routes.post("/:id/transfer", authenticate, colocationController.transferOwnership);

export default routes;
