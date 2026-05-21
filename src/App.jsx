import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Shared Components
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Industries from './pages/Industries';
import Projects from './pages/Projects';
import ProjectDetail from './components/ProjectDetail';
import SpareParts from './pages/SpareParts';
import Certifications from './pages/Certifications';
import Sustainability from './pages/Sustainability';
import Contact from './pages/Contact';

// Policies
import { Privacy, Terms, Cookies } from './pages/Policies';

// Analytics Page View Tracker for React SPA
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Small timeout ensures react-helmet-async has updated the document.title
    const timer = setTimeout(() => {
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: location.pathname + location.search,
          page_title: document.title,
        });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [location]);

  return null;
};

export const App = () => {
  return (
    <HelmetProvider>
      <AnalyticsTracker />
      <div className="d-flex flex-column min-h-screen">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        <Header />
        
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/spare-parts" element={<SpareParts />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Policies */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            
            {/* Wildcard redirect */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>

        <Footer />
        <WhatsAppFloat />
      </div>
    </HelmetProvider>
  );
};

export default App;
