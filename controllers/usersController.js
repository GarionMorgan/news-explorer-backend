// controllers/usersController.js
import User from '../models/user.js';
import { NotFoundError } from '../errors/ApiError.js';
import MESSAGES from '../utils/constants.js';

export default async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('email name');
    if (!user) return next(new NotFoundError(MESSAGES.USER_NOT_FOUND));
    return res.json({ email: user.email, name: user.name });
  } catch (err) {
    return next(err);
  }
}
