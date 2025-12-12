import React, { useState } from 'react';
import { RealEstateTemplate } from '../../types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Download, Eye, Code, Palette, Layout, Smartphone } from 'lucide-react';
import {
  DefaultTemplate,
  ModernLuxuryHomePage,
  ModernLuxuryProjectsPage,
  ModernLuxuryAboutPage,
  ModernLuxuryServicesPage,
  ModernLuxuryContactPage,
  ModernLuxuryBlogPage,
  ClassicProfessionalTemplate
} from './pages';

const REAL_ESTATE_TEMPLATES: RealEstateTemplate[] = [
  {
    id: 'modern-luxury',
    name: 'Modern Luxury',
    description: 'A sleek, contemporary design perfect for high-end real estate agencies',
    category: 'Luxury',
    preview: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    features: ['Dark/Light Theme', 'Property Showcase', 'Interactive Map', 'Virtual Tours', 'Lead Forms'],
    pages: [
      { id: 'home', name: 'Home', component: 'HomePage', route: '/' },
      { id: 'projects', name: 'Projects', component: 'ProjectsPage', route: '/projects' },
      { id: 'about', name: 'About', component: 'AboutPage', route: '/about' },
      { id: 'services', name: 'Services', component: 'ServicesPage', route: '/services' },
      { id: 'contact', name: 'Contact Us', component: 'ContactPage', route: '/contact' },
      { id: 'blog', name: 'Blog', component: 'BlogPage', route: '/blog' },
    ],
    colorScheme: {
      primary: '#1a1a1a',
      secondary: '#f5f5f5',
      accent: '#d4af37'
    },
    layout: 'modern',
    responsive: true
  },
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional and trustworthy design for established real estate firms',
    category: 'Professional',
    preview: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop',
    features: ['Clean Layout', 'Property Grid', 'Agent Profiles', 'Testimonials', 'Newsletter'],
    pages: [
      { id: 'home', name: 'Home', component: 'HomePage', route: '/' },
      { id: 'projects', name: 'Projects', component: 'ProjectsPage', route: '/projects' },
      { id: 'about', name: 'About', component: 'AboutPage', route: '/about' },
      { id: 'services', name: 'Services', component: 'ServicesPage', route: '/services' },
      { id: 'contact', name: 'Contact Us', component: 'ContactPage', route: '/contact' },
      { id: 'blog', name: 'Blog', component: 'BlogPage', route: '/blog' },
    ],
    colorScheme: {
      primary: '#2c3e50',
      secondary: '#ecf0f1',
      accent: '#3498db'
    },
    layout: 'classic',
    responsive: true
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Minimalist design focusing on properties and clean aesthetics',
    category: 'Minimalist',
    preview: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    features: ['Minimal UI', 'Large Images', 'Typography Focus', 'Search Filters', 'Quick Contact'],
    pages: [
      { id: 'home', name: 'Home', component: 'HomePage', route: '/' },
      { id: 'projects', name: 'Projects', component: 'ProjectsPage', route: '/projects' },
      { id: 'about', name: 'About', component: 'AboutPage', route: '/about' },
      { id: 'services', name: 'Services', component: 'ServicesPage', route: '/services' },
      { id: 'contact', name: 'Contact Us', component: 'ContactPage', route: '/contact' },
      { id: 'blog', name: 'Blog', component: 'BlogPage', route: '/blog' },
    ],
    colorScheme: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      accent: '#000000'
    },
    layout: 'minimal',
    responsive: true
  },
  {
    id: 'luxury-premium',
    name: 'Luxury Premium',
    description: 'Premium design with gold accents for luxury property developers',
    category: 'Luxury',
    preview: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    features: ['Gold Accents', 'Video Backgrounds', 'Parallax Scrolling', 'Property Calculator', 'VIP Forms'],
    pages: [
      { id: 'home', name: 'Home', component: 'HomePage', route: '/' },
      { id: 'projects', name: 'Projects', component: 'ProjectsPage', route: '/projects' },
      { id: 'about', name: 'About', component: 'AboutPage', route: '/about' },
      { id: 'services', name: 'Services', component: 'ServicesPage', route: '/services' },
      { id: 'contact', name: 'Contact Us', component: 'ContactPage', route: '/contact' },
      { id: 'blog', name: 'Blog', component: 'BlogPage', route: '/blog' },
    ],
    colorScheme: {
      primary: '#1a1a1a',
      secondary: '#2c2c2c',
      accent: '#ffd700'
    },
    layout: 'luxury',
    responsive: true
  },
  {
    id: 'corporate-business',
    name: 'Corporate Business',
    description: 'Professional corporate design for large real estate companies',
    category: 'Corporate',
    preview: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    features: ['Corporate Branding', 'Team Directory', 'Office Locations', 'Investment Calculator', 'Reports'],
    pages: [
      { id: 'home', name: 'Home', component: 'HomePage', route: '/' },
      { id: 'projects', name: 'Projects', component: 'ProjectsPage', route: '/projects' },
      { id: 'about', name: 'About', component: 'AboutPage', route: '/about' },
      { id: 'services', name: 'Services', component: 'ServicesPage', route: '/services' },
      { id: 'contact', name: 'Contact Us', component: 'ContactPage', route: '/contact' },
      { id: 'blog', name: 'Blog', component: 'BlogPage', route: '/blog' },
    ],
    colorScheme: {
      primary: '#2c5aa0',
      secondary: '#f4f4f4',
      accent: '#ff6b35'
    },
    layout: 'corporate',
    responsive: true
  }
];

export const TemplateManagement: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<RealEstateTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleDownloadTemplate = async (template: RealEstateTemplate) => {
    // Generate and download React code for the template
    const templateCode = generateTemplateCode(template);
    
    // Create a text file with the project structure
    const blob = new Blob([
      `${template.name} React Template\n`,
      `================================\n\n`,
      `This download contains the project structure for the ${template.name} template.\n`,
      `To set up the project:\n\n`,
      `1. Create a new React project: npx create-react-app ${template.id}-template --template typescript\n`,
      `2. Replace the generated files with the content below\n`,
      `3. Install additional dependencies: npm install react-router-dom lucide-react\n`,
      `4. Install Tailwind CSS: npm install -D tailwindcss postcss autoprefixer\n`,
      `5. Initialize Tailwind: npx tailwindcss init -p\n\n`,
      `Project Structure:\n`,
      `==================\n\n`,
      templateCode
    ], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.id}-react-template-structure.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    alert(`${template.name} template structure downloaded! Please follow the instructions in the downloaded file to set up your React project.`);
  };

  const generateTemplateCode = (template: RealEstateTemplate): string => {
    // Generate a complete React project structure as a JSON string
    const projectStructure = {
      'package.json': JSON.stringify({
        "name": `${template.id}-template`,
        "version": "1.0.0",
        "description": template.description,
        "main": "index.js",
        "scripts": {
          "start": "react-scripts start",
          "build": "react-scripts build",
          "test": "react-scripts test",
          "eject": "react-scripts eject"
        },
        "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-router-dom": "^6.8.0",
          "lucide-react": "^0.263.1",
          "tailwindcss": "^3.3.0"
        },
        "devDependencies": {
          "react-scripts": "5.0.1",
          "@types/react": "^18.0.28",
          "@types/react-dom": "^18.0.11",
          "typescript": "^4.9.5"
        }
      }, null, 2),
      
      'src/App.tsx': `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import './App.css';

// Template: ${template.name}
// Description: ${template.description}
// Layout: ${template.layout}
// Color Scheme: ${JSON.stringify(template.colorScheme, null, 2)}

const App: React.FC = () => {
  return (
    <Router>
      <div className="${template.layout}-template">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;`,

      'src/index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

      'src/App.css': `/* ${template.name} Template Styles */
.${template.layout}-template {
  --primary-color: ${template.colorScheme.primary};
  --secondary-color: ${template.colorScheme.secondary};
  --accent-color: ${template.colorScheme.accent};
}

/* Add your custom styles here */`,

      'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Global styles for ${template.name} template */`,

      'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '${template.colorScheme.primary}',
        secondary: '${template.colorScheme.secondary}',
        accent: '${template.colorScheme.accent}',
      }
    },
  },
  plugins: [],
}`,

      'public/index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="${template.colorScheme.primary}" />
    <meta name="description" content="${template.description}" />
    <title>${template.name} - Real Estate Template</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,

      'README.md': `# ${template.name} - Real Estate Template

${template.description}

## Features
${template.features.map(feature => `- ${feature}`).join('\n')}

## Installation

1. Extract the template files
2. Run \`npm install\` to install dependencies
3. Run \`npm start\` to start the development server
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Customization

This template uses Tailwind CSS for styling. You can customize the colors by editing the \`tailwind.config.js\` file.

Current color scheme:
- Primary: ${template.colorScheme.primary}
- Secondary: ${template.colorScheme.secondary}
- Accent: ${template.colorScheme.accent}

## Pages Included
${template.pages.map(page => `- ${page.name} (${page.route})`).join('\n')}

## Layout Type
${template.layout.charAt(0).toUpperCase() + template.layout.slice(1)}

## License
MIT License - Feel free to use this template for your projects.
`
    };

    // Convert the project structure to a downloadable format
    return JSON.stringify(projectStructure, null, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Real Estate Website Templates</h1>
          <p className="text-gray-600 text-lg">Choose from our collection of professional real estate website templates. Each template comes with complete React.js source code.</p>
        </div>

        {previewMode && selectedTemplate ? (
          <TemplatePreview 
            template={selectedTemplate} 
            onClose={() => setPreviewMode(false)} 
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {REAL_ESTATE_TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={() => {
                  setSelectedTemplate(template);
                  setPreviewMode(true);
                }}
                onDownload={() => handleDownloadTemplate(template)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface TemplateCardProps {
  template: RealEstateTemplate;
  onPreview: () => void;
  onDownload: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onPreview, onDownload }) => {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative">
        <img 
          src={template.preview} 
          alt={template.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {template.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
        <p className="text-gray-600 mb-4">{template.description}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                {feature}
              </span>
            ))}
            {template.features.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                +{template.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Pages Included:</h4>
          <div className="flex flex-wrap gap-1">
            {template.pages.map((page, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                {page.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Layout className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 capitalize">{template.layout}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Responsive</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={onPreview}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={onDownload}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
};

interface TemplatePreviewProps {
  template: RealEstateTemplate;
  onClose: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onClose }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLiveView, setIsLiveView] = useState(true);

  const renderLivePreview = () => {
    // This would render the actual template component based on the selected page
    const templateKey = template.id;
    
    switch (currentPage) {
      case 'home':
        return <TemplateRenderer templateId={templateKey} page="home" onNavigate={setCurrentPage} />;
      case 'projects':
        return <TemplateRenderer templateId={templateKey} page="projects" onNavigate={setCurrentPage} />;
      case 'about':
        return <TemplateRenderer templateId={templateKey} page="about" onNavigate={setCurrentPage} />;
      case 'services':
        return <TemplateRenderer templateId={templateKey} page="services" onNavigate={setCurrentPage} />;
      case 'contact':
        return <TemplateRenderer templateId={templateKey} page="contact" onNavigate={setCurrentPage} />;
      case 'blog':
        return <TemplateRenderer templateId={templateKey} page="blog" onNavigate={setCurrentPage} />;
      default:
        return <TemplateRenderer templateId={templateKey} page="home" onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Preview Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">{template.name} - Live Preview</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsLiveView(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isLiveView ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Live View
              </button>
              <button
                onClick={() => setIsLiveView(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  !isLiveView ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Details
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Page Navigation */}
            <select 
              value={currentPage} 
              onChange={(e) => setCurrentPage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="home">Home Page</option>
              <option value="projects">Projects</option>
              <option value="about">About</option>
              <option value="services">Services</option>
              <option value="contact">Contact</option>
              <option value="blog">Blog</option>
            </select>
            <Button onClick={onClose} variant="outline">
              Close Preview
            </Button>
          </div>
        </div>
        
        {/* Preview Content */}
        <div className="flex-1 overflow-hidden">
          {isLiveView ? (
            <div className="h-full bg-gray-100">
              {/* Simulated Browser Chrome */}
              <div className="bg-gray-200 px-4 py-2 flex items-center space-x-2 border-b">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
                  https://your-website.com/{currentPage === 'home' ? '' : currentPage}
                </div>
              </div>
              {/* Live Preview Area */}
              <div className="h-full overflow-auto">
                {renderLivePreview()}
              </div>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-auto">
              <div>
                <img 
                  src={template.preview} 
                  alt={template.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
                />
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Color Scheme</h3>
                    <div className="flex space-x-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: template.colorScheme.primary }}
                      ></div>
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: template.colorScheme.secondary }}
                      ></div>
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: template.colorScheme.accent }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Template Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Category:</span>
                    <span className="ml-2 font-medium">{template.category}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Layout Type:</span>
                    <span className="ml-2 font-medium capitalize">{template.layout}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Responsive:</span>
                    <span className="ml-2 font-medium">{template.responsive ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Features</h4>
                  <ul className="space-y-1">
                    {template.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Pages Included</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {template.pages.map((page, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                        {page.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Template Renderer Component
interface TemplateRendererProps {
  templateId: string;
  page: string;
  onNavigate: (page: string) => void;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({ templateId, page, onNavigate }) => {
  // This component renders the actual template based on ID and page
  
  if (templateId === 'modern-luxury') {
    switch (page) {
      case 'home':
        return <ModernLuxuryHomePage onNavigate={onNavigate} />;
      case 'projects':
        return <ModernLuxuryProjectsPage onNavigate={onNavigate} />;
      case 'about':
        return <ModernLuxuryAboutPage onNavigate={onNavigate} />;
      case 'services':
        return <ModernLuxuryServicesPage onNavigate={onNavigate} />;
      case 'contact':
        return <ModernLuxuryContactPage onNavigate={onNavigate} />;
      case 'blog':
        return <ModernLuxuryBlogPage onNavigate={onNavigate} />;
      default:
        return <ModernLuxuryHomePage onNavigate={onNavigate} />;
    }
  }
  
  if (templateId === 'classic-professional') {
    return <ClassicProfessionalTemplate page={page} onNavigate={onNavigate} />;
  }
  
  // For other templates, show a placeholder with the reference style
  return <DefaultTemplate templateId={templateId} page={page} onNavigate={onNavigate} />;
};
interface ModernLuxuryLivePreviewProps {
  onNavigate: (page: string) => void;
}

const ModernLuxuryLivePreview: React.FC<ModernLuxuryLivePreviewProps> = ({ onNavigate }) => {
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

// Additional preview components for other pages
interface ModernLuxuryPreviewProps {
  onNavigate: (page: string) => void;
}

const ModernLuxuryProjectsPreview: React.FC<ModernLuxuryPreviewProps> = ({ onNavigate }) => {
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

const ModernLuxuryAboutPreview: React.FC<ModernLuxuryPreviewProps> = ({ onNavigate }) => {
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

const ModernLuxuryServicesPreview: React.FC<ModernLuxuryPreviewProps> = ({ onNavigate }) => {
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

const ModernLuxuryContactPreview: React.FC<ModernLuxuryPreviewProps> = ({ onNavigate }) => {
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
            <a href="#" onClick={(e) => handleNavClick('blog', e)} className="hover:text-yellow-400 transition-colors cursor-pointer">Blog</a>
            <a href="#" onClick={(e) => handleNavClick('contact', e)} className="text-yellow-400 cursor-pointer">Contact</a>
          </nav>
        </div>
      </header>
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6">Contact <span className="text-yellow-400">Us</span></h1>
          <p className="text-xl text-gray-300 text-center mb-12">Ready to find your dream property? Get in touch today.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-800 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none" />
                  <input type="text" placeholder="Last Name" className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none" />
                </div>
                <input type="email" placeholder="Email Address" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none" />
                <input type="tel" placeholder="Phone Number" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none" />
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:outline-none">
                  <option value="">Select Inquiry Type</option>
                  <option value="buying">Buying Property</option>
                  <option value="selling">Selling Property</option>
                  <option value="investment">Investment Consultation</option>
                  <option value="general">General Inquiry</option>
                </select>
                <textarea placeholder="Your Message" rows={4} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none" />
                <button className="w-full bg-yellow-400 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">📞</span>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">✉️</span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-300">info@luxuryestate.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">📍</span>
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-gray-300">123 Luxury Avenue, Beverly Hills, CA 90210</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">🕒</span>
                    <div>
                      <p className="font-semibold">Office Hours</p>
                      <p className="text-gray-300">Mon-Fri: 9AM-7PM, Sat: 10AM-4PM</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Our Location</h3>
                <div className="bg-gray-700 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <span className="text-4xl mb-2 block">🗺</span>
                    <p>Interactive Map</p>
                    <p className="text-sm">Beverly Hills, CA</p>
                  </div>
                </div>
              </div>
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

const ModernLuxuryBlogPreview: React.FC<ModernLuxuryPreviewProps> = ({ onNavigate }) => {
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

// Classic Professional Live Preview
interface ClassicProfessionalLivePreviewProps {
  page: string;
  onNavigate: (page: string) => void;
}

const ClassicProfessionalLivePreview: React.FC<ClassicProfessionalLivePreviewProps> = ({ page, onNavigate }) => {
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

// Default Template Preview for other templates
interface DefaultTemplatePreviewProps {
  templateId: string;
  page: string;
  onNavigate: (page: string) => void;
}

const DefaultTemplatePreview: React.FC<DefaultTemplatePreviewProps> = ({ templateId, page, onNavigate }) => {
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