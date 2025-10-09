import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const getNavItems = () => {
    const items = [
      { id: 'home', label: 'Home' },
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'about', label: 'About Us' },
    ];

    if (profile?.role === 'admin') {
      items.push({ id: 'activity-logs', label: 'Activity Logs' });
    }

    return items;
  };

  const navItems = getNavItems();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              SmartMine
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            {user && profile ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="text-gray-300">{profile.full_name}</span>
                  <span className="px-2 py-1 bg-amber-500 rounded text-xs font-semibold">
                    {profile.role}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-800"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.id
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            {user && profile ? (
              <div className="pt-2 mt-2 border-t border-gray-700 space-y-2">
                <div className="px-3 py-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4" />
                    <span>{profile.full_name}</span>
                  </div>
                  <span className="px-2 py-1 bg-amber-500 rounded text-xs font-semibold">
                    {profile.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-base font-medium mt-2"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
