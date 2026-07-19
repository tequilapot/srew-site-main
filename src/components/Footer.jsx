import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="footer py-5 bg-dark text-white" role="contentinfo">
      <div className="container">
        <div className="row g-4">
          {/* Column 1: Brand details & IndiaMART */}
          <div className="col-lg-4 col-md-6">
            <h3 className="h4 text-white mb-3">SREW Projects - Crushing & Screening Plant Manufacturer WORKS</h3>
            <p className="small mb-4 text-white-50">
              ISO 9001:2015 Certified Manufacturer of Crushing, Screening &amp; Sand Processing Plants. Delivering 30–800 TPH solutions across the Indian subcontinent since 2018 with 10+ years of engineering core expertise.
            </p>
            <div className="social-icons mb-4">
              <a href="https://www.facebook.com/profile.php?id=100070029793724" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.linkedin.com/company/thesrew" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="https://www.youtube.com/channel/UCXv5mgy6tQZUApyfT3Komtw" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
              <a href="https://www.instagram.com/srenggworks/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
            
            <a 
              href="https://www.indiamart.com/srengineeringworks-266746886/aboutus.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="d-block mb-4" 
              aria-label="IndiaMART company profile for SREW Projects - Crushing & Screening Plant Manufacturer WORKS"
              style={{ maxWidth: '160px' }}
            >
              <img src="/images/footer/indiamart.jpg" alt="IndiaMART Verified Seller Badge" className="img-fluid rounded" />
            </a>

            <ul className="list-unstyled small footer-links mb-0">
              <li>
                <a href="https://www.indiamart.com/srengineeringworks-266746886/" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none">
                  <i className="fas fa-store me-2 text-warning"></i> IndiaMART Catalog
                </a>
              </li>
              <li>
                <a href="https://www.indiamart.com/srengineeringworks-266746886/enquiry.html" target="_blank" rel="noopener noreferrer" className="text-white-50 text-decoration-none">
                  <i className="fas fa-envelope me-2 text-warning"></i> Send IndiaMART Enquiry
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h3 className="h4 text-white mb-3">Quick Links</h3>
            <ul className="list-unstyled footer-links mb-0">
              <li><Link to="/" onClick={handleNavClick} className="text-white-50">Home</Link></li>
              <li><Link to="/about" onClick={handleNavClick} className="text-white-50">About Us</Link></li>
              <li><Link to="/products" onClick={handleNavClick} className="text-white-50">Products</Link></li>
              <li><Link to="/industries" onClick={handleNavClick} className="text-white-50">Industries</Link></li>
              <li><Link to="/projects" onClick={handleNavClick} className="text-white-50">Projects</Link></li>
              <li><Link to="/spare-parts" onClick={handleNavClick} className="text-white-50">Spare Parts</Link></li>
              <li><Link to="/certifications" onClick={handleNavClick} className="text-white-50">Quality Hub</Link></li>
              <li><Link to="/sustainability" onClick={handleNavClick} className="text-white-50">Eco Systems</Link></li>
              <li><Link to="/contact" onClick={handleNavClick} className="text-white-50">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Equipment Catalog */}
          <div className="col-lg-3 col-md-6">
            <h3 className="h4 text-white mb-3">Equipment</h3>
            <ul className="list-unstyled footer-links mb-0">
              {products.slice(0, 8).map((prod) => (
                <li key={prod.slug}>
                  <Link to={`/products/${prod.slug}`} onClick={handleNavClick} className="text-white-50">
                    {prod.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="col-lg-3 col-md-6">
            <h3 className="h4 text-white mb-3">Contact Info</h3>
            <ul className="list-unstyled contact-info mb-0 text-white-50 small">
              <li>
                <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                <span>11-125, IDA Jeedimetla, Dulapally, Hyderabad, Telangana, India - 500100</span>
              </li>
              <li>
                <i className="fas fa-phone" aria-hidden="true"></i>
                <a href="tel:+918790759460" className="text-white-50 text-decoration-none">+91 8790759460</a>
              </li>
              <li>
                <i className="fas fa-envelope" aria-hidden="true"></i>
                <a href="mailto:srenggworks2016@gmail.com" className="text-white-50 text-decoration-none">srenggworks2016@gmail.com</a>
              </li>
            </ul>
            <div className="mt-4 d-flex flex-column gap-2 align-items-start">
              <a 
                href="https://wa.me/918790759460" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-success btn-curved small d-inline-flex align-items-center" 
                aria-label="Chat on WhatsApp"
              >
                <i className="fab fa-whatsapp me-2"></i> Chat on WhatsApp
              </a>
              <a 
                href="https://share.google/hDqCzUIV3UuE8WGLg" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline-light btn-curved small d-inline-flex align-items-center"
                aria-label="Review us on Google"
                style={{
                  borderColor: '#4285F4',
                  background: 'rgba(66, 133, 244, 0.15)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#4285F4';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(66, 133, 244, 0.15)';
                  e.currentTarget.style.color = '';
                }}
              >
                <i className="fab fa-google me-2 text-warning" style={{ color: '#FBBC05' }}></i>
                <span className="me-2 text-white">Review us on Google</span>
                <span className="text-warning small d-flex" style={{ gap: '2px' }}>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </span>
              </a>
            </div>
          </div>
        </div>

        <hr className="mt-4 mb-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />
        
        <div className="row align-items-center small text-white-50">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-2 mb-md-0">&copy; {currentYear} SREW Projects - Crushing & Screening Plant Manufacturer WORKS. All Rights Reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item me-3"><Link to="/privacy" onClick={handleNavClick} className="text-white-50 text-decoration-none">Privacy Policy</Link></li>
              <li className="list-inline-item me-3"><Link to="/terms" onClick={handleNavClick} className="text-white-50 text-decoration-none">Terms &amp; Conditions</Link></li>
              <li className="list-inline-item"><Link to="/cookies" onClick={handleNavClick} className="text-white-50 text-decoration-none">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
