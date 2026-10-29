require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "IMovies API is running" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/movies", require("./routes/movies"));
app.use("/api/shows", require("./routes/shows"));
app.use("/api/bookings", require("./routes/bookings"));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  // Auto-seed demo data on first run so the app is never empty
  try {
    const Movie = require("./models/Movie");
    if ((await Movie.countDocuments()) === 0) {
      await require("./seed").seedData();
      console.log("Demo movies and shows seeded");
    }
  } catch (e) {
    console.error("Seeding skipped:", e.message);
  }
  app.listen(PORT, () => console.log(`IMovies API running on http://localhost:${PORT}`));
});
