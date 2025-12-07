import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

export const ModernLuxuryProjects: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-yellow-400">LuxuryEstate</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-yellow-400 transition-colors">Home</a>
            <a href="#" className="text-yellow-400">Projects</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">About</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Services</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Blog</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Our <span className="text-yellow-400">Projects</span></h1>
          <p className="text-xl text-gray-300 mb-8">Explore our portfolio of luxury developments and upcoming projects</p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: "Skyline Towers",
                location: "Manhattan, NY",
                status: "Completed",
                image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
                description: "Luxury residential towers with panoramic city views",
                units: 120,
                completionDate: "2024"
              },
              {
                title: "Ocean Vista",
                location: "Miami Beach, FL",
                status: "Under Construction",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
                description: "Oceanfront luxury condominiums",
                units: 80,
                completionDate: "2025"
              },
              {
                title: "Garden Estate",
                location: "Beverly Hills, CA",
                status: "Planning",
                image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop",
                description: "Exclusive gated community with custom homes",
                units: 45,
                completionDate: "2026"
              },
              {
                title: "Downtown Plaza",
                location: "Chicago, IL",
                status: "Completed",
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
                description: "Mixed-use development with retail and residential",
                units: 200,
                completionDate: "2023"
              }
            ].map((project, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-400 flex items-center mb-2">
                        <MapPin className="w-4 h-4 mr-1" /> {project.location}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      project.status === 'Completed' ? 'bg-green-600' :
                      project.status === 'Under Construction' ? 'bg-yellow-600' :
                      'bg-blue-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex justify-between text-sm text-gray-400 mb-4">
                    <span>{project.units} Units</span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" /> {project.completionDate}
                    </span>
                  </div>
                  <button className="w-full bg-yellow-400 text-black py-2 px-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center">
                    View Details <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
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