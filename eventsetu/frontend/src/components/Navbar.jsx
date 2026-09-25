import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-dark/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center transition-all duration-300 hover:scale-[1.03]"
        >
          <img
            src="/eventsetu-logo.jpg.jpeg"
            alt="EventSetu"
            className="h-11 w-auto object-contain drop-shadow-md transition-all duration-300 group-hover:brightness-110"
          />
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1 text-sm">

          {/* Events */}
          <Link
            to="/"
            className={`relative rounded-full px-4 py-2.5 font-medium transition-all duration-200 ${
              isActive('/')
                ? 'bg-white/10 text-white'
                : 'text-white/65 hover:bg-white/10 hover:text-white'
            }`}
          >
            Events

            {isActive('/') && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />
            )}
          </Link>

          {/* My Bookings */}
          {user && (
            <Link
              to="/my-bookings"
              className={`relative rounded-full px-4 py-2.5 font-medium transition-all duration-200 ${
                isActive('/my-bookings')
                  ? 'bg-white/10 text-white'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`}
            >
              My Bookings

              {isActive('/my-bookings') && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </Link>
          )}

          {/* Admin */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`relative rounded-full px-4 py-2.5 font-medium transition-all duration-200 ${
                isActive('/admin')
                  ? 'bg-white/10 text-white'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`}
            >
              Admin

              {isActive('/admin') && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </Link>
          )}

          {/* Not logged in */}
          {!user ? (
            <div className="ml-2 flex items-center gap-2">

              <Link
                to="/login"
                className="rounded-full px-4 py-2.5 font-medium text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                Log in
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-accent px-5 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-lg"
              >
                Sign up
              </Link>

            </div>
          ) : (

            /* Logged in */
            <div className="ml-2 flex items-center gap-2">

              {/* User profile */}
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-all duration-200 hover:bg-white/10 sm:flex">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <span className="max-w-[120px] truncate text-sm text-white/80">
                  Hi, {user?.name?.split(' ')[0]}
                </span>

              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/20 px-4 py-2.5 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-brand-dark hover:shadow-md"
              >
                Log out
              </button>

            </div>
          )}

        </div>
      </nav>
    </header>
  );
};

export default Navbar;