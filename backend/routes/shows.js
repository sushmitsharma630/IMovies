const express = require("express");
const mongoose = require("mongoose");
const Show = require("../models/Show");

const router = express.Router();

router.get("/movie/:movieId", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.movieId)) return res.json([]);
    const shows = await Show.find({
      movie: req.params.movieId,
      startTime: { $gte: new Date() },
    }).sort({ startTime: 1 });
    res.json(shows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Show not found" });
    const show = await Show.findById(req.params.id).populate("movie");
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
