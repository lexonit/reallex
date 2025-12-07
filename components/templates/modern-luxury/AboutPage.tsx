import React from 'react';
import { Award, Users, Building, Star } from 'lucide-react';

export const ModernLuxuryAbout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-yellow-400">LuxuryEstate</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-yellow-400 transition-colors">Home</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Projects</a>
            <a href="#" className="text-yellow-400">About</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Services</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Blog</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About <span className="text-yellow-400">LuxuryEstate</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            With over two decades of experience in luxury real estate, we are committed to 
            delivering exceptional properties and unparalleled service to our distinguished clientele.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Award, number: "25+", label: "Years Experience" },
              { icon: Users, number: "500+", label: "Happy Clients" },
              { icon: Building, number: "200+", label: "Properties Sold" },
              { icon: Star, number: "95%", label: "Client Satisfaction" }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg">
                <stat.icon className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "John Anderson", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop" },
              { name: "Sarah Mitchell", role: "Head of Sales", image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=300&h=300&fit=crop" },
              { name: "David Chen", role: "Senior Agent", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-yellow-400">{member.role}</p>
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