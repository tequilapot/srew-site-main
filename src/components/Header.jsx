import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { products } from '../data/products';

export const Header = () => {
  const [collapsed, setCollapsed] = useState(true);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleNavClick = () => {
    setCollapsed(true);
    window.scrollTo(0, 0);
  };

  return (
    <header role="banner">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top" role="navigation" aria-label="Main navigation">
        <div class="container align-items-center">
          <Link class="navbar-brand me-1 me-md-3 d-flex align-items-center" to="/" onClick={handleNavClick} aria-label="S R ENGG WORKS - Home" style={{ flexShrink: 0, textDecoration: 'none' }}>
            <img src="/images/logo.png" alt="S R ENGG WORKS Logo" class="d-inline-block align-text-top nav-logo-img me-2" />
            <div class="d-flex flex-column justify-content-center" style={{ fontSize: '0.65rem', lineHeight: 1.1, color: '#555' }}>
              <span class="fw-bold" style={{ color: 'var(--c-primary-ultra)' }}>ISO 9001:2015 CERTIFIED</span>
              <span>GSTIN: <span class="text-muted">36BEIPR4767N1ZL</span></span>
            </div>
          </Link>
          
          <div class="d-flex align-items-center order-lg-last ms-auto me-2 me-lg-0" style={{ whiteSpace: 'nowrap' }}>
            <a href="tel:8790759460" class="text-decoration-none fw-bold d-flex align-items-center nav-phone-link" style={{ color: 'var(--c-primary-ultra)', gap: '4px' }}>
              <i class="fas fa-phone-alt"></i> <span>8790759460</span>
            </a>
          </div>

          <button
            className="navbar-toggler border-0 p-1"
            type="button"
            onClick={handleToggle}
            aria-controls="navbarNav"
            aria-expanded={!collapsed}
            aria-label="Toggle navigation menu"
            style={{ flexShrink: 0 }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`collapse navbar-collapse ${collapsed ? '' : 'show'}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/" onClick={handleNavClick}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/about" onClick={handleNavClick}>
                  About Us
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <NavLink className="nav-link dropdown-toggle" to="/products" role="button" aria-expanded="false">
                  Products
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item fw-bold text-primary" to="/products" onClick={handleNavClick}>
                      View All Products
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  {products.map((prod) => (
                    <li key={prod.slug}>
                      <Link className="dropdown-item" to={`/products/${prod.slug}`} onClick={handleNavClick}>
                        {prod.shortName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/industries" onClick={handleNavClick}>
                  Industries
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/projects" onClick={handleNavClick}>
                  Projects
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/spare-parts" onClick={handleNavClick}>
                  Spare Parts
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/certifications" onClick={handleNavClick}>
                  Quality Hub
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/sustainability" onClick={handleNavClick}>
                  Eco Recycling
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/contact" onClick={handleNavClick}>
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
