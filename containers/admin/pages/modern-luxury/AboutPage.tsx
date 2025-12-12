import React from 'react';

interface ModernLuxuryAboutPageProps {
  onNavigate: (page: string) => void;
}

export const ModernLuxuryAboutPage: React.FC<ModernLuxuryAboutPageProps> = ({ onNavigate }) => {
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
            <a href="#" onClick={(e) => handleNavClick('projects', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Projects</a>
            <a href="#" onClick={(e) => handleNavClick('about', e)} className="text-yellow-400 cursor-pointer">About</a>
            <a href="#" onClick={(e) => handleNavClick('services', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Services</a>
            <a href="#" onClick={(e) => handleNavClick('blog', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Blog</a>
            <a href="#" onClick={(e) => handleNavClick('contact', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Contact</a>
          </nav>
        </div>
      </header>
      
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">About <span className="text-yellow-400">LuxuryEstate</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            With over two decades of experience in luxury real estate, we are committed to 
            delivering exceptional properties and unparalleled service.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {[
              { number: "25+", label: "Years Experience" },
              { number: "500+", label: "Happy Clients" },
              { number: "200+", label: "Properties Sold" },
              { number: "95%", label: "Client Satisfaction" }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "John Anderson", role: "CEO & Founder" },
                { name: "Sarah Mitchell", role: "Head of Sales" },
                { name: "David Chen", role: "Senior Agent" }
              ].map((member, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg">
                  <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center text-black font-bold text-xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-yellow-400">{member.role}</p>
                </div>
              ))}
            </div>
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