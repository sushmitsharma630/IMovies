import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api.js";

const GENRES = ["All", "Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/movies", { params: { search, genre } });
        if (!cancelled) {
          setMovies(data);
          setError("");
        }
      } catch (e) {
        if (!cancelled) setError(errMsg(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, genre]);

  return (
    <>
      <h2 className="mb-3">Now Showing</h2>
      <div className="row g-2 mb-4">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
            {GENRES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-muted">Loading movies...</div>}
      {!loading && !error && movies.length === 0 && <div className="text-muted">No movies found.</div>}

      <div className="row g-4">
        {movies.map((m) => (
          <div className="col-6 col-md-4 col-lg-3" key={m._id}>
            <Link to={`/movie/${m._id}`} className="text-decoration-none">
              <div className="card h-100 shadow-sm movie-card">
                <img src={m.poster} className="card-img-top" alt={m.title} />
                <div className="card-body">
                  <h6 className="card-title text-dark mb-1">{m.title}</h6>
                  <div className="small text-muted">{m.genre} • {m.language}</div>
                  <div className="small text-warning">★ {m.rating}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
