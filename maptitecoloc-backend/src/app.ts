import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user/user.routes";
import colocationRoutes from "./routes/colocation/colocation.routes";
import chargeRoutes from "./routes/charge/charge.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Middlewares globaux
app.use(express.json()); // Permet de lire le body en JSON
app.use(cors());         // Active CORS pour les requêtes cross-origin
app.use(helmet());       // Sécurise les headers HTTP

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Routes
app.use("/api/users", userRoutes); // Routes pour les utilisateurs
app.use("/api/colocations", colocationRoutes); // Routes pour les colocations
app.use("/api/charges", chargeRoutes); // Routes pour les charges

// Middleware de gestion des erreurs
app.use(errorHandler);

export default app;