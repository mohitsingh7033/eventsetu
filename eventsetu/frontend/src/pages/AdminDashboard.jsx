import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [confirmingId, setConfirmingId] = useState(null);

  const fetchData = async () => {
    try {
      const [statsRes, eventsRes, pendingRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/events'),
        api.get('/admin/bookings/pending'),
      ]);

      setStats(statsRes.data);
      setEvents(eventsRes.data);
      setPendingBookings(pendingRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;

    try {
      await api.delete(`/events/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleConfirm = async (id) => {
    try {
      setConfirmingId(id);

      const res = await api.put(`/admin/bookings/${id}/confirm`);

      alert(res.data.message);

      await fetchData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Failed to confirm booking'
      );
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-display text-3xl">
          Admin Dashboard
        </h1>

        <Link
          to="/admin/events/new"
          className="btn-primary text-sm"
        >
          + New Event
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            ['Events', stats.totalEvents],
            ['Users', stats.totalUsers],
            ['Bookings', stats.totalBookings],
            ['Revenue', `₹${stats.totalRevenue}`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border border-ink/10 rounded-card shadow-card p-5 bg-card"
            >
              <p className="text-2xl font-display">
                {value}
              </p>

              <p className="text-sm text-ink/60">
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Events */}
      <h2 className="font-display text-2xl mb-4">
        Events
      </h2>

      <div className="space-y-3 mb-12">
        {events.map((event) => (
          <div
            key={event._id}
            className="border border-ink/10 rounded-card shadow-card p-4 bg-card flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {event.title}
              </p>

              <p className="text-sm text-ink/60">
                {event.seatsBooked}/{event.totalSeats} booked · ₹
                {event.price}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/admin/events/${event._id}/edit`}
                className="btn-outline text-sm"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(event._id)}
                className="text-sm text-red-600 px-3"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Bookings */}
      <h2 className="font-display text-2xl mb-4">
        Pending Bookings
      </h2>

      {pendingBookings.length === 0 ? (
        <div className="border border-ink/10 rounded-card p-5 mb-12 bg-card">
          <p className="text-sm text-ink/60">
            No pending bookings.
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-12">
          {pendingBookings.map((booking) => (
            <div
              key={booking._id}
              className="border border-ink/10 rounded-card shadow-card p-5 bg-card"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                <div>
                  <p className="font-medium">
                    {booking.event?.title}
                  </p>

                  <p className="text-sm text-ink/60">
                    User: {booking.user?.name || 'User'}
                  </p>

                  <p className="text-sm text-ink/60">
                    Email: {booking.user?.email}
                  </p>

                  <p className="text-sm text-ink/60">
                    Seats: {booking.seats} · ₹{booking.totalAmount}
                  </p>
                </div>

                <button
                  onClick={() => handleConfirm(booking._id)}
                  disabled={confirmingId === booking._id}
                  className="btn-primary text-sm disabled:opacity-50"
                >
                  {confirmingId === booking._id
                    ? 'Confirming...'
                    : 'Confirm Booking'}
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Bookings */}
      {stats?.recentBookings?.length > 0 && (
        <>
          <h2 className="font-display text-2xl mb-4">
            Recent Bookings
          </h2>

          <div className="space-y-2">
            {stats.recentBookings.map((b) => (
              <div
                key={b._id}
                className="text-sm border-b border-ink/10 py-2 flex justify-between"
              >
                <span>
                  {b.user?.name} booked {b.event?.title}
                </span>

                <span className="text-ink/50">
                  {b.seats} seat(s) · ₹{b.totalAmount}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default AdminDashboard;