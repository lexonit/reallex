import React from 'react';
import { Home, Search, Calculator, FileText, Users, Headphones } from 'lucide-react';

export const ModernLuxuryServices: React.FC = () => {
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
            <a href="#" className="text-yellow-400">Services</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Blog</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Our <span className="text-yellow-400">Services</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Comprehensive real estate services tailored to meet your unique needs and exceed your expectations.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Home,
                title: "Property Sales",
                description: "Expert guidance through the entire buying and selling process with market insights and negotiation expertise."
              },
              {
                icon: Search,
                title: "Property Search",
                description: "Personalized property search service to find your perfect home based on your specific requirements."
              },
              {
                icon: Calculator,
                title: "Market Analysis",
                description: "Comprehensive market analysis and property valuation to help you make informed investment decisions."
              },
              {
                icon: FileText,
                title: "Legal Support",
                description: "Complete legal and documentation support to ensure smooth and secure property transactions."
              },
              {
                icon: Users,
                title: "Investment Advisory",
                description: "Strategic investment advice and portfolio management for real estate investment opportunities."
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description: "Round-the-clock customer support and after-sales service to address all your queries and concerns."
              }
            ].map((service, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors">
                <service.icon className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 px-6 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", description: "Initial meeting to understand your needs" },
              { step: "02", title: "Search", description: "Curated property selection based on criteria" },
              { step: "03", title: "Viewing", description: "Guided property tours and inspections" },
              { step: "04", title: "Closing", description: "Complete transaction support and handover" }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-yellow-400 text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{process.title}</h3>
                <p className="text-gray-400">{process.description}</p>
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