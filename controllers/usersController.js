// controllers/usersController.js
import User from "../models/user.js";

export async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("email name");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ email: user.email, name: user.name });
  } catch (err) {
    return next(err);
  }
}
