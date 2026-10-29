const express = require("express");
const mongoose = require("mongoose");
const Show = require("../models/Show");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/auth");

const router = express.Router();

const validSeat = (seat, show) => {
  const m = /^([A-Z])(\d{1,2})$/.exec(seat);
  if (!m) return false;
  const row = m[1].charCodeAt(0) - 65;
  const col = parseInt(m[2], 10);
  return row >= 0 && row < show.rows && col >= 1 && col <= show.cols;
};

router.post("/", protect, async (req, res) => {
  try {
    const { showId, seats } = req.body;
    if (!mongoose.isValidObjectId(showId)) return res.status(400).json({ message: "Invalid show" });
    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "Select at least one seat" });
    }
    const uniqueSeats = [...new Set(seats)];
    if (uniqueSeats.length > 8) return res.status(400).json({ message: "Maximum 8 seats per booking" });

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });
    if (show.startTime < new Date()) return res.status(400).json({ message: "This show has already started" });
    if (!uniqueSeats.every((s) => validSeat(s, show))) {
      return res.status(400).json({ message: "Invalid seat selection" });
    }

    // Atomic: succeeds only if none of the requested seats is already booked (prevents double booking)
    const updated = await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $nin: uniqueSeats } },
      { $push: { bookedSeats: { $each: uniqueSeats } } },
      { new: true }
    );
    if (!updated) {
      return res.status(409).json({ message: "Sorry, one or more selected seats were just booked. Please pick other seats." });
    }

    const booking = await Booking.create({
      user: req.user._id,
      show: show._id,
      seats: uniqueSeats,
      totalPrice: show.price * uniqueSeats.length,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/mine", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: "show", populate: { path: "movie" } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Booking not found" });
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "CANCELLED") return res.status(400).json({ message: "Already cancelled" });

    await Show.updateOne({ _id: booking.show }, { $pull: { bookedSeats: { $in: booking.seats } } });
    booking.status = "CANCELLED";
    await booking.save();
    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
