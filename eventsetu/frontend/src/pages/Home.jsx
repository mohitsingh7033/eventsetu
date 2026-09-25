import { useEffect, useState } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';

const categories = [
  {
    name: 'All',
    icon: '✦',
    subtitle: 'All Events',
    style: 'from-emerald-900 via-emerald-800 to-teal-700',
  },
  {
    name: 'Music',
    icon: '♫',
    subtitle: 'Concerts & Shows',
    style: 'from-rose-500 via-pink-500 to-orange-400',
  },
  {
    name: 'Tech',
    icon: '⌘',
    subtitle: 'Talks & Meetups',
    style: 'from-blue-500 via-cyan-500 to-indigo-500',
  },
  {
    name: 'Business',
    icon: '◆',
    subtitle: 'Conferences',
    style: 'from-amber-500 via-orange-500 to-yellow-500',
  },
  {
    name: 'Sports',
    icon: '⚽',
    subtitle: 'Matches & Events',
    style: 'from-emerald-500 via-green-500 to-teal-500',
  },
  {
    name: 'Workshop',
    icon: '⚒',
    subtitle: 'Learn & Build',
    style: 'from-violet-500 via-purple-500 to-fuchsia-500',
  },
  {
    name: 'General',
    icon: '✦',
    subtitle: 'Community Events',
    style: 'from-indigo-500 via-purple-500 to-pink-500',
  },
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);

    try {
      const { data } = await api.get('/events', {
        params: {
          search,
          category,
        },
      });

      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 300);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  const handleCategory = (cat) => {
    setCategory(cat);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3]">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-brand-dark text-white">

        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark to-[#075e54]" />

        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        {/* Decorative circles */}
        <div className="absolute right-[12%] top-20 hidden h-24 w-24 rounded-full border border-white/10 md:block" />

        <div className="absolute right-[20%] top-32 hidden h-12 w-12 rounded-full bg-accent/20 md:block" />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-28 md:pt-20 md:pb-36">

          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-white/70 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Curated events. Real experiences.
            </div>

            <h1 className="font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">

              Find things worth
              <span className="block text-accent">
                showing up for.
              </span>

            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
              Discover concerts, sports, workshops, tech meetups,
              business conferences and unforgettable experiences
              happening around you.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/60">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                🎟 Easy Booking
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                ✓ Admin Verified
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                ⚡ Quick Confirmation
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SEARCH BOX ================= */}
      <div className="relative z-10 mx-auto -mt-10 max-w-6xl px-6">

        <section className="rounded-3xl border border-ink/10 bg-white p-4 shadow-xl md:p-5">

          <div className="flex flex-col gap-3 md:flex-row">

            {/* Search */}
            <div className="relative flex-1">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-ink/40">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search events, concerts, workshops..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 w-full rounded-2xl border border-ink/10 bg-[#fafaf8] pl-12 pr-4 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
              />

            </div>

            {/* Location */}
            <div className="relative md:w-64">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-ink/40">
                📍
              </span>

              <input
                type="text"
                placeholder="Location"
                className="h-14 w-full rounded-2xl border border-ink/10 bg-[#fafaf8] pl-11 pr-4 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
              />

            </div>

            <button
              onClick={fetchEvents}
              className="h-14 rounded-2xl bg-brand px-8 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg"
            >
              Search
            </button>

          </div>

        </section>

      </div>

      {/* ================= CATEGORIES ================= */}
      <section className="mx-auto max-w-6xl px-6 pt-10">

        <div className="mb-5 flex items-end justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Explore
            </p>

            <h2 className="mt-1 font-display text-3xl">
              Browse by category
            </h2>
          </div>

          <p className="hidden text-sm text-ink/45 md:block">
            Find something made for you
          </p>

        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">

          {categories.map((cat) => {

            const active = category === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => handleCategory(cat.name)}
                className={`group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 ${
                  active
                    ? 'scale-[1.02] shadow-xl ring-2 ring-brand ring-offset-2'
                    : 'shadow-sm hover:-translate-y-1 hover:shadow-xl'
                }`}
              >

                {/* Category gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.style}`}
                />

                {/* Shine */}
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/20 blur-xl transition-transform duration-500 group-hover:scale-150" />

                <div className="relative z-10">

                  <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-xl text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {cat.icon}
                  </div>

                  <p className="font-semibold text-white">
                    {cat.name}
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-white/70">
                    {cat.subtitle}
                  </p>

                </div>

              </button>
            );
          })}

        </div>

      </section>

      {/* ================= EVENTS ================= */}
      <main className="mx-auto max-w-6xl px-6 py-12">

        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Discover
            </p>

            <h2 className="mt-1 font-display text-3xl md:text-4xl">
              Upcoming Events
            </h2>

            <p className="mt-2 text-sm text-ink/50">
              Discover amazing experiences and reserve your seat.
            </p>

          </div>

          <div className="rounded-full bg-white px-4 py-2 text-sm text-ink/60 shadow-sm">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </div>

        </div>

        {/* Loading */}
        {loading ? (

          <div className="grid gap-5">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-3xl bg-white shadow-sm"
              />
            ))}

          </div>

        ) : events.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-ink/15 bg-white px-6 py-16 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-2xl">
              🔎
            </div>

            <h3 className="font-display text-2xl">
              No events found
            </h3>

            <p className="mt-2 text-sm text-ink/50">
              Try another search or explore a different category.
            </p>

            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
              }}
              className="mt-5 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark"
            >
              View all events
            </button>

          </div>

        ) : (

          <div className="grid gap-5">

            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
              />
            ))}

          </div>

        )}

      </main>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-6xl px-6 pb-16">

        <div className="relative overflow-hidden rounded-3xl bg-brand-dark p-8 text-white md:p-12">

          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative max-w-2xl">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              EventSetu
            </p>

            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              Your next great experience is waiting.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/60">
              Explore exciting events, reserve your seats and
              make memories worth showing up for.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;