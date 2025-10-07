import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Scissors } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-dark-800 to-dark-900 text-gray-100 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-gold-glow">
                <Scissors className="w-5 h-5 text-dark-900" />
              </div>
              <span className="text-2xl font-bold text-gradient">BarberConnect</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Connecting customers with the best barbers in their area. Book appointments, 
              read reviews, and discover your perfect barber shop.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 hover:text-gold-500 transition-colors">
                <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>New York, NY</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-gold-500 transition-colors">
                <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-gold-500 transition-colors">
                <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@barberconnect.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold-500">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gold-500 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/find-barbers" className="text-gray-400 hover:text-gold-500 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Find Barbers
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-gold-500 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-gold-500 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold-500">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/barber-registration" className="text-gray-400 hover:text-gold-500 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  For Barbers
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-400 hover:text-gold-500 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  For Customers
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-gold-500 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-gold-500 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 BarberConnect. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 bg-dark-800 px-4 py-2 rounded-lg border border-dark-700">
              <Clock className="w-4 h-4 text-gold-500" />
              <span className="text-gray-400 text-sm">
                Available 24/7 for bookings
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
