import React from 'react';

interface ClassicProfessionalTemplateProps {
  page: string;
  onNavigate: (page: string) => void;
}

export const ClassicProfessionalTemplate: React.FC<ClassicProfessionalTemplateProps> = ({ page, onNavigate }) => {
  const getNavClass = (currentPage: string) => page === currentPage ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600 font-medium';
  
  const handleNavClick = (targetPage: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(targetPage);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-800">EstateClassic</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" onClick={(e) => handleNavClick('home', e)} className={`${getNavClass('home')} cursor-pointer`}>Home</a>
            <a href="#" onClick={(e) => handleNavClick('projects', e)} className={`${getNavClass('projects')} cursor-pointer`}>Projects</a>
            <a href="#" onClick={(e) => handleNavClick('about', e)} className={`${getNavClass('about')} cursor-pointer`}>About</a>
            <a href="#" onClick={(e) => handleNavClick('services', e)} className={`${getNavClass('services')} cursor-pointer`}>Services</a>
            <a href="#" onClick={(e) => handleNavClick('blog', e)} className={`${getNavClass('blog')} cursor-pointer`}>Blog</a>
            <a href="#" onClick={(e) => handleNavClick('contact', e)} className={`${getNavClass('contact')} cursor-pointer`}>Contact</a>
          </nav>
        </div>
      </header>
      
      {page === 'home' && (
        <>
          <section className="bg-blue-800 text-white py-16">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h1 className="text-4xl font-bold mb-4">Your Trusted Real Estate Partner</h1>
              <p className="text-lg mb-6 text-blue-100">Over 25 years of experience helping families find perfect homes</p>
              <button onClick={(e) => handleNavClick('projects', e)} className="bg-white text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer">Browse Properties</button>
            </div>
          </section>
          <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <img src={`https://images.unsplash.com/photo-155405188${i}-c18c203602cb?w=400&h=300&fit=crop`} alt="Property" className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="text-xl font-bold text-blue-800 mb-2">${(450 + i * 50).toLocaleString()},000</div>
                      <h3 className="text-lg font-semibold mb-2">Family Home {i}</h3>
                      <p className="text-gray-600 mb-3">Suburbia, CA</p>
                      <button className="w-full bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="bg-gray-100 py-12 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">What Our Clients Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Jennifer Smith", text: "Outstanding service! They helped us find our dream home." },
                  { name: "Michael Johnson", text: "Professional and knowledgeable. Made selling stress-free." },
                  { name: "Sarah Davis", text: "Excellent communication. Highly recommend their services." }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-500 text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
      
      {page === 'projects' && (
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Our Projects</h1>
            <p className="text-xl text-gray-600 text-center mb-12">Discover our successful residential developments</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <img src={`https://images.unsplash.com/photo-155405188${i}-c18c203602cb?w=600&h=400&fit=crop`} alt="Project" className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-2">Residential Complex {i}</h3>
                    <p className="text-gray-600 mb-4">Modern family-friendly community with {20 + i * 10} units</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>Completed: 202{1 + i}</span>
                      <span>{20 + i * 10} Units</span>
                    </div>
                    <button className="w-full bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {page === 'about' && (
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">About EstateClassic</h1>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">Your trusted partner in real estate for over 25 years, helping families find their perfect homes with professionalism and integrity.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[
                { number: "25+", label: "Years Experience" },
                { number: "1,200+", label: "Homes Sold" },
                { number: "98%", label: "Client Satisfaction" },
                { number: "50+", label: "Team Members" }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-800 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {page === 'services' && (
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
            <p className="text-xl text-gray-600 text-center mb-12">Comprehensive real estate services for all your property needs</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Home Buying", description: "Expert guidance for first-time and experienced buyers", icon: "🏠" },
                { title: "Home Selling", description: "Marketing strategies to get the best price for your property", icon: "💰" },
                { title: "Property Management", description: "Full-service property management for investors", icon: "🗺" },
                { title: "Market Analysis", description: "Detailed market reports and property valuations", icon: "📈" },
                { title: "Investment Consulting", description: "Strategic advice for real estate investments", icon: "🎯" },
                { title: "Relocation Services", description: "Comprehensive support for relocating families", icon: "🚚" }
              ].map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-800">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {page === 'contact' && (
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
            <p className="text-xl text-gray-600 text-center mb-12">Ready to start your real estate journey? Get in touch with us today.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none" />
                    <input type="text" placeholder="Last Name" className="border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none" />
                  <input type="tel" placeholder="Phone" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none" />
                  <textarea placeholder="Message" rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none" />
                  <button className="w-full bg-blue-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Send Message</button>
                </form>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4">Our Office</h3>
                  <div className="space-y-3 text-gray-600">
                    <p>📞 (555) 123-4567</p>
                    <p>✉️ info@estateclassic.com</p>
                    <p>📍 456 Professional Ave, Suite 200, Cityville, CA 90210</p>
                    <p>🕒 Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {page === 'blog' && (
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Real Estate Insights</h1>
            <p className="text-xl text-gray-600 text-center mb-12">Stay informed with the latest market trends and tips</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "First-Time Home Buyer Guide", excerpt: "Everything you need to know about buying your first home", date: "Dec 5, 2024" },
                { title: "2024 Market Trends", excerpt: "Key trends shaping the real estate market this year", date: "Dec 3, 2024" },
                { title: "Selling Tips for Maximum Value", excerpt: "How to prepare your home to sell for the best price", date: "Dec 1, 2024" },
                { title: "Investment Property Guide", excerpt: "Smart strategies for real estate investing in 2024", date: "Nov 28, 2024" },
                { title: "Mortgage Rate Outlook", excerpt: "What to expect from interest rates in the coming months", date: "Nov 25, 2024" },
                { title: "Home Staging Essentials", excerpt: "Professional staging tips to make your home irresistible", date: "Nov 22, 2024" }
              ].map((article, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <img src={`https://images.unsplash.com/photo-155405188${(index % 3) + 1}-c18c203602cb?w=400&h=250&fit=crop`} alt={article.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <span className="text-blue-600 text-sm font-medium">{article.date}</span>
                    <h3 className="text-lg font-semibold mb-2 mt-1">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Read More →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <footer className="bg-blue-800 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-xl font-bold mb-2">EstateClassic</div>
          <p className="text-blue-200 text-sm">© 2024 EstateClassic. Your trusted real estate partner.</p>
        </div>
      </footer>
    </div>
  );
};