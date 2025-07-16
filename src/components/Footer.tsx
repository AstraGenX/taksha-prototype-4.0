
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsOfService from '@/components/TermsOfService';

const Footer = () => {
  const navigate = useNavigate();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);

  const handleNavigation = (section: string) => {
    switch (section) {
      case 'about':
        navigate('/about');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        break;
      case 'shop':
        navigate('/shop');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        break;
      case 'portfolio':
        navigate('/portfolio');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        break;
      case 'blog':
        navigate('/blog');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        break;
      case 'contact':
        navigate('/contact');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        break;
      case 'home':
        navigate('/');
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <footer className="bg-walnut-900 text-white">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="https://github.com/AstraGenX/astragenxlogo/blob/main/%E0%A4%A4%E0%A4%95%E0%A5%8D%E0%A4%B7_logo-removebg-preview%20(1).png?raw=true"
                  alt="Taksha Logo"
                  className="w-12 h-12 object-contain"
                />
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-xl text-white">Taksha</span>
                  <span className="text-sm text-gray-400 italic">Tradition Meets Innovation</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                Where heritage craftsmanship meets contemporary design. Every piece we create carries forward
                the legacy of traditional Indian artistry while embracing modern aesthetics and functionality.
              </p>
              <p className="text-saffron-400 font-serif italic mb-4">
                "Śilpaṃ karma ca yo vetti sa vai śilpī prakīrtitaḥ"
              </p>
              <p className="text-gray-400 text-sm">
                One who knows the craft and its application is truly called an artisan
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleNavigation('home')}
                    className="text-gray-300 hover:text-saffron-400 transition-colors story-link text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('about')}
                    className="text-gray-300 hover:text-saffron-400 transition-colors story-link text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('shop')}
                    className="text-gray-300 hover:text-saffron-400 transition-colors story-link text-left"
                  >
                    Shop Now
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('portfolio')}
                    className="text-gray-300 hover:text-saffron-400 transition-colors story-link text-left"
                  >
                    Catalogue
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('blog')}
                    className="text-gray-300 hover:text-saffron-400 transition-colors story-link text-left"
                  >
                    Blog & Stories
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('contact')}
                    className="text-gray-300 hover:text-saffron-400 transition-colors story-link text-left"
                  >
                    Get In Touch
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-serif font-semibold text-lg mb-6">Get in Touch</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <a
                    href="mailto:taksha15.woodendecor@gmail.com"
                    className="text-gray-300 hover:text-saffron-400 transition-colors"
                  >
                    taksha15.woodendecor@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Phone</p>
                  <a
                    href="tel:+917906964311"
                    className="text-gray-300 hover:text-saffron-400 transition-colors block"
                  >
                    +91 79069 64311
                  </a>
                  <a
                    href="tel:+919007630516"
                    className="text-gray-300 hover:text-saffron-400 transition-colors"
                  >
                    +91 90076 30516
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Location</p>
                  <p className="text-gray-300">Haridwar, India</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Hours</p>
                  <p className="text-gray-300">24 x 7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-walnut-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Taksha. All rights reserved. Thoughtfully handcrafted with tradition. Website developed by AstraGenX Corporation
              </div>

              <div className="flex items-center space-x-6">
                {/* Social Links */}
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/share/1NRMkbQxiJ/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-saffron-400 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/takshawoodendecor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-saffron-400 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-saffron-400 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>

                {/* Legal Links */}
                <div className="flex space-x-4 text-sm">
                  <button
                    onClick={() => setShowPrivacyPolicy(true)}
                    className="text-gray-400 hover:text-saffron-400 transition-colors"
                  >
                    Privacy Policy
                  </button>
                  <button
                    onClick={() => setShowTermsOfService(true)}
                    className="text-gray-400 hover:text-saffron-400 transition-colors"
                  >
                    Terms of Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PrivacyPolicy
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />
      <TermsOfService
        isOpen={showTermsOfService}
        onClose={() => setShowTermsOfService(false)}
      />
    </>
  );
};

export default Footer;
