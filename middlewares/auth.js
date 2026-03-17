// middlewares/auth.js
import jwt from 'jsonwebtoken';
import RevokedToken from '../models/revokedToken.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export default async function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authorization required' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // check if token is revoked
    const revoked = await RevokedToken.findOne({ token });
    if (revoked) return res.status(401).json({ error: 'Token has been revoked' });

    req.user = { _id: payload._id };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
