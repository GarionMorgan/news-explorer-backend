// routes/users.js
import express from "express";
import auth from "../middlewares/auth.js";
import { getCurrentUser } from "../controllers/usersController.js";

const router = express.Router();

router.get("/me", auth, getCurrentUser);

export default router;
