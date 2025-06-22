import React from 'react';
import { Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Games', href: '/games' },
    { name: 'New Releases', href: '/new-releases' },
    { name: 'Top Rated', href: '/top-rated' },
  ];

  const supportLinks = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faq' },
    { name: 'About', href: '/about' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">GameStore</h3>
            <p className="mb-4">
              Your ultimate destination for the latest and greatest games. Discover, explore, and experience gaming like never before.
            </p>
            <div className="flex space-x-4 mt-4">
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {currentYear} GameStore. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors duration-300">
              Terms of Service
            </a>
            <a href="https://github.com/oldstone7/gamestore" className="text-sm text-gray-500 hover:text-white transition-colors duration-300 flex items-center">
              <Github className="w-4 h-4 mr-1" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
