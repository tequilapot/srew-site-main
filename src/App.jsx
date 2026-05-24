import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import Videos from './pages/Videos';
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
            <Route path="/videos" element={<Videos />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Policies */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            
            {/* Old static HTML page redirects for fallbacks */}
            <Route path="/about.html" element={<Navigate to="/about" replace />} />
            <Route path="/products.html" element={<Navigate to="/products" replace />} />
            <Route path="/industries.html" element={<Navigate to="/industries" replace />} />
            <Route path="/projects.html" element={<Navigate to="/projects" replace />} />
            <Route path="/spare-parts.html" element={<Navigate to="/spare-parts" replace />} />
            <Route path="/videos.html" element={<Navigate to="/videos" replace />} />
            <Route path="/contact.html" element={<Navigate to="/contact" replace />} />
            <Route path="/privacy-policy.html" element={<Navigate to="/privacy" replace />} />
            <Route path="/terms-and-conditions.html" element={<Navigate to="/terms" replace />} />
            <Route path="/cookies.html" element={<Navigate to="/cookies" replace />} />
            
            {/* Product Page redirects */}
            <Route path="/jaw-crusher-manufacturer.html" element={<Navigate to="/products/jaw-crushers" replace />} />
            <Route path="/european-type-jaw-crusher.html" element={<Navigate to="/products/jaw-crushers" replace />} />
            <Route path="/grease-jaw-crusher.html" element={<Navigate to="/products/jaw-crushers" replace />} />
            <Route path="/cone-crusher-plant.html" element={<Navigate to="/products/cone-crushers" replace />} />
            <Route path="/cone-crusher-manufacturer.html" element={<Navigate to="/products/cone-crushers" replace />} />
            <Route path="/single-cylinder-cone-crusher.html" element={<Navigate to="/products/cone-crushers" replace />} />
            <Route path="/multi-cylinder-hydraulic-cone-crusher.html" element={<Navigate to="/products/cone-crushers" replace />} />
            <Route path="/vsi-crusher-m-sand.html" element={<Navigate to="/products/vsi-hsi-crushers" replace />} />
            <Route path="/hsi-crusher-manufacturer.html" element={<Navigate to="/products/vsi-hsi-crushers" replace />} />
            <Route path="/hydraulic-impact-crusher.html" element={<Navigate to="/products/vsi-hsi-crushers" replace />} />
            <Route path="/roller-crusher-manufacturer.html" element={<Navigate to="/products/roller-crushers" replace />} />
            <Route path="/vibrating-screen-manufacturer.html" element={<Navigate to="/products/vibrating-screens" replace />} />
            <Route path="/vibrating-screen-3-deck.html" element={<Navigate to="/products/vibrating-screens" replace />} />
            <Route path="/triple-shaft-vibrating-screen.html" element={<Navigate to="/products/vibrating-screens" replace />} />
            <Route path="/damping-vibrating-screen.html" element={<Navigate to="/products/vibrating-screens" replace />} />
            <Route path="/grizzly-feeder-manufacturer.html" element={<Navigate to="/products/grizzly-feeders" replace />} />
            <Route path="/sand-dryer-manufacturer.html" element={<Navigate to="/products/sand-dryers" replace />} />
            <Route path="/silo-storage-systems.html" element={<Navigate to="/products/silos-hoppers" replace />} />
            <Route path="/control-panel-automation.html" element={<Navigate to="/products/control-panels" replace />} />
            <Route path="/cd-recycling-plant.html" element={<Navigate to="/products/recycling-units" replace />} />
            <Route path="/belt-conveyor-manufacturer.html" element={<Navigate to="/products/conveyors" replace />} />

            {/* Project Page redirects */}
            <Route path="/project-west-bengal.html" element={<Navigate to="/projects/west-bengal-200-tph" replace />} />
            <Route path="/project-singareni.html" element={<Navigate to="/projects/singareni-400-tph" replace />} />
            <Route path="/project-odisha-mobile.html" element={<Navigate to="/projects/odisha-40-tph-mobile" replace />} />
            <Route path="/project-keesara.html" element={<Navigate to="/projects/keesara-150-tph" replace />} />
            <Route path="/project-hyderabad-recycling.html" element={<Navigate to="/projects/urban-cd-recycling" replace />} />
            
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
