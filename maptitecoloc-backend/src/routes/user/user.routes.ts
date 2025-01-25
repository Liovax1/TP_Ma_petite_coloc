import { Router } from 'express';
import * as userController from "../../controllers/user.controller";
import * as authController from "../../controllers/auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const routes = Router();

// Route pour l'inscription d'un utilisateur
routes.post("/register", userController.registerUser);

// Route pour la connexion d'un utilisateur
routes.post("/login", authController.login);

// Route pour rafraîchir le token
routes.post("/refresh", authController.refreshToken);

// Route pour récupérer le profil de l'utilisateur connecté
routes.get("/me", authenticate, userController.getUserProfile);

// Route pour supprimer l'utilisateur connecté
routes.delete("/me", authenticate, userController.deleteUser);

export default routes;