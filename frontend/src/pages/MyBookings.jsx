import { useEffect, useState } from "react";
import api, { errMsg } from "../api.js";

export default function MyBookings() {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/bookings/mine");
      setBookings(data);
    } catch (e) {
      setError(errMsg(e));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  if (!bookings && !error) return <div className="text-muted">Loading...</div>;

  return (
    <>
      <h3 className="mb-3">My Bookings</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {bookings && bookings.length === 0 && <div className="text-muted">You have no bookings yet.</div>}
      <div className="row g-3">
        {(bookings || []).map((b) => (
          <div className="col-md-6" key={b._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title">{b.show?.movie?.title || "Movie"}</h5>
                  <span className={`badge ${b.status === "CONFIRMED" ? "bg-success" : "bg-secondary"}`}>{b.status}</span>
                </div>
                <div className="text-muted small">{b.show?.theatre}</div>
                <div className="text-muted small">{b.show && new Date(b.show.startTime).toLocaleString()}</div>
                <div className="mt-2">Seats: <strong>{b.seats.join(", ")}</strong></div>
                <div>Total: <strong>₹{b.totalPrice}</strong></div>
                <div className="small text-muted">Booking ID: {b._id}</div>
                {b.status === "CONFIRMED" && (
                  <button className="btn btn-outline-danger btn-sm mt-2" onClick={() => cancel(b._id)}>
                    Cancel booking
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
