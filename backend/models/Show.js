const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    theatre: { type: String, required: true },
    startTime: { type: Date, required: true },
    price: { type: Number, required: true },
    rows: { type: Number, default: 8 },
    cols: { type: Number, default: 10 },
    bookedSeats: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Show", showSchema);
