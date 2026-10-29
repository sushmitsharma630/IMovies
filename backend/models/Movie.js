const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    genre: { type: String, default: "Drama" },
    language: { type: String, default: "English" },
    duration: { type: Number, default: 120 },
    rating: { type: Number, default: 0 },
    poster: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
