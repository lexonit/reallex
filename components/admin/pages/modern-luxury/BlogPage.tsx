import React from 'react';

interface ModernLuxuryBlogPageProps {
  onNavigate: (page: string) => void;
}

export const ModernLuxuryBlogPage: React.FC<ModernLuxuryBlogPageProps> = ({ onNavigate }) => {
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
            <a href="#" onClick={(e) => handleNavClick('services', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Services</a>
            <a href="#" onClick={(e) => handleNavClick('blog', e)} className="text-yellow-400 cursor-pointer">Blog</a>
            <a href="#" onClick={(e) => handleNavClick('contact', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Contact</a>
          </nav>
        </div>
      </header>
      
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6">Latest <span className="text-yellow-400">Insights</span></h1>
          <p className="text-xl text-gray-300 text-center mb-12">Stay updated with luxury real estate trends and market insights</p>
          
          {/* Featured Article */}
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-12 hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop" alt="Featured Article" className="w-full h-64 lg:h-full object-cover" />
              <div className="p-8">
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">Featured</span>
                <h2 className="text-2xl font-bold mb-4">The Future of Luxury Real Estate in 2024</h2>
                <p className="text-gray-300 mb-6">Discover the emerging trends and innovations shaping the luxury real estate market, from smart home technology to sustainable building practices.</p>
                <div className="flex items-center text-gray-400 text-sm mb-6">
                  <span className="mr-4">👤 John Anderson</span>
                  <span>📅 December 1, 2024</span>
                </div>
                <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">Read More</button>
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Top 10 Luxury Neighborhoods to Watch",
                excerpt: "Explore the most promising luxury neighborhoods that offer the best investment potential.",
                author: "Sarah Mitchell",
                date: "November 28, 2024",
                category: "Market Trends",
                image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop"
              },
              {
                title: "Sustainable Luxury: Eco-Friendly Homes",
                excerpt: "How luxury homebuilders are incorporating sustainability without compromising elegance.",
                author: "David Chen",
                date: "November 25, 2024",
                category: "Sustainability",
                image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
              },
              {
                title: "Smart Home Technology Integration",
                excerpt: "The latest in home automation that's transforming luxury living experiences.",
                author: "Emily Rodriguez",
                date: "November 22, 2024",
                category: "Technology",
                image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"
              },
              {
                title: "Investment Strategies for 2024",
                excerpt: "Expert advice on building a diversified real estate portfolio in today's market.",
                author: "Michael Thompson",
                date: "November 20, 2024",
                category: "Investment",
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop"
              },
              {
                title: "Luxury Property Staging Tips",
                excerpt: "Professional staging techniques that can significantly increase your property's appeal.",
                author: "Lisa Park",
                date: "November 18, 2024",
                category: "Selling Tips",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
              },
              {
                title: "International Market Outlook",
                excerpt: "Global trends and opportunities in international luxury real estate markets.",
                author: "Robert Kim",
                date: "November 15, 2024",
                category: "Global Markets",
                image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&h=300&fit=crop"
              }
            ].map((article, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all cursor-pointer">
                <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <span className="bg-gray-700 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium mb-4 inline-block">{article.category}</span>
                  <h3 className="text-lg font-semibold mb-3">{article.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{article.excerpt}</p>
                  <div className="flex items-center text-gray-400 text-xs mb-4">
                    <span className="mr-3">👤 {article.author}</span>
                    <span>📅 {article.date}</span>
                  </div>
                  <button className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm">Read More →</button>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
            <p className="text-gray-300 mb-8">Subscribe to our newsletter for the latest luxury real estate insights and exclusive property listings.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none" />
              <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">Subscribe</button>
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