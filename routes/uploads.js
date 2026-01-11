import express from "express";
import { streamImage } from "../controllers/uploadsController.js";

const router = express.Router();

router.get("/:id", streamImage);

export default router;
