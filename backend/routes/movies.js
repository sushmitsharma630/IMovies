const express = require("express");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, genre } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    if (genre && genre !== "All") filter.genre = genre;
    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Movie not found" });
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
