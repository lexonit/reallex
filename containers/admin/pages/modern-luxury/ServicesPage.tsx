import React from 'react';

interface ModernLuxuryServicesPageProps {
  onNavigate: (page: string) => void;
}

export const ModernLuxuryServicesPage: React.FC<ModernLuxuryServicesPageProps> = ({ onNavigate }) => {
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
            <a href="#" onClick={(e) => handleNavClick('about', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">About</a>
            <a href="#" onClick={(e) => handleNavClick('services', e)} className="text-yellow-400 cursor-pointer">Services</a>
            <a href="#" onClick={(e) => handleNavClick('blog', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Blog</a>
            <a href="#" onClick={(e) => handleNavClick('contact', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Contact</a>
          </nav>
        </div>
      </header>
      
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6">Our <span className="text-yellow-400">Services</span></h1>
          <p className="text-xl text-gray-300 text-center mb-12">Comprehensive real estate services tailored to your needs</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Property Sales", 
                description: "Expert guidance through buying and selling process with market insights",
                icon: "🏠"
              },
              { 
                title: "Investment Advisory", 
                description: "Strategic investment advice and portfolio management for optimal returns",
                icon: "📈"
              },
              { 
                title: "Market Analysis", 
                description: "Comprehensive market insights and valuations for informed decisions",
                icon: "📊"
              },
              { 
                title: "Property Management", 
                description: "End-to-end property management ensuring maximum rental yields",
                icon: "🏢"
              },
              { 
                title: "Legal Support", 
                description: "Complete legal assistance for seamless property transactions",
                icon: "⚖️"
              },
              { 
                title: "24/7 Support", 
                description: "Round-the-clock customer support for all your real estate needs",
                icon: "🎧"
              }
            ].map((service, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Consultation", description: "Initial meeting to understand your needs" },
                { step: "02", title: "Analysis", description: "Market research and property evaluation" },
                { step: "03", title: "Execution", description: "Seamless transaction management" },
                { step: "04", title: "Support", description: "Ongoing support and relationship management" }
              ].map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-yellow-400 text-black rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {process.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{process.title}</h3>
                  <p className="text-gray-400 text-sm">{process.description}</p>
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