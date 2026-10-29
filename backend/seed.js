require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("./models/Movie");
const Show = require("./models/Show");

const poster = (title, color) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='420'><rect width='100%' height='100%' fill='${color}'/><text x='50%' y='50%' fill='white' font-family='Arial' font-size='26' font-weight='bold' text-anchor='middle' dominant-baseline='middle'>${title}</text></svg>`
  );

const movies = [
  { title: "Galaxy Rangers", genre: "Sci-Fi", language: "English", duration: 142, rating: 8.4, color: "#4f46e5", description: "A crew of unlikely heroes races across the galaxy to stop a rogue AI from erasing a star system." },
  { title: "Monsoon Melody", genre: "Romance", language: "Hindi", duration: 128, rating: 7.9, color: "#db2777", description: "Two musicians from different worlds find love during one unforgettable rainy season in Mumbai." },
  { title: "The Last Heist", genre: "Thriller", language: "English", duration: 118, rating: 8.1, color: "#111827", description: "A retired thief is pulled back for one final job that is far more dangerous than it appears." },
  { title: "Laugh Riot", genre: "Comedy", language: "Hindi", duration: 112, rating: 7.4, color: "#ea580c", description: "A family wedding goes hilariously wrong when three generations clash over tradition." },
  { title: "Dragon's Peak", genre: "Action", language: "English", duration: 135, rating: 8.0, color: "#b91c1c", description: "A mountain guide must protect a village from mercenaries hunting for a legendary treasure." },
  { title: "Whispers in the Woods", genre: "Horror", language: "English", duration: 104, rating: 7.1, color: "#064e3b", description: "Campers discover that the forest they chose for a weekend getaway is far from empty." },
];

const theatres = ["PVR Cinemas - Central Mall", "INOX - City Square", "Cinepolis - Grand Plaza"];
const times = [[10, 30], [13, 45], [17, 0], [20, 30]];

async function seedData() {
  await Movie.deleteMany({});
  await Show.deleteMany({});
  const created = await Movie.insertMany(
    movies.map((m) => ({ ...m, poster: poster(m.title, m.color) }))
  );
  const shows = [];
  for (const movie of created) {
    for (let d = 0; d < 5; d++) {
      theatres.forEach((theatre, ti) => {
        const [h, min] = times[(ti + d) % times.length];
        const t = new Date();
        t.setDate(t.getDate() + d);
        t.setHours(h, min, 0, 0);
        shows.push({ movie: movie._id, theatre, startTime: t, price: 150 + ti * 50 });
      });
    }
  }
  await Show.insertMany(shows);
}

module.exports = { seedData };

if (require.main === module) {
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/imovies")
    .then(seedData)
    .then(() => {
      console.log("Seed complete");
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
