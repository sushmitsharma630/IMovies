import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { errMsg } from "../api.js";

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/shows/${id}`);
      setShow(data);
      // drop selections that someone else has just booked
      setSelected((sel) => sel.filter((s) => !data.bookedSeats.includes(s)));
    } catch (e) {
      setError(errMsg(e));
    }
  }, [id]);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000); // real-time availability via polling
    return () => clearInterval(t);
  }, [load]);

  if (error && !show) return <div className="alert alert-danger">{error}</div>;
  if (!show) return <div className="text-muted">Loading...</div>;

  const rows = Array.from({ length: show.rows }, (_, i) => String.fromCharCode(65 + i));
  const cols = Array.from({ length: show.cols }, (_, i) => i + 1);

  const toggle = (seat) => {
    if (show.bookedSeats.includes(seat)) return;
    setSelected((sel) => {
      if (sel.includes(seat)) return sel.filter((s) => s !== seat);
      if (sel.length >= 8) return sel;
      return [...sel, seat];
    });
  };

  const book = async () => {
    setBusy(true);
    setError("");
    try {
      await api.post("/bookings", { showId: show._id, seats: selected });
      navigate("/my-bookings");
    } catch (e) {
      setError(errMsg(e));
      load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h4>{show.movie.title}</h4>
      <p className="text-muted">
        {show.theatre} • {new Date(show.startTime).toLocaleString()} • ₹{show.price} per seat
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="screen mb-4">SCREEN</div>
      <div className="seat-map">
        {rows.map((r) => (
          <div className="seat-row" key={r}>
            <span className="row-label">{r}</span>
            {cols.map((c) => {
              const seat = `${r}${c}`;
              const booked = show.bookedSeats.includes(seat);
              const sel = selected.includes(seat);
              return (
                <button
                  key={seat}
                  type="button"
                  disabled={booked}
                  className={`seat ${booked ? "booked" : sel ? "selected" : ""}`}
                  onClick={() => toggle(seat)}
                  title={seat}
                >
                  {c}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="d-flex gap-3 justify-content-center my-3 small">
        <span><span className="seat legend" /> Available</span>
        <span><span className="seat legend selected" /> Selected</span>
        <span><span className="seat legend booked" /> Booked</span>
      </div>

      <div className="card mt-3">
        <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <div>Seats: <strong>{selected.length ? selected.join(", ") : "none selected"}</strong></div>
            <div>Total: <strong>₹{selected.length * show.price}</strong></div>
          </div>
          <button className="btn btn-success" disabled={!selected.length || busy} onClick={book}>
            {busy ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </>
  );
}
