// article.js

import mongoose from "mongoose";
import validator from "validator";

const { Schema } = mongoose;

const articleSchema = new Schema(
  {
    keyword: { type: String, required: [true, "Keyword is required"] },
    title: { type: String, required: [true, "Title is required"] },
    text: { type: String, required: [true, "Text is required"] },
    date: { type: String, required: [true, "Date is required"] },
    source: { type: String, required: [true, "Source is required"] },
    link: {
      type: String,
      required: [true, "Link is required"],
      validate: {
        validator: (v) => validator.isURL(v || ""),
        message: "Link must be a valid URL",
      },
    },
    // original image URL (optional) for reference
    image: {
      type: String,
      validate: {
        validator: (v) => !v || validator.isURL(v),
        message: "Image must be a valid URL",
      },
    },
    // GridFS file id for stored image (preferred)
    imageFileId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
