import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const ModernLuxuryContact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-yellow-400">LuxuryEstate</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-yellow-400 transition-colors">Home</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Projects</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">About</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Services</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Blog</a>
            <a href="#" className="text-yellow-400">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Contact <span className="text-yellow-400">Us</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Ready to find your dream property? Get in touch with our expert team today.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              />
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:outline-none">
                <option value="">Select Inquiry Type</option>
                <option value="buying">Buying Property</option>
                <option value="selling">Selling Property</option>
                <option value="investment">Investment Consultation</option>
                <option value="general">General Inquiry</option>
              </select>
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-yellow-400 mr-4" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-yellow-400 mr-4" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-300">info@luxuryestate.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-yellow-400 mr-4" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-gray-300">123 Luxury Avenue, Beverly Hills, CA 90210</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-yellow-400 mr-4" />
                  <div>
                    <p className="font-semibold">Office Hours</p>
                    <p className="text-gray-300">Mon-Fri: 9AM-7PM, Sat: 10AM-4PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Our Location</h3>
              <div className="bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-400">Interactive Map</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-4">LuxuryEstate</div>
          <p className="text-gray-400">© 2024 LuxuryEstate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};