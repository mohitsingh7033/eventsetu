import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const formatDate = (d) => {
  const date = new Date(d);

  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchEvent = async () => {
    const { data } = await api.get(`/events/${id}`);
    setEvent(data);
  };

  useEffect(() => {
    fetchEvent();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBooking(true);
    setError('');
    setMessage('');

    try {
      await api.post('/bookings', {
        eventId: id,
        seats,
      });

      setMessage(
        'Booking request submitted. Waiting for admin confirmation.'
      );

      fetchEvent();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Booking failed'
      );
    } finally {
      setBooking(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 mx-auto mb-4 rounded-full border-4 border-brand border-t-transparent animate-spin" />
          <p className="text-ink/50">Loading event...</p>
        </div>
      </div>
    );
  }

  const seatsLeft = event.totalSeats - event.seatsBooked;
  const soldOut = seatsLeft <= 0;

  return (
    <div className="min-h-screen bg-[#f8f7f3]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-dark text-white">

        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark to-[#155e54]" />

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-brand/20 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">

          <button
            onClick={() => navigate(-1)}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            ← Back to events
          </button>

          <div className="max-w-4xl">

            <span className="inline-flex rounded-full bg-accent/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-200">
              {event.category || 'General'}
            </span>

            <h1 className="mt-5 font-display text-4xl leading-tight md:text-6xl">
              {event.title}
            </h1>

            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/65 md:text-base">
              <span>📅 {formatDate(event.date)}</span>
              <span className="hidden md:inline">•</span>
              <span>🕐 {event.time}</span>
              <span className="hidden md:inline">•</span>
              <span>📍 {event.location}</span>
            </p>

          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* Event Information */}
          <div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs uppercase tracking-wider text-ink/40">
                  Date
                </p>
                <p className="mt-2 font-semibold">
                  {new Date(event.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs uppercase tracking-wider text-ink/40">
                  Time
                </p>
                <p className="mt-2 font-semibold">
                  {event.time}
                </p>
              </div>

              <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <p className="text-xs uppercase tracking-wider text-ink/40">
                  Availability
                </p>
                <p
                  className={`mt-2 font-semibold ${
                    soldOut ? 'text-red-600' : 'text-brand'
                  }`}
                >
                  {soldOut ? 'Sold out' : `${seatsLeft} seats left`}
                </p>
              </div>

            </div>

            {/* About */}
            <div className="rounded-3xl border border-ink/10 bg-white p-7 shadow-sm md:p-9">

              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand">
                  About the event
                </p>

                <h2 className="mt-2 font-display text-3xl">
                  Experience something memorable
                </h2>
              </div>

              <div className="whitespace-pre-line text-base leading-8 text-ink/70">
                {event.description}
              </div>

              <div className="mt-8 border-t border-ink/10 pt-6">
                <p className="text-sm text-ink/50">
                  📍 Venue
                </p>

                <p className="mt-1 font-medium">
                  {event.location}
                </p>
              </div>

            </div>

          </div>

          {/* Booking Card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">

            <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-xl">

              {/* Price Header */}
              <div className="bg-brand-dark p-7 text-white">

                <p className="text-sm text-white/60">
                  Ticket price
                </p>

                <div className="mt-1 flex items-end justify-between">

                  <span className="font-display text-4xl">
                    {event.price > 0
                      ? `₹${event.price}`
                      : 'Free'}
                  </span>

                  <span className="text-sm text-white/60">
                    per seat
                  </span>

                </div>

              </div>

              <div className="p-7">

                {/* Availability */}
                <div className="mb-6 flex items-center justify-between rounded-xl bg-[#f8f7f3] px-4 py-3">

                  <span className="text-sm text-ink/60">
                    Availability
                  </span>

                  <span
                    className={`text-sm font-semibold ${
                      soldOut
                        ? 'text-red-600'
                        : 'text-brand'
                    }`}
                  >
                    {soldOut
                      ? 'Sold out'
                      : `${seatsLeft} seats left`}
                  </span>

                </div>

                {/* Seats */}
                {!soldOut && (
                  <div className="mb-6">

                    <label className="mb-2 block text-sm font-medium">
                      Number of seats
                    </label>

                    <input
                      type="number"
                      min={1}
                      max={seatsLeft}
                      value={seats}
                      onChange={(e) =>
                        setSeats(
                          Math.max(
                            1,
                            Math.min(
                              seatsLeft,
                              Number(e.target.value)
                            )
                          )
                        )
                      }
                      className="input-field w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                    />

                  </div>
                )}

                {/* Total */}
                {!soldOut && (
                  <div className="mb-5 flex items-center justify-between border-t border-ink/10 pt-5">

                    <span className="text-sm text-ink/60">
                      Total
                    </span>

                    <span className="font-display text-2xl">
                      ₹{event.price * seats || 0}
                    </span>

                  </div>
                )}

                {/* Success */}
                {message && (
                  <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-700">
                    ✓ {message}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-600">
                    {error}
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={handleBook}
                  disabled={soldOut || booking}
                  className="w-full rounded-xl bg-accent px-5 py-3.5 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {soldOut
                    ? 'Sold out'
                    : booking
                    ? 'Submitting request...'
                    : `Book now · ₹${event.price * seats || 0}`}
                </button>

                {!user && !soldOut && (
                  <p className="mt-4 text-center text-xs leading-5 text-ink/45">
                    You'll need to log in before booking this event.
                  </p>
                )}

                {user && !soldOut && (
                  <p className="mt-4 text-center text-xs leading-5 text-ink/45">
                    Your booking will be sent to the admin for confirmation.
                  </p>
                )}

              </div>
            </div>

          </aside>

        </div>
      </main>
    </div>
  );
};

export default EventDetail;