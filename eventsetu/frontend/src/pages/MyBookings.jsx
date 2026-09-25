import { useEffect, useState } from 'react';
import api from '../api/axios';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await api.get('/bookings/my');
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await api.put(`/bookings/${id}/cancel`);
    fetchBookings();
  };

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-16 text-ink/50">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-8">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-ink/50">You haven't booked any events yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="border border-ink/10 rounded-card shadow-card p-5 bg-card flex justify-between items-start">
              <div>
                <h3 className="font-display text-lg">{b.event?.title || 'Event removed'}</h3>
                {b.event && (
                  <p className="text-sm text-ink/60 mt-1">
                    {formatDate(b.event.date)} · {b.event.time} · {b.event.location}
                  </p>
                )}
                <p className="text-sm text-ink/60 mt-1">
                  {b.seats} seat(s) · ₹{b.totalAmount} · Payment: {b.paymentStatus}
                </p>
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                  b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {b.status}
                </span>
              </div>
              {b.status === 'confirmed' && (
                <button onClick={() => handleCancel(b._id)} className="btn-outline text-sm">
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
