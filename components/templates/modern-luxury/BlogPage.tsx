import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const ModernLuxuryBlog: React.FC = () => {
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
            <a href="#" className="text-yellow-400">Blog</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Latest <span className="text-yellow-400">Insights</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Stay updated with the latest trends, tips, and insights from the luxury real estate market.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
                alt="Featured Article"
                className="w-full h-64 lg:h-full object-cover"
              />
              <div className="p-8">
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                  Featured
                </span>
                <h2 className="text-3xl font-bold mb-4">The Future of Luxury Real Estate in 2024</h2>
                <p className="text-gray-300 mb-6">
                  Discover the emerging trends and innovations shaping the luxury real estate market, 
                  from smart home technology to sustainable building practices.
                </p>
                <div className="flex items-center text-gray-400 text-sm mb-6">
                  <User className="w-4 h-4 mr-2" />
                  <span className="mr-4">John Anderson</span>
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>December 1, 2024</span>
                </div>
                <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center">
                  Read More <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Top 10 Luxury Neighborhoods to Watch",
                excerpt: "Explore the most promising luxury neighborhoods that offer the best investment potential and lifestyle amenities.",
                image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop",
                author: "Sarah Mitchell",
                date: "November 28, 2024",
                category: "Market Trends"
              },
              {
                title: "Sustainable Luxury: Eco-Friendly Homes",
                excerpt: "How luxury homebuilders are incorporating sustainability without compromising on elegance and comfort.",
                image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
                author: "David Chen",
                date: "November 25, 2024",
                category: "Sustainability"
              },
              {
                title: "Smart Home Technology Integration",
                excerpt: "The latest in home automation and smart technology that's transforming luxury living experiences.",
                image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
                author: "Emily Rodriguez",
                date: "November 22, 2024",
                category: "Technology"
              },
              {
                title: "Investment Strategies for High-Net-Worth Individuals",
                excerpt: "Expert advice on building a diversified real estate portfolio in today's dynamic market.",
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
                author: "Michael Thompson",
                date: "November 20, 2024",
                category: "Investment"
              },
              {
                title: "Luxury Property Staging Tips",
                excerpt: "Professional staging techniques that can significantly increase your property's appeal and value.",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
                author: "Lisa Park",
                date: "November 18, 2024",
                category: "Selling Tips"
              },
              {
                title: "International Luxury Market Outlook",
                excerpt: "Global trends and opportunities in international luxury real estate markets around the world.",
                image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop",
                author: "Robert Kim",
                date: "November 15, 2024",
                category: "Global Markets"
              }
            ].map((article, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all">
                <img 
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="bg-gray-700 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium mb-4 inline-block">
                    {article.category}
                  </span>
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center text-gray-400 text-xs mb-4">
                    <User className="w-3 h-3 mr-1" />
                    <span className="mr-3">{article.author}</span>
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{article.date}</span>
                  </div>
                  <button className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm inline-flex items-center">
                    Read More <ArrowRight className="ml-1 w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 px-6 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
          <p className="text-gray-300 mb-8">Subscribe to our newsletter for the latest luxury real estate insights and exclusive property listings.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
            />
            <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
              Subscribe
            </button>
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