// routes/auth.js

import express from "express";
import { signup, signin, signout, me } from "../controllers/authController.js";
import {
  signupValidator,
  signinValidator,
} from "../validators/authValidators.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/signin", signinValidator, signin);
router.post("/signout", signout);
router.get("/me", auth, me);

export default router;
