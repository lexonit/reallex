import React from 'react';
import { ArrowRight, MapPin, Bed, Bath, Square } from 'lucide-react';

export const ModernLuxuryHome: React.FC = () => {
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
            <a href="#" className="hover:text-yellow-400 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop)',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            Luxury <span className="text-yellow-400">Living</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Discover extraordinary properties in prime locations
          </p>
          <button className="bg-yellow-400 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center">
            Explore Properties <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all">
                <img 
                  src={`https://images.unsplash.com/photo-156051888${i}-ce09059eeffa?w=400&h=300&fit=crop`}
                  alt="Property"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">$2,{i}50,000</div>
                  <h3 className="text-xl font-semibold mb-2">Modern Villa</h3>
                  <p className="text-gray-400 mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" /> Beverly Hills, CA
                  </p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span className="flex items-center"><Bed className="w-4 h-4 mr-1" /> {3 + i} Beds</span>
                    <span className="flex items-center"><Bath className="w-4 h-4 mr-1" /> {2 + i} Baths</span>
                    <span className="flex items-center"><Square className="w-4 h-4 mr-1" /> {2500 + i * 100} sqft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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