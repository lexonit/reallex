import React from 'react';

interface DefaultTemplateProps {
  templateId: string;
  page: string;
  onNavigate: (page: string) => void;
}

export const DefaultTemplate: React.FC<DefaultTemplateProps> = ({ templateId, page, onNavigate }) => {
  const templateName = templateId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const handleNavClick = (targetPage: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(targetPage);
  };
  
  const getNavClass = (currentPage: string) => page === currentPage ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-800">{templateName}</div>
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
      
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            {page === 'home' ? 'Welcome to ' : ''}
            <span className="text-indigo-600 capitalize">{templateName}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {page === 'home' && 'Your premier destination for luxury real estate'}
            {page === 'projects' && 'Explore our portfolio of exceptional developments'}
            {page === 'about' && 'Learn more about our company and expertise'}
            {page === 'services' && 'Discover our comprehensive real estate services'}
            {page === 'contact' && 'Get in touch with our expert team today'}
            {page === 'blog' && 'Stay updated with the latest market insights'}
          </p>
          
          {page === 'home' && (
            <>
              <button onClick={(e) => handleNavClick('projects', e)} className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors mb-12 cursor-pointer">
                Explore Properties
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                    <img src={`https://images.unsplash.com/photo-156051888${i}-ce09059eeffa?w=400&h=300&fit=crop`} alt="Property" className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Premium Property {i}</h3>
                    <p className="text-gray-600 mb-3">Beautiful property in prime location with modern amenities</p>
                    <div className="text-2xl font-bold text-indigo-600 mb-3">${(500 + i * 100).toLocaleString()},000</div>
                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">View Details</button>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {page === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <img src={`https://images.unsplash.com/photo-154532441${i}-cc1a3fa10c00?w=600&h=400&fit=crop`} alt="Project" className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-3">{templateName} Project {i}</h3>
                    <p className="text-gray-600 mb-4">Luxury development featuring {20 + i * 15} premium units with world-class amenities</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>Status: {'Completed'}</span>
                      <span>{20 + i * 15} Units</span>
                    </div>
                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">Learn More</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {page !== 'home' && page !== 'projects' && (
            <div className="bg-white rounded-lg shadow-lg p-12 mt-8">
              <h2 className="text-3xl font-bold mb-6 capitalize">{page} Content</h2>
              <p className="text-lg text-gray-600 mb-6">
                This is a preview of the {page} page for the {templateName} template.
                The actual implementation would include detailed content, forms, and interactive elements.
              </p>
              
              {page === 'about' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  {[
                    { number: "15+", label: "Years Experience" },
                    { number: "800+", label: "Properties Sold" },
                    { number: "95%", label: "Client Satisfaction" },
                    { number: "24/7", label: "Support" }
                  ].map((stat, index) => (
                    <div key={index} className="bg-indigo-50 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {page === 'services' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {[
                    { title: "Property Sales", icon: "🏠" },
                    { title: "Investment Advisory", icon: "📈" },
                    { title: "Market Analysis", icon: "📊" }
                  ].map((service, index) => (
                    <div key={index} className="bg-indigo-50 p-6 rounded-lg">
                      <div className="text-4xl mb-4">{service.icon}</div>
                      <h3 className="text-xl font-semibold mb-3 text-indigo-600">{service.title}</h3>
                      <p className="text-gray-600">Professional {service.title.toLowerCase()} services tailored to your needs</p>
                    </div>
                  ))}
                </div>
              )}
              
              {page === 'contact' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Contact Form</h3>
                    <div className="space-y-4">
                      <input type="text" placeholder="Name" className="w-full p-3 border border-gray-300 rounded-lg" />
                      <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-lg" />
                      <textarea placeholder="Message" rows={3} className="w-full p-3 border border-gray-300 rounded-lg" />
                      <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">Send Message</button>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">Contact Info</h3>
                    <div className="space-y-3 text-gray-600">
                      <p>📞 +1 (555) 123-4567</p>
                      <p>✉️ contact@{templateId}.com</p>
                      <p>📍 123 Business Ave, City, State 12345</p>
                    </div>
                  </div>
                </div>
              )}
              
              {page === 'blog' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-indigo-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      <img src={`https://images.unsplash.com/photo-156051888${i}-ce09059eeffa?w=400&h=250&fit=crop`} alt="Blog Post" className="w-full h-32 object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">Market Insights {i}</h3>
                        <p className="text-gray-600 text-sm">Latest trends and updates in the real estate market...</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <footer className="bg-indigo-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-xl font-bold mb-2">{templateName}</div>
          <p className="text-indigo-200">© 2024 {templateName}. Your trusted real estate partner.</p>
        </div>
      </footer>
    </div>
  );
};