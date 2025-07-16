
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, User, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Cart from './Cart';
import WishlistSidebar from './WishlistSidebar';
import UserProfile from './UserProfile';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Shop Now', href: '/shop' },
    { name: 'Catalogue', href: '/portfolio' },
    { name: 'Blog/Stories', href: '/blog' },
    { name: 'Get In Touch', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogoClick = () => {
    navigate('/');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleNavClick = (href: string) => {
    navigate(href);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="https://github.com/AstraGenX/astragenxlogo/blob/main/%E0%A4%A4%E0%A4%95%E0%A5%8D%E0%A4%B7_logo-removebg-preview%20(1).png?raw=true"
              alt="Taksha Logo"
              className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain"
            />
            <div className="flex flex-col items-start text-left">
              <span className="font-serif font-semibold text-sm sm:text-base lg:text-lg text-walnut-800 leading-none">Taksha</span>
              <span className="text-[10px] sm:text-xs lg:text-xs text-muted-foreground italic">Tradition Meets Innovation</span>
            </div>
          </button>

          {/* Desktop Navigation - Only visible on large screens */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`story-link text-sm font-medium transition-colors ${isActive(item.href)
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                  }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Action Icons - Always visible */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button variant="ghost" size="icon" className="hover:bg-walnut-50 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10">
              <Search className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <WishlistSidebar />
            <Cart />
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                {user.userType === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="text-xs px-1 sm:px-2 h-7 sm:h-8">
                      Admin
                    </Button>
                  </Link>
                )}
                <UserProfile />
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="hover:bg-walnut-50 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </Link>
            )}

            {/* Hamburger Menu Button - Only visible on tablets and phones */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Only visible on tablets and phones when opened */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`block w-full text-left px-3 py-2 text-sm sm:text-base font-medium rounded-md transition-colors ${isActive(item.href)
                      ? 'text-primary bg-walnut-50'
                      : 'text-foreground hover:text-primary hover:bg-walnut-50'
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
