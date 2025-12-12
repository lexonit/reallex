import React from 'react';

interface ModernLuxuryHomePageProps {
  onNavigate: (page: string) => void;
}

export const ModernLuxuryHomePage: React.FC<ModernLuxuryHomePageProps> = ({ onNavigate }) => {
  const handleNavClick = (page: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-yellow-400">LuxuryEstate</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" onClick={(e) => handleNavClick('home', e)} className="text-yellow-400 cursor-pointer">Home</a>
            <a href="#" onClick={(e) => handleNavClick('projects', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Projects</a>
            <a href="#" onClick={(e) => handleNavClick('about', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">About</a>
            <a href="#" onClick={(e) => handleNavClick('services', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Services</a>
            <a href="#" onClick={(e) => handleNavClick('blog', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Blog</a>
            <a href="#" onClick={(e) => handleNavClick('contact', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop)',
            filter: 'brightness(0.4)'
          }}
        />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Luxury <span className="text-yellow-400">Living</span>
          </h1>
          <p className="text-lg md:text-xl mb-6 text-gray-300">
            Discover extraordinary properties in prime locations
          </p>
          <button 
            onClick={(e) => handleNavClick('projects', e)}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors cursor-pointer"
          >
            Explore Properties
          </button>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all cursor-pointer">
                <img 
                  src={`https://images.unsplash.com/photo-156051888${i}-ce09059eeffa?w=400&h=300&fit=crop`}
                  alt="Property"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="text-xl font-bold text-yellow-400 mb-2">$2,{i}50,000</div>
                  <h3 className="text-lg font-semibold mb-2">Modern Villa</h3>
                  <p className="text-gray-400 text-sm mb-3">Beverly Hills, CA</p>
                  <button className="w-full bg-yellow-400 text-black py-2 px-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-xl font-bold text-yellow-400 mb-2">LuxuryEstate</div>
          <p className="text-gray-400 text-sm">© 2024 LuxuryEstate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};