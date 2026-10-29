import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { errMsg } from "../api.js";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [m, s] = await Promise.all([api.get(`/movies/${id}`), api.get(`/shows/movie/${id}`)]);
        setMovie(m.data);
        setShows(s.data);
      } catch (e) {
        setError(errMsg(e));
      }
    })();
  }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!movie) return <div className="text-muted">Loading...</div>;

  // group shows by date
  const grouped = shows.reduce((acc, s) => {
    const key = new Date(s.startTime).toDateString();
    (acc[key] = acc[key] || []).push(s);
    return acc;
  }, {});

  return (
    <>
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <img src={movie.poster} alt={movie.title} className="img-fluid rounded shadow-sm" />
        </div>
        <div className="col-md-9">
          <h2>{movie.title}</h2>
          <p className="text-muted">
            {movie.genre} • {movie.language} • {movie.duration} min • <span className="text-warning">★ {movie.rating}</span>
          </p>
          <p>{movie.description}</p>
        </div>
      </div>

      <h4>Showtimes</h4>
      {shows.length === 0 && <div className="text-muted">No upcoming shows.</div>}
      {Object.entries(grouped).map(([date, list]) => (
        <div key={date} className="mb-3">
          <div className="fw-semibold mb-2">{date}</div>
          <div className="d-flex flex-wrap gap-2">
            {list.map((s) => (
              <Link key={s._id} to={`/show/${s._id}`} className="btn btn-outline-success btn-sm text-start">
                <div>{new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                <div className="small">{s.theatre} • ₹{s.price}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
