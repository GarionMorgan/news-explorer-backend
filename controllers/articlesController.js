import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import path from 'path';
import { pipeline } from 'stream/promises';
import parseMongoError from '../utils/parseMongoError.js';
import {
  ApiError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../errors/ApiError.js';
import MESSAGES from '../utils/constants.js';
import Article from '../models/article.js';

export async function getArticles(req, res, next) {
  try {
    const articles = await Article.find({ owner: req.user._id });
    const mapped = articles.map((a) => ({
      _id: a._id,
      keyword: a.keyword,
      title: a.title,
      description: a.text,
      publishedAt: a.date,
      source: { name: a.source },
      url: a.link,
      urlToImage: a.imageFileId
        ? `${req.protocol}://${req.get('host')}/uploads/${a.imageFileId}`
        : a.image,
    }));
    return res.json(mapped);
  } catch (err) {
    return next(err);
  }
}

export async function createArticle(req, res, next) {
  try {
    // accept both backend-internal field names and frontend shape
    const {
      keyword,
      title,
      // backend names
      text: textRaw,
      date: dateRaw,
      source: sourceRaw,
      link: linkRaw,
      image: imageRaw,
      // frontend names
      description,
      publishedAt,
      url,
      urlToImage,
    } = req.body;

    const text = textRaw || description || '';
    const date = dateRaw || publishedAt || new Date().toISOString();
    const source = (typeof sourceRaw === 'string' && sourceRaw)
      || (sourceRaw && sourceRaw.name)
      || (req.body.source && req.body.source.name)
      || 'Unknown';
    const link = linkRaw || url;
    const imageUrl = imageRaw || urlToImage;

    // attempt to fetch image and store in GridFS; fall back to original URL
    let imageFileId = null;
    try {
      if (imageUrl && imageUrl.startsWith('http')) {
        const resp = await fetch(imageUrl);
        if (resp.ok && resp.body) {
          const { db } = mongoose.connection;
          const bucket = new GridFSBucket(db, { bucketName: 'images' });
          // derive a stable filename from the image URL so the uploads route
          // can be queried by that basename (e.g. uuid.jpg)
          const filename = (() => {
            try {
              return (
                path.basename(new URL(imageUrl).pathname)
                || new Date().toISOString()
              );
            } catch (e) {
              return new Date().toISOString();
            }
          })();
          const contentType = resp.headers && resp.headers.get
            ? resp.headers.get('content-type')
            : undefined;
          const uploadStream = bucket.openUploadStream(filename, {
            contentType: contentType || undefined,
          });
          await pipeline(resp.body, uploadStream);
          imageFileId = uploadStream.id;
        }
      }
    } catch (err) {
      // do not block article creation if image upload fails
      imageFileId = null;
    }

    const article = await Article.create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image: imageUrl,
      imageFileId: imageFileId || undefined,
      owner: req.user._id,
    });
    return res.status(201).json({
      _id: article._id,
      keyword: article.keyword,
      title: article.title,
      description: article.text,
      publishedAt: article.date,
      source: { name: article.source },
      url: article.link,
      urlToImage: article.imageFileId
        ? `${req.protocol}://${req.get('host')}/uploads/${article.imageFileId}`
        : article.image,
    });
  } catch (err) {
    const parsed = parseMongoError(err);
    if (parsed) return next(new ApiError(parsed.status, parsed.message));
    return next(err);
  }
}

export async function deleteArticle(req, res, next) {
  try {
    const { articleId } = req.params;
    let article;
    if (articleId) {
      article = await Article.findById(articleId).select('+owner');
    } else if (req.body && req.body.url) {
      article = await Article.findOne({ link: req.body.url }).select('+owner');
    } else {
      return next(new BadRequestError(MESSAGES.ARTICLE_ID_OR_URL_REQUIRED));
    }

    if (!article) return next(new NotFoundError(MESSAGES.ARTICLE_NOT_FOUND));
    if (article.owner.toString() !== req.user._id) {
      return next(new ForbiddenError(MESSAGES.FORBIDDEN));
    }

    // if article has GridFS image, remove it
    if (article.imageFileId) {
      try {
        const { db } = mongoose.connection;
        const bucket = new GridFSBucket(db, { bucketName: 'images' });
        await bucket.delete(article.imageFileId);
      } catch (err) {
        // log and continue
      }
    }

    await Article.deleteOne({ _id: article._id });
    return res.json({ message: MESSAGES.ARTICLE_DELETED });
  } catch (err) {
    return next(err);
  }
}
