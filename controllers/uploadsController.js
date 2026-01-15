import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { BadRequestError, NotFoundError } from '../errors/ApiError.js';
import MESSAGES from '../utils/constants.js';

function extToMime(ext) {
  switch ((ext || '').toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      return null;
  }
}

export async function streamImage(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) return next(new BadRequestError(MESSAGES.FILE_ID_REQUIRED));

    // set permissive headers for images
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // if id looks like a 24-char hex ObjectId, stream from GridFS
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      let fileId;
      try {
        fileId = new ObjectId(id);
      } catch (parseErr) {
        return next(new BadRequestError(MESSAGES.INVALID_FILE_ID));
      }

      const { db } = mongoose.connection;
      const bucket = new GridFSBucket(db, { bucketName: 'images' });

      // find file metadata
      const files = await bucket.find({ _id: fileId }).toArray();
      if (!files || files.length === 0) return next(new NotFoundError(MESSAGES.NOT_FOUND));
      const file = files[0];

      if (file.contentType) res.setHeader('Content-Type', file.contentType);

      const downloadStream = bucket.openDownloadStream(fileId);
      downloadStream.on('error', (streamErr) => next(streamErr));
      return downloadStream.pipe(res);
    }

    // otherwise treat `id` as a filename in the uploads directory (legacy files)
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const safeName = path.basename(id); // prevent path traversal
    const filePath = path.join(uploadsDir, safeName);
    try {
      await fs.promises.access(filePath, fs.constants.R_OK);
    } catch (accessErr) {
      // file not present on disk; attempt to find by filename in GridFS
      try {
        const { db } = mongoose.connection;
        const bucket = new GridFSBucket(db, { bucketName: 'images' });
        // try exact filename match
        let files = await bucket.find({ filename: safeName }).toArray();
        // try filename without extension
        if ((!files || files.length === 0) && path.extname(safeName)) {
          const base = path.parse(safeName).name;
          files = await bucket.find({ filename: base }).toArray();
        }
        if (!files || files.length === 0) return next(new NotFoundError(MESSAGES.NOT_FOUND));
        const file = files[0];
        if (file.contentType) res.setHeader('Content-Type', file.contentType);
        const downloadStream = bucket.openDownloadStream(file._id);
        downloadStream.on('error', (streamErr) => next(streamErr));
        return downloadStream.pipe(res);
      } catch (innerErr) {
        return next(innerErr);
      }
    }

    const mime = extToMime(path.extname(safeName));
    if (mime) res.setHeader('Content-Type', mime);

    const stream = fs.createReadStream(filePath);
    stream.on('error', (streamErr) => next(streamErr));
    return stream.pipe(res);
  } catch (err) {
    return next(err);
  }
}

export default { streamImage };
