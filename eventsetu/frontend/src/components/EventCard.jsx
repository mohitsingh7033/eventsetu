import { Link } from 'react-router-dom';

const formatDate = (d) => {
  const date = new Date(d);
  return { day: date.toLocaleDateString('en-IN', { day: '2-digit' }), mon: date.toLocaleDateString('en-IN', { month: 'short' }) };
};

const categoryStyles = {
  Tech: 'bg-brand-50 text-brand-dark',
  Music: 'bg-accent-50 text-accent-dark',
  Business: 'bg-brand-50 text-brand-dark',
  Sports: 'bg-accent-50 text-accent-dark',
  Workshop: 'bg-brand-50 text-brand-dark',
  General: 'bg-ink/5 text-ink/60',
};

const EventCard = ({ event }) => {
  const seatsLeft = event.totalSeats - event.seatsBooked;
  const soldOut = seatsLeft <= 0;
  const { day, mon } = formatDate(event.date);
  const catClass = categoryStyles[event.category] || categoryStyles.General;

  return (
    <Link
      to={`/events/${event._id}`}
      className="group flex items-stretch gap-4 bg-card border border-ink/10 rounded-card p-4 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex flex-col items-center justify-center w-16 shrink-0 rounded-xl bg-paper border border-ink/10">
        <span className="font-display text-2xl leading-none text-ink">{day}</span>
        <span className="text-[11px] uppercase tracking-wide text-ink/50 mt-1">{mon}</span>
      </div>

      <div className="flex-1 min-w-0">
        <span className={`badge ${catClass} mb-2`}>{event.category || 'General'}</span>
        <h3 className="font-display text-lg text-ink group-hover:text-brand-dark transition-colors truncate">
          {event.title}
        </h3>
        <p className="text-sm text-ink/55 mt-1 truncate">
          {event.time} · {event.location}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between shrink-0 text-right">
        <span className="font-display text-lg text-ink">
          {event.price > 0 ? `₹${event.price}` : 'Free'}
        </span>
        <span className={`badge ${soldOut ? 'bg-red-50 text-red-700' : 'bg-ink/5 text-ink/55'}`}>
          {soldOut ? 'Sold out' : `${seatsLeft} left`}
        </span>
      </div>
    </Link>
  );
};

export default EventCard;
