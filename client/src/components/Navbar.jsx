import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, User, Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="fixed w-full z-50 glass border-b border-white/10 px-6 h-16 flex items-center">
      <div className="max-w-7xl w-full mx-auto flex justify-between items-center h-full">
        
        {/* LEFT SIDE: Logo + Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <Sparkles className="text-[var(--color-accent-violet)] group-hover:text-[var(--color-accent-gold)] transition-colors w-6 h-6" />
            <span className="text-2xl font-display font-bold tracking-wide">
              OutfitOracle
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-[var(--color-accent-violet)] transition-colors">
              Home
            </Link>
            {isAuthenticated && (
              <Link to="/history" className="hover:text-[var(--color-accent-violet)] transition-colors">
                History
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Auth / Admin / Profile */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              {user?.isAdmin && (
                <Link to="/admin" style={{ color: '#F59E0B' }} className="hover:text-white transition-colors flex items-center gap-1 font-medium text-sm">
                  👑 Admin Panel
                </Link>
              )}
              
              <div className="glass px-3 py-1.5 rounded-full flex items-center gap-2 border-white/10">
                <span>✨</span>
                <span className={`font-medium text-sm ${
                  user?.credits <= 0 ? 'text-red-500' : user?.credits === 1 ? 'text-orange-400' : 'text-green-400'
                }`}>{user?.credits} Credits</span>
              </div>

              <div className="flex items-center gap-2 text-white/80 text-sm">
                <User size={16} />
                <span className="font-medium">
                  Hello, {user?.name} {user?.isAdmin && '👑'}
                </span>
              </div>
              
              <div className="h-4 w-px bg-white/20"></div>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link to="/login" className="hover:text-[var(--color-accent-violet)] transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 border border-[var(--color-accent-violet)] rounded-full text-[var(--color-accent-violet)] hover:bg-[var(--color-accent-violet)] hover:text-white transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full glass border-b border-white/10 flex flex-col p-6 gap-4 md:hidden z-40 bg-[#0A0A0A]">
          <Link to="/" onClick={closeMenu} className="text-lg hover:text-[var(--color-accent-violet)] transition-colors">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/history" onClick={closeMenu} className="text-lg hover:text-[var(--color-accent-violet)] transition-colors">History</Link>
              
              {user?.isAdmin && (
                <Link to="/admin" onClick={closeMenu} style={{ color: '#F59E0B' }} className="text-lg flex items-center gap-2">
                  👑 Admin Panel
                </Link>
              )}

              <div className="glass px-4 py-2 rounded-lg flex items-center gap-2 border-white/10 w-max">
                <span>✨</span>
                <span className={`font-medium ${
                  user?.credits <= 0 ? 'text-red-500' : user?.credits === 1 ? 'text-orange-400' : 'text-green-400'
                }`}>{user?.credits} Credits Available</span>
              </div>

              <div className="text-white/80 py-2">
                Hello, {user?.name} {user?.isAdmin && '👑'}
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors w-max py-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
             <div className="flex flex-col gap-4 mt-2">
              <Link to="/login" onClick={closeMenu} className="text-lg hover:text-[var(--color-accent-violet)] transition-colors">Login</Link>
              <Link to="/register" onClick={closeMenu} className="px-5 py-3 text-center border border-[var(--color-accent-violet)] rounded-full text-[var(--color-accent-violet)] hover:bg-[var(--color-accent-violet)] hover:text-white transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
