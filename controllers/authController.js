// controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import parseMongoError from '../utils/parseMongoError.js';
import {
  ApiError,
  UnauthorizedError,
  NotFoundError,
} from '../errors/ApiError.js';
import RevokedToken from '../models/revokedToken.js';
import config from '../config/index.js';
import MESSAGES from '../utils/constants.js';

const JWT_SECRET = config.JWT_SECRET || process.env.JWT_SECRET || 'secret-key';
const JWT_EXPIRES_IN = '7d';

export async function signup(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    return res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    const parsed = parseMongoError(err);
    if (parsed) return next(new ApiError(parsed.status, parsed.message));
    return next(err);
  }
}

export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return next(new UnauthorizedError(MESSAGES.INVALID_EMAIL_OR_PASSWORD));

    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches)
      return next(new UnauthorizedError(MESSAGES.INVALID_EMAIL_OR_PASSWORD));

    const payload = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
}

export async function signout(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    // If no token was provided, treat as already signed out (idempotent).
    // This avoids forcing clients to keep a token when logging out and
    // prevents a 401 during logout flows where the client cleared the token.
    if (!token) {
      return res.json({ message: MESSAGES.SIGNED_OUT });
    }

    const decoded = jwt.decode(token);
    const exp = decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;

    await RevokedToken.create({
      token,
      expiresAt: exp || new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });

    return res.json({ message: MESSAGES.SIGNED_OUT });
  } catch (err) {
    return next(err);
  }
}

export async function me(req, res, next) {
  try {
    const userId = req.user && req.user._id;
    if (!userId)
      return next(new UnauthorizedError(MESSAGES.AUTHORIZATION_REQUIRED));

    const user = await User.findById(userId);
    if (!user) return next(new NotFoundError(MESSAGES.USER_NOT_FOUND));

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    return next(err);
  }
}
