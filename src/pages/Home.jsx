import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';
import { ENV } from '../env';

// Dynamic Counter Component for Premium B2B Ledger Uptime
const AnimatedCounter = ({ endValue, suffix = '', duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [endValue, duration]);

  return <span>{count}{suffix}</span>;
};

export const Home = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    capacity: '',
    material: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    msg: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, location, capacity, material, message } = formData;
    if (!name || !email || !phone || !location || !capacity || !material) {
      setFormStatus({ submitting: false, success: false, error: true, msg: 'Please fill in all required fields.' });
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email.trim())) {
      setFormStatus({ submitting: false, success: false, error: true, msg: 'Please enter a valid business email address.' });
      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(phone.trim())) {
      setFormStatus({ submitting: false, success: false, error: true, msg: 'Please enter a valid 10-digit mobile number starting with 6-9.' });
      return;
    }

    setFormStatus({ submitting: true, success: false, error: false, msg: 'Sending your quote request...' });

    const gsData = new URLSearchParams();
    gsData.append('name', name);
    gsData.append('email', phone); // Maps to Column C (Phone) in target sheet
    gsData.append('phone', email); // Maps to Column D (Email) in target sheet
    gsData.append('subject', `B2B React Quote: ${capacity} Capacity Plant`);
    gsData.append('message', `Project Location: ${location}\nMaterial: ${material}\nMessage: ${message}`);
    gsData.append('requirement', `Plant Capacity: ${capacity} | Material: ${material}`);

    try {
      await fetch(ENV.GOOGLE_SHEETS_GENERAL_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: gsData.toString()
      });

      setFormStatus({ submitting: false, success: true, error: false, msg: 'Quote request submitted successfully!' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        capacity: '',
        material: '',
        message: ''
      });

      // Redirect to thank you page after 1.5s
      setTimeout(() => {
        window.location.href = '/thankyou.html';
      }, 1500);

    } catch (err) {
      setFormStatus({ submitting: false, success: false, error: true, msg: 'Submission failed. Please try again.' });
    }
  };

  const handleQuoteScroll = (e) => {
    e.preventDefault();
    const target = document.getElementById('quote-section');
    if (target) {
      const offset = 80;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>SREW Projects - Complete Crushing, Screening &amp; M-Sand Plant Solutions</title>
        <meta name="description" content="ISO 9001:2015 Certified Manufacturer of Crushing, Screening &amp; Sand Processing Plants | 20–250 TPH | Hyderabad, India | 10+ Years Experience" />
        <meta name="keywords" content="crushing plant, screening plant, jaw crusher, cone crusher, VSI crusher, sand dryer, vibrating screen, material handling, quarry crushing plant, M-Sand plant, M-Sand manufacturer, stone crusher manufacturer, aggregate plant, Hyderabad, India, SREW" />
        <link rel="canonical" href="https://www.srewprojects.com/" />
      </Helmet>

      <main id="main-content" role="main">
        {/* Cinematic B2B Hero Section */}
        <section className="hero-carousel" aria-label="Machinery showcase header" style={{ background: '#0b1d37', display: 'flex', alignItems: 'center' }}>
          <div className="carousel-slide active" style={{ opacity: 1, zIndex: 2 }}>
            <img 
              src="/images/hero-background.jpg" 
              alt="SREW Projects - Heavy Industrial Crushing Plant" 
              className="slide-img"
              style={{ objectFit: 'cover', transform: 'scale(1)' }}
            />
            <div className="slide-overlay"></div>
            <div className="slide-content container text-start">
              <ScrollReveal>
                <span className="usp-badge d-inline-block mb-3" style={{ background: 'rgba(0, 86, 179, 0.75)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50px', padding: '6px 16px', color: '#fff', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  ISO 9001:2015 Certified Partner
                </span>
                <h1 className="text-white fw-bold mb-3" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.15, textShadow: '0 3px 15px rgba(0,0,0,0.6)' }}>
                  Complete Crushing, Screening &amp; M-Sand Plant Solutions | 20–250 TPH
                </h1>
                <p className="lead text-white-50 mb-4" style={{ maxWidth: '750px', fontSize: 'clamp(0.95rem, 1.5vw, 1.25rem)' }}>
                  Design, manufacturing, installation and commissioning of industrial crushing and screening plants.
                </p>
                <div className="btn-container d-flex flex-wrap gap-3 mt-4">
                  <a href="#quote-section" onClick={handleQuoteScroll} className="btn btn-warning btn-curved btn-lg text-dark fw-bold shadow-lg" style={{ border: 'none' }}>
                    Get Quote <i className="fas fa-file-alt ms-2"></i>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const pdfUrl = '/brochures/srew-company-profile.pdf';
                      const link = document.createElement('a');
                      link.href = pdfUrl;
                      link.download = 'SREW-Company-Profile.pdf';
                      link.target = '_blank';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="btn btn-outline-light btn-curved btn-lg"
                  >
                    Download Brochure <i className="fas fa-download ms-2"></i>
                  </button>
                  <a href="https://wa.me/918790759460" target="_blank" rel="noopener noreferrer" className="btn btn-success btn-curved btn-lg text-white fw-bold d-inline-flex align-items-center" style={{ border: 'none', backgroundColor: '#25d366' }}>
                    <i className="fab fa-whatsapp me-2" style={{ fontSize: '1.2rem' }}></i> Chat
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Trusted Clients Logo Ticker */}
        <section className="py-4 bg-white border-bottom border-top" aria-label="Our trusted industrial clients">
          <div className="container">
            <h5 className="text-center text-uppercase text-muted fw-bold mb-4" style={{ fontSize: '0.75rem', letterSpacing: '2px' }}>Trusted by Infrastructure &amp; Mining Giants</h5>
            <div className="row g-4 justify-content-center align-items-center text-center opacity-75">
              <div className="col-4 col-md-2"><img src="/images/clients/ncc-urban-infrastructure-logo.png" alt="NCC Urban" style={{ maxHeight: '38px', objectFit: 'contain', filter: 'grayscale(100%)' }} /></div>
              <div className="col-4 col-md-2"><img src="/images/clients/aparna-enterprises-logo.png" alt="Aparna Enterprises" style={{ maxHeight: '38px', objectFit: 'contain', filter: 'grayscale(100%)' }} /></div>
              <div className="col-4 col-md-2"><img src="/images/clients/versan-logo.png" alt="Versan" style={{ maxHeight: '38px', objectFit: 'contain', filter: 'grayscale(100%)' }} /></div>
              <div className="col-4 col-md-2"><img src="/images/clients/logo-dark.png" alt="SREW Group" style={{ maxHeight: '38px', objectFit: 'contain', filter: 'grayscale(100%)' }} /></div>
            </div>
          </div>
        </section>

        {/* Experience Metrics Section */}
        <section className="py-5 bg-light" aria-label="SREW performance metrics">
          <div className="container py-3">
            <ScrollReveal>
              <div className="performance-ledger text-white" style={{ background: 'var(--grad-dark)', borderRadius: '24px', padding: '3rem 2rem' }}>
                <div className="text-center mb-5">
                  <span className="text-warning small fw-bold text-uppercase tracking-wider">Industrial Track Record</span>
                  <h2 className="text-white fw-bold mt-2">Core Engineering Capabilities</h2>
                </div>

                <div className="row g-4 text-center">
                  <div className="col-md-3 col-6">
                    <div className="metric-card">
                      <div className="metric-number text-warning fw-bold display-4 mb-2">
                        <AnimatedCounter endValue={120} suffix="+" />
                      </div>
                      <div className="metric-label text-white-50 text-uppercase small">Turnkey Plants Deployed</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="metric-card">
                      <div className="metric-number text-warning fw-bold display-4 mb-2">
                        <AnimatedCounter endValue={45} suffix="+" />
                      </div>
                      <div className="metric-label text-white-50 text-uppercase small">Active B2B Clients</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="metric-card">
                      <div className="metric-number text-warning fw-bold display-4 mb-2">
                        <AnimatedCounter endValue={250} suffix=" TPH" />
                      </div>
                      <div className="metric-label text-white-50 text-uppercase small">Max Sizing Capacity</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="metric-card">
                      <div className="metric-number text-warning fw-bold display-4 mb-2">
                        <AnimatedCounter endValue={10} suffix="+" />
                      </div>
                      <div className="metric-label text-white-50 text-uppercase small">Years Engineering Edge</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Industries Served Section */}
        <section className="py-5 bg-white" aria-label="Industries served">
          <div className="container">
            <div className="section-header text-center mb-5">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 text-uppercase">Sector Solutions</span>
              <h2 className="display-5 fw-bold text-dark" style={{ fontFamily: 'var(--ff-display)' }}>Industries We Empower</h2>
              <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>Custom plant solutions optimized for raw minerals, heavy quarrying, and environmental processing.</p>
            </div>
            
            <div className="row g-4">
              <div className="col-lg-3 col-sm-6">
                <div className="card border-0 shadow-sm h-100 p-4 bg-light">
                  <div className="text-primary fs-1 mb-3"><i className="fas fa-mountain"></i></div>
                  <h4 className="fw-bold text-dark mb-2">Mining &amp; Quarrying</h4>
                  <p className="small text-muted mb-0">Extreme primary crushing of iron ore, heavy granite, and abrasive quartz minerals.</p>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="card border-0 shadow-sm h-100 p-4 bg-light">
                  <div className="text-primary fs-1 mb-3"><i className="fas fa-road"></i></div>
                  <h4 className="fw-bold text-dark mb-2">Roads &amp; Infrastructure</h4>
                  <p className="small text-muted mb-0">High-capacity sub-base aggregates matching NHAI strict size specifications.</p>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="card border-0 shadow-sm h-100 p-4 bg-light">
                  <div className="text-primary fs-1 mb-3"><i className="fas fa-recycle"></i></div>
                  <h4 className="fw-bold text-dark mb-2">C&amp;D Waste Recycling</h4>
                  <p className="small text-muted mb-0">Eco-friendly sorting and crushing loops converting construction debris into usable aggregate.</p>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="card border-0 shadow-sm h-100 p-4 bg-light">
                  <div className="text-primary fs-1 mb-3"><i className="fas fa-water"></i></div>
                  <h4 className="fw-bold text-dark mb-2">Sand Sizing &amp; Washing</h4>
                  <p className="small text-muted mb-0">Rotary drum sand dryers, storage silos, and fine sand hydro-cyclone recovery circuits.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section with B2B Badges */}
        <section className="py-5 bg-light" aria-label="Featured products">
          <div className="container">
            <div className="section-header text-center mb-5">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 text-uppercase">Flagship Machinery</span>
              <h2 className="display-5 fw-bold text-dark" style={{ fontFamily: 'var(--ff-display)' }}>Featured Crushing Solutions</h2>
            </div>

            <div className="row g-4">
              {/* Product 1: Heavy Duty Jaw Crusher */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="card h-100 shadow-sm border-0 product-card" style={{ borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                  <div className="card-img-top-wrapper" style={{ height: '220px', overflow: 'hidden', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <img src="/images/Products/srew-jaw-crusher.png" className="img-fluid" alt="Heavy Duty Jaw Crusher" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <h4 className="card-title fw-bold text-dark mb-2" style={{ fontSize: '1.2rem' }}>Heavy-Duty Jaw Crusher</h4>
                    <p className="small text-muted flex-grow-1" style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                      Engineered for primary reduction of hard stone, iron ore, and heavy minerals. High manganese cast plates guarantee durability.
                    </p>
                    
                    <div className="product-spec-badge-grid">
                      <div className="product-spec-badge">
                        <i className="fas fa-tachometer-alt"></i>
                        <div>
                          <span className="product-spec-label">Capacity</span>
                          <strong>50 - 600 TPH</strong>
                        </div>
                      </div>
                      <div className="product-spec-badge">
                        <i class="fas fa-layer-group"></i>
                        <div>
                          <span className="product-spec-label">Material</span>
                          <strong>Granite, Ore</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-2">
                      <Link to="/products/jaw-crushers" className="btn btn-outline-primary btn-sm w-100 rounded-pill fw-bold py-2">
                        Technical Specifications <i className="fas fa-cogs ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product 2: Turnkey Cone Crusher */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="card h-100 shadow-sm border-0 product-card" style={{ borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                  <div className="card-img-top-wrapper" style={{ height: '220px', overflow: 'hidden', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <img src="/images/Products/srew-cone-crusher-plant.png" className="img-fluid" alt="Turnkey Cone Crusher" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <h4 className="card-title fw-bold text-dark mb-2" style={{ fontSize: '1.2rem' }}>Turnkey Cone Crusher</h4>
                    <p className="small text-muted flex-grow-1" style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                      Intelligent hydraulic control systems with automated overload protection. Delivers premium cubical aggregate sizes.
                    </p>
                    
                    <div className="product-spec-badge-grid">
                      <div className="product-spec-badge">
                        <i className="fas fa-tachometer-alt"></i>
                        <div>
                          <span className="product-spec-label">Capacity</span>
                          <strong>20 - 250 TPH</strong>
                        </div>
                      </div>
                      <div className="product-spec-badge">
                        <i class="fas fa-layer-group"></i>
                        <div>
                          <span className="product-spec-label">Stage</span>
                          <strong>Secondary, 3rd</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-2">
                      <Link to="/products/cone-crushers" className="btn btn-outline-primary btn-sm w-100 rounded-pill fw-bold py-2">
                        Technical Specifications <i className="fas fa-cogs ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product 3: VSI M-Sand Machine */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="card h-100 shadow-sm border-0 product-card" style={{ borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                  <div className="card-img-top-wrapper" style={{ height: '220px', overflow: 'hidden', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <img src="/images/Products/srew-vertical-shaft-crusher.png" className="img-fluid" alt="VSI M-Sand Machine" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <h4 className="card-title fw-bold text-dark mb-2" style={{ fontSize: '1.2rem' }}>VSI M-Sand Machine</h4>
                    <p className="small text-muted flex-grow-1" style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                      Proprietary rock-on-rock crushing cavity delivers top-grade manufactured sand (M-Sand) with superior particle shape.
                    </p>
                    
                    <div className="product-spec-badge-grid">
                      <div className="product-spec-badge">
                        <i className="fas fa-tachometer-alt"></i>
                        <div>
                          <span className="product-spec-label">Capacity</span>
                          <strong>30 - 400 TPH</strong>
                        </div>
                      </div>
                      <div className="product-spec-badge">
                        <i class="fas fa-layer-group"></i>
                        <div>
                          <span className="product-spec-label">Output</span>
                          <strong>Plaster, Concrete</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-2">
                      <Link to="/products/vsi-hsi-crushers" className="btn btn-outline-primary btn-sm w-100 rounded-pill fw-bold py-2">
                        Technical Specifications <i className="fas fa-cogs ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product 4: Crawler Mobile Crusher */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="card h-100 shadow-sm border-0 product-card" style={{ borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                  <div className="card-img-top-wrapper" style={{ height: '220px', overflow: 'hidden', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <img src="/images/Products/srew-mobile-crushing-plant.png" className="img-fluid" alt="Crawler Mobile Crusher" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <h4 className="card-title fw-bold text-dark mb-2" style={{ fontSize: '1.2rem' }}>Crawler Mobile Crusher</h4>
                    <p className="small text-muted flex-grow-1" style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                      Fully autonomous mobile crushing station equipped with tracks. PLC automated control provides maximum mobility.
                    </p>
                    
                    <div className="product-spec-badge-grid">
                      <div className="product-spec-badge">
                        <i className="fas fa-tachometer-alt"></i>
                        <div>
                          <span className="product-spec-label">Capacity</span>
                          <strong>50 - 350 TPH</strong>
                        </div>
                      </div>
                      <div className="product-spec-badge">
                        <i class="fas fa-layer-group"></i>
                        <div>
                          <span className="product-spec-label">Mobility</span>
                          <strong>Track-mounted</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-2">
                      <Link to="/products/recycling-units" className="btn btn-outline-primary btn-sm w-100 rounded-pill fw-bold py-2">
                        Technical Specifications <i className="fas fa-cogs ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <Link to="/products" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow">
                View Full Products Catalog <i className="fas fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose SREW Trust Factors */}
        <section className="py-5 bg-white" aria-label="Why choose SREW Projects">
          <div className="container">
            <div className="section-header text-center mb-5">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 text-uppercase">Trust Pillars</span>
              <h2 className="display-5 fw-bold text-dark">Why Infrastructure Leaders Trust SREW</h2>
            </div>
            
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card p-4 border h-100 text-center">
                  <div className="text-warning fs-1 mb-2"><i className="fas fa-certificate"></i></div>
                  <h4 className="fw-bold text-dark mb-2">ISO 9001:2015 QA</h4>
                  <p className="small text-muted mb-0">Strict quality assurance pipelines, metallurgy certifications, and factory load testing.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-4 border h-100 text-center">
                  <div className="text-warning fs-1 mb-2"><i className="fas fa-shield-alt"></i></div>
                  <h4 className="fw-bold text-dark mb-2">Premium Wear Alloys</h4>
                  <p className="small text-muted mb-0">Manganese casting with proprietary chromium addition reduces raw material wear.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-4 border h-100 text-center">
                  <div className="text-warning fs-1 mb-2"><i className="fas fa-handshake"></i></div>
                  <h4 className="fw-bold text-dark mb-2">Lifecycle Turnkey Partner</h4>
                  <p className="small text-muted mb-0">Dedicated support, fast spare dispatches, and regular engineering optimization checks.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq-section" className="py-5 bg-light" aria-label="Frequently asked questions">
          <div className="container">
            <div className="section-header text-center mb-5">
              <h2>Frequently Asked Questions</h2>
              <p>Common inquiries about SREW Projects turnkey crusher setups.</p>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="accordion shadow-sm" id="faqAccordion">
                  <div className="accordion-item border-0 mb-2">
                    <h3 className="accordion-header">
                      <button className="accordion-button fw-bold text-dark collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
                        What capacity crushing plants does SREW manufacture?
                      </button>
                    </h3>
                    <div id="collapse1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body text-muted small">
                        SREW offers turnkey crushing and screening plants ranging from 20–250 TPH capacity. We design plants customized to mining, aggregates, and recycling sectors.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item border-0 mb-2">
                    <h3 className="accordion-header">
                      <button className="accordion-button fw-bold text-dark collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                        Do you provide complete turnkey plant commissioning?
                      </button>
                    </h3>
                    <div id="collapse2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body text-muted small">
                        Yes, SREW provides end-to-end Engineering, Procurement, and Construction (EPC) turnkey support, including site blueprints, manufacturing, installation, and final plant boot sequence testing.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* B2B interactive quote form section */}
        <section id="quote-section" className="py-5 bg-white border-top" aria-label="Request quote form">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-5 mb-5 mb-lg-0">
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 text-uppercase">Direct Factory Quote</span>
                <h2 className="fw-bold text-primary-ultra display-6 mb-3">Accelerate Your Quarry Yield</h2>
                <p className="text-secondary small mb-4" style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>
                  Our team of precision engineers will design custom crusher loops matching your core rock density, capacity targets, and target budget sizes.
                </p>
                <div className="d-flex align-items-center gap-3">
                  <i className="fas fa-phone text-warning fs-3"></i>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Technical RFQ Hotline</h6>
                    <strong>+91 8790759460</strong>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="quote-form-card">
                  <h3 className="quote-form-title">Request B2B Quote &amp; Schematics</h3>
                  <p className="quote-form-desc">Get customized plant blueprints, detailed technical configurations, and factory pricing instantly.</p>

                  {formStatus.error && <div className="alert alert-danger py-2">{formStatus.msg}</div>}
                  {formStatus.success && <div className="alert alert-success py-2">✓ {formStatus.msg}</div>}

                  <form onSubmit={handleFormSubmit}>
                    <div className="row">
                      <div className="col-md-6 form-group-premium">
                        <label className="form-label-premium">Full Name *</label>
                        <input type="text" className="form-control-premium" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter full name" />
                      </div>
                      <div className="col-md-6 form-group-premium">
                        <label className="form-label-premium">Corporate Email *</label>
                        <input type="email" className="form-control-premium" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Enter business email" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 form-group-premium">
                        <label className="form-label-premium">Phone Number *</label>
                        <input type="tel" className="form-control-premium" name="phone" value={formData.phone} onChange={handleInputChange} required maxLength="10" placeholder="10-digit mobile" />
                      </div>
                      <div className="col-md-6 form-group-premium">
                        <label className="form-label-premium">Project Location *</label>
                        <input type="text" className="form-control-premium" name="location" value={formData.location} onChange={handleInputChange} required placeholder="e.g. Hyderabad, Telangana" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 form-group-premium">
                        <label className="form-label-premium">Plant Capacity *</label>
                        <select className="form-control-premium" name="capacity" value={formData.capacity} onChange={handleInputChange} required>
                          <option value="">Select capacity range</option>
                          <option value="20-50 TPH">20 - 50 TPH</option>
                          <option value="50-100 TPH">50 - 100 TPH</option>
                          <option value="100-150 TPH">100 - 150 TPH</option>
                          <option value="150-250 TPH">150 - 250 TPH</option>
                          <option value="Other / custom">Other / custom</option>
                        </select>
                      </div>
                      <div className="col-md-6 form-group-premium">
                        <label className="form-label-premium">Material To Crush *</label>
                        <select className="form-control-premium" name="material" value={formData.material} onChange={handleInputChange} required>
                          <option value="">Select material type</option>
                          <option value="Granite">Granite</option>
                          <option value="Limestone">Limestone</option>
                          <option value="Basalt">Basalt</option>
                          <option value="Iron Ore">Iron Ore</option>
                          <option value="M-Sand">Manufactured Sand</option>
                          <option value="Other">Other minerals</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group-premium">
                      <label className="form-label-premium">Detailed Requirements</label>
                      <textarea className="form-control-premium" name="message" value={formData.message} onChange={handleInputChange} rows="2" placeholder="Describe output sizes or equipment needed..."></textarea>
                    </div>

                    <button type="submit" disabled={formStatus.submitting} className="btn btn-warning w-100 rounded-pill py-3 fw-bold text-dark border-0 mt-3 shadow-sm">
                      {formStatus.submitting ? 'Processing Submission...' : 'Request Project Proposal & Pricing'} <i className="fas fa-paper-plane ms-1"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GOOGLE BUSINESS PROFILE REVIEWS SECTION */}
        <section className="reviews-section py-5 bg-white border-top" aria-label="Google reviews" id="google-reviews">
          <div className="container py-lg-4">
            {/* Section Header */}
            <div className="row align-items-center mb-5">
              <div className="col-md-8 text-start">
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3 text-uppercase">Client Trust &amp; Reviews</span>
                <h2 className="fw-bold mb-2 text-primary" style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>Google Business Profile Ratings</h2>
                <p className="text-secondary mb-0" style={{ maxWidth: '700px', fontSize: '1rem' }}>Direct feedback from infrastructure developers and quarry owners operating our turnkey plants across India.</p>
              </div>
              <div className="col-md-4 text-md-end text-start mt-3 mt-md-0">
                {/* Google Rating Aggregator Card */}
                <div className="d-inline-flex align-items-center gap-3 bg-light p-3 rounded-3 border">
                  <div className="bg-white rounded p-2 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '52px', height: '52px' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.77-.63-1.39-1.39-2.03-2.03z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                  <div className="text-start">
                    <div className="d-flex align-items-center gap-1">
                      <strong className="fs-4 text-dark mb-0 leading-none">4.8</strong>
                      <div className="text-warning">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                    </div>
                    <span className="small text-muted d-block" style={{ fontSize: '0.8rem' }}>Google Reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Card Grid */}
            <div className="row g-4 stagger-container">
              {/* Review 1 */}
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 p-4 border shadow-sm" style={{ borderRadius: '12px', background: '#ffffff', transition: 'all 0.3s ease' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '44px', height: '44px', fontSize: '1.1rem', background: 'var(--grad-primary) !important' }}>K</div>
                      <div className="text-start">
                        <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.95rem' }}>K. Rama Rao</h5>
                        <span className="small text-muted d-block" style={{ fontSize: '0.75rem' }}>Quarry Proprietor, Keesara</span>
                      </div>
                    </div>
                    <span className="badge bg-success-light text-success rounded-pill px-2 py-1 d-flex align-items-center gap-1" style={{ fontSize: '0.65rem', background: 'rgba(37,211,102,0.1)', color: '#1e7e34 !important' }}><i className="fas fa-check-circle"></i> Verified</span>
                  </div>
                  <div className="text-warning mb-2 text-start">
                    <i className="fas fa-star"></i><i class="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                  </div>
                  <p className="text-muted small text-start flex-grow-1 mb-0" style={{ lineSpace: '1.6', fontSize: '0.88rem' }}>"SREW Projects provided a complete turnkey 200 TPH cone crushing plant for our quarry in Keesara. Outstanding build quality, high manganese wear parts, and excellent technical service team."</p>
                  <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
                    <span>Google Review</span>
                    <span>3 months ago</span>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 p-4 border shadow-sm" style={{ borderRadius: '12px', background: '#ffffff', transition: 'all 0.3s ease' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '44px', height: '44px', fontSize: '1.1rem', background: 'var(--grad-primary) !important' }}>P</div>
                      <div className="text-start">
                        <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.95rem' }}>Pratap Reddy</h5>
                        <span className="small text-muted d-block" style={{ fontSize: '0.75rem' }}>Balaji Aggregates, Hyderabad</span>
                      </div>
                    </div>
                    <span className="badge bg-success-light text-success rounded-pill px-2 py-1 d-flex align-items-center gap-1" style={{ fontSize: '0.65rem', background: 'rgba(37,211,102,0.1)', color: '#1e7e34 !important' }}><i className="fas fa-check-circle"></i> Verified</span>
                  </div>
                  <div className="text-warning mb-2 text-start">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                  </div>
                  <p className="text-muted small text-start flex-grow-1 mb-0" style={{ lineSpace: '1.6', fontSize: '0.88rem' }}>"Purchased their heavy duty Jaw Crusher and fine sand washing machine. Very happy with output. SREW team was prompt during installation. Best industrial machinery manufacturer in Hyderabad."</p>
                  <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
                    <span>Google Review</span>
                    <span>2 months ago</span>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="col-lg-4 col-md-6">
                <div className="card h-100 p-4 border shadow-sm" style={{ borderRadius: '12px', background: '#ffffff', transition: 'all 0.3s ease' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '44px', height: '44px', fontSize: '1.1rem', background: 'var(--grad-primary) !important' }}>S</div>
                      <div className="text-start">
                        <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.95rem' }}>Sanjay Nair</h5>
                        <span className="small text-muted d-block" style={{ fontSize: '0.75rem' }}>Nair Quarry Ops, Kerala</span>
                      </div>
                    </div>
                    <span className="badge bg-success-light text-success rounded-pill px-2 py-1 d-flex align-items-center gap-1" style={{ fontSize: '0.65rem', background: 'rgba(37,211,102,0.1)', color: '#1e7e34 !important' }}><i className="fas fa-check-circle"></i> Verified</span>
                  </div>
                  <div className="text-warning mb-2 text-start">
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                  </div>
                  <p className="text-muted small text-start flex-grow-1 mb-0" style={{ lineSpace: '1.6', fontSize: '0.88rem' }}>"SREW's PLC automated crawler mobile crushing plant has significantly improved our aggregates output. Their manganese casting jaws last longer, saving us replacement time and operational costs."</p>
                  <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
                    <span>Google Review</span>
                    <span>4 months ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer link to maps */}
            <div className="text-center mt-5">
              <a href="https://share.google/hDqCzUIV3UuE8WGLg" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary rounded-pill px-4 py-2 small fw-bold">
                <i className="fab fa-google me-2"></i> View All Google Reviews
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="sticky-mobile-cta">
        <a href="tel:8790759460" className="sticky-cta-btn call">
          <i className="fas fa-phone-alt"></i> Call
        </a>
        <a href="https://wa.me/918790759460" target="_blank" rel="noopener noreferrer" className="sticky-cta-btn whatsapp">
          <i className="fab fa-whatsapp"></i> WhatsApp
        </a>
        <a href="#quote-section" onClick={handleQuoteScroll} className="sticky-cta-btn quote">
          <i className="fas fa-file-invoice-dollar"></i> Get Quote
        </a>
      </div>
    </>
  );
};

export default Home;
