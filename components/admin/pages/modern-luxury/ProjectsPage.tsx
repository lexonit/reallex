import React from 'react';

interface ModernLuxuryProjectsPageProps {
  onNavigate: (page: string) => void;
}

export const ModernLuxuryProjectsPage: React.FC<ModernLuxuryProjectsPageProps> = ({ onNavigate }) => {
  const handleNavClick = (page: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-black/50 backdrop-blur-md w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-yellow-400">LuxuryEstate</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" onClick={(e) => handleNavClick('home', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Home</a>
            <a href="#" onClick={(e) => handleNavClick('projects', e)} className="text-yellow-400 cursor-pointer">Projects</a>
            <a href="#" onClick={(e) => handleNavClick('about', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">About</a>
            <a href="#" onClick={(e) => handleNavClick('services', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Services</a>
            <a href="#" onClick={(e) => handleNavClick('blog', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Blog</a>
            <a href="#" onClick={(e) => handleNavClick('contact', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Contact</a>
          </nav>
        </div>
      </header>
      
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Our <span className="text-yellow-400">Projects</span></h1>
          <p className="text-xl text-gray-300 mb-8">Explore our portfolio of luxury developments</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all cursor-pointer">
                <img src={`https://images.unsplash.com/photo-154532441${i}-cc1a3fa10c00?w=600&h=400&fit=crop`} alt="Project" className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2">Luxury Development {i}</h3>
                  <p className="text-gray-400 mb-4">Premium residential project in prime location</p>
                  <div className="flex justify-between text-sm text-gray-400 mb-4">
                    <span>{50 + i * 20} Units</span>
                    <span>Completion: 202{4 + i}</span>
                  </div>
                  <button className="w-full bg-yellow-400 text-black py-2 px-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <footer className="bg-black py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-xl font-bold text-yellow-400 mb-2">LuxuryEstate</div>
          <p className="text-gray-400 text-sm">© 2024 LuxuryEstate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};