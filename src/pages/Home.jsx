import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';

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
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      img: "/images/Products/jaw-crusher.jpg",
      title: "Heavy-Duty Jaw Crushers",
      desc: "ISO 9001:2015 certified primary stone crushers ranging from 30 TPH to 800 TPH capacities."
    },
    {
      img: "/images/Products/cone-crusher.jpg",
      title: "Precision Hydraulic Cone Crushers",
      desc: "High-yield secondary & tertiary crushers engineered for precise aggregate shape and grading."
    },
    {
      img: "/images/Products/VSI-crusher.jpg",
      title: "Manufacturing Premium M-Sand",
      desc: "High-RPM VSI impact crushers delivering excellent concrete & plaster sand yields."
    }
  ];

  // Auto-advance Carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <>
      <Helmet>
        <title>S R ENGG WORKS - Crushing, Screening &amp; Washing Plant Solutions | India</title>
        <meta name="description" content="ISO 9001:2015 Certified Manufacturer of Crushing, Screening &amp; Sand Processing Plants | 30–800 TPH | Hyderabad, India | 30+ Years Experience" />
        <meta name="keywords" content="crushing plant, screening plant, jaw crusher, cone crusher, VSI crusher, sand dryer, vibrating screen, material handling, quarry crushing plant, M-Sand plant, M-Sand manufacturer, stone crusher manufacturer, aggregate plant, NHAI crusher, C&amp;D recycling plant, EPC equipment partner, turnkey crushing plant, Hyderabad, India, SREW" />
        <link rel="canonical" href="https://srewprojects.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://srewprojects.com/" />
        <meta property="og:title" content="S R ENGG WORKS - Crushing, Screening &amp; Washing Plant Solutions" />
        <meta property="og:description" content="ISO 9001:2015 Certified Manufacturer of Crushing, Screening &amp; Sand Processing Plants | 30–800 TPH | Hyderabad, India | 30+ Years Experience" />
        <meta property="og:image" content="https://srewprojects.com/images/hero-background.jpg" />
        <meta property="og:site_name" content="S R ENGG WORKS" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="S R ENGG WORKS - Crushing &amp; Screening Plant Solutions" />
        <meta name="twitter:description" content="Turnkey crushing &amp; screening plants for quarry operators, M-Sand producers, mining &amp; infrastructure. 30+ years experience. Hyderabad." />
        <meta name="twitter:image" content="https://srewprojects.com/images/hero-background.jpg" />
        <meta name="geo.region" content="IN-TG" />
        <meta name="geo.placename" content="Hyderabad, Telangana, India" />
        <meta name="geo.position" content="17.5158653;78.4377875" />
        <meta name="ICBM" content="17.5158653, 78.4377875" />
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "S R ENGG WORKS",
            "alternateName": "SREW",
            "url": "https://srewprojects.com",
            "logo": "https://srewprojects.com/images/logo.png",
            "description": "S R ENGG WORKS (SREW) is an Indian precision engineering and industrial fabrication company specializing in the design, manufacture, installation, and servicing of crushing plants, screening plants, sand processing plants, and material handling systems. Founded in 2018 with over 30 years of combined industry experience, SREW has delivered 120+ turnkey projects across mining, construction, infrastructure, and C&D waste recycling sectors from its manufacturing facility in Hyderabad, Telangana.",
            "foundingDate": "2018",
            "areaServed": "IN",
            "numberOfEmployees": {"@type": "QuantitativeValue", "minValue": 50},
            "knowsAbout": ["Crushing Plants", "Screening Plants", "Jaw Crushers", "Cone Crushers", "VSI Crushers", "HSI Crushers", "Vibrating Screens", "Sand Dryers", "Grizzly Feeders", "Silos", "Material Handling Systems", "C&D Waste Recycling Plants", "PLC Control Panels", "M-Sand Manufacturing", "Aggregate Production"],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SREW Equipment Catalog",
              "itemListElement": [
                {"@type": "OfferCatalog", "name": "Crushing Equipment", "description": "Jaw Crushers, Cone Crushers, VSI/HSI Crushers, Roller Crushers from 30 to 800 TPH"},
                {"@type": "OfferCatalog", "name": "Screening Equipment", "description": "Vibrating Screens, Grizzly Feeders up to 600 TPH"},
                {"@type": "OfferCatalog", "name": "Sand Processing", "description": "Sand Dryers, Silos, Sand Washing Plants"},
                {"@type": "OfferCatalog", "name": "Material Handling", "description": "Belt Conveyors, Hoppers, Control Panels"}
              ]
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "11-125, IDA Jeedimetla, Dulapally",
              "addressLocality": "Hyderabad",
              "addressRegion": "Telangana",
              "postalCode": "500100",
              "addressCountry": "IN"
            },
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+91-8790759460",
                "contactType": "sales",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi", "Telugu"]
              }
            ],
            "sameAs": [
              "https://www.facebook.com/profile.php?id=100070029793724",
              "https://www.linkedin.com/company/thesrew",
              "https://www.youtube.com/channel/UCXv5mgy6tQZUApyfT3Komtw",
              "https://www.instagram.com/srenggworks/",
              "https://www.google.com/maps?cid=16523674681657852383"
            ]
          }
        `}
        </script>
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "S R ENGG WORKS",
            "url": "https://srewprojects.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://srewprojects.com/products?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        `}
        </script>
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://srewprojects.com/"}]
          }
        `}
        </script>
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {"@type": "Question", "name": "What does S R ENGG WORKS (SREW) manufacture?", "acceptedAnswer": {"@type": "Answer", "text": "S R ENGG WORKS (SREW) manufactures crushing plants, screening plants, sand processing plants, and material handling systems. Our product range includes Jaw Crushers, Cone Crushers, VSI/HSI Crushers, Roller Crushers, Vibrating Screens, Grizzly Feeders, Sand Dryers, Silos, Conveyors, Hoppers, PLC Control Panels, and C&D Waste Recycling Units."}},
              {"@type": "Question", "name": "What capacity crushing plants does SREW offer?", "acceptedAnswer": {"@type": "Answer", "text": "SREW offers turnkey crushing and screening plants ranging from 30 TPH to 800 TPH capacity. We design and manufacture plants customized to specific project requirements for mining, construction, and recycling applications."}},
              {"@type": "Question", "name": "Where is S R ENGG WORKS located?", "acceptedAnswer": {"@type": "Answer", "text": "S R ENGG WORKS is headquartered at 11-125, IDA Jeedimetla, Dulapally, Hyderabad, Telangana 500100, India. Our manufacturing facility includes CNC machining centers, fabrication bays, hydraulic press shops, and PLC panel manufacturing units."}},
              {"@type": "Question", "name": "What industries does SREW serve?", "acceptedAnswer": {"@type": "Answer", "text": "SREW serves four major industries: Mining (primary and secondary crushing), Construction & Infrastructure (aggregate and M-Sand production), C&D Waste Recycling (construction and demolition debris processing), and Sand Processing & Manufacturing (sand drying, washing, and storage)."}},
              {"@type": "Question", "name": "Does SREW provide turnkey plant solutions?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, SREW provides complete turnkey solutions including plant design, equipment manufacturing, installation, commissioning, and after-sales servicing. We have delivered over 120 turnkey projects across India for 45+ clients."}},
              {"@type": "Question", "name": "How experienced is the SREW team?", "acceptedAnswer": {"@type": "Answer", "text": "Founded in 2018, S R ENGG WORKS brings over 30 years of combined industry experience in precision engineering and industrial fabrication. Our team has delivered 120+ projects for 45+ clients across mining, construction, and recycling sectors."}}
            ]
          }
        `}
        </script>
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": [".hero-carousel", ".performance-ledger", "#faq-section"]
            },
            "name": "S R ENGG WORKS - Crushing, Screening & Washing Plant Solutions",
            "dateModified": "2026-05-21"
          }
        `}
        </script>
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "S R ENGG WORKS",
            "alternateName": "SREW",
            "@id": "https://srewprojects.com/#localbusiness",
            "url": "https://srewprojects.com",
            "telephone": "+91-8790759460",
            "email": "srenggworks2016@gmail.com",
            "image": "https://srewprojects.com/images/logo.png",
            "logo": "https://srewprojects.com/images/logo.png",
            "priceRange": "₹₹₹",
            "description": "ISO 9001:2015 Certified Manufacturer of Crushing, Screening & Sand Processing Plants. 30–800 TPH capacity. 30+ years experience. Hyderabad, India.",
            "hasMap": "https://www.google.com/maps?cid=16523674681657852383",
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 17.5158653,
              "longitude": 78.4377875
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "11-125, IDA Jeedimetla, Dulapally",
              "addressLocality": "Hyderabad",
              "addressRegion": "Telangana",
              "postalCode": "500100",
              "addressCountry": "IN"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                "opens": "09:00",
                "closes": "18:00"
              }
            ],
            "areaServed": [
              {"@type": "State", "name": "Telangana"},
              {"@type": "State", "name": "Andhra Pradesh"},
              {"@type": "State", "name": "Maharashtra"},
              {"@type": "State", "name": "Karnataka"},
              {"@type": "State", "name": "Tamil Nadu"},
              {"@type": "State", "name": "Odisha"},
              {"@type": "State", "name": "West Bengal"},
              {"@type": "Country", "name": "India"}
            ],
            "sameAs": [
              "https://www.facebook.com/profile.php?id=100070029793724",
              "https://www.linkedin.com/company/thesrew",
              "https://www.youtube.com/channel/UCXv5mgy6tQZUApyfT3Komtw",
              "https://www.instagram.com/srenggworks/",
              "https://www.indiamart.com/srengineeringworks-266746886/",
              "https://www.google.com/maps?cid=16523674681657852383"
            ]
          }
        `}
        </script>
      </Helmet>

      <main id="main-content" role="main">
        {/* Cinematic Hero Carousel */}
        <section className="hero-carousel" aria-label="Machinery showcase carousel">
          {slides.map((slide, idx) => (
            <div 
              key={idx} 
              className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}
            >
              <img 
                src={slide.img} 
                alt={slide.title} 
                className="slide-img"
                onError={(e) => { e.target.src = '/images/logo.png'; e.target.style.objectFit = 'contain'; e.target.style.padding = '100px'; }}
              />
              <div className="slide-overlay"></div>
              <div className="slide-content container">
                <ScrollReveal>
                  <h2>{slide.title}</h2>
                  <p>{slide.desc}</p>
                  <div className="btn-container d-flex flex-wrap gap-3">
                    <Link to="/products" className="btn btn-primary btn-curved btn-lg"><i className="fas fa-box me-2"></i> Browse Machinery</Link>
                    <Link to="/contact" className="btn btn-warning btn-curved btn-lg text-dark fw-bold"><i className="fas fa-file-invoice-dollar me-2"></i> Request RFQ Quote</Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          ))}
          
          {/* Indicators */}
          <div className="carousel-indicators">
            {slides.map((_, idx) => (
              <button 
                key={idx}
                className={`indicator-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </section>

        {/* 8-Factor Performance Ledger Section */}
        <section className="py-5" aria-label="Performance ledger statistics">
          <div className="container py-3">
            <ScrollReveal>
              <div className="performance-ledger text-white">
                <div className="text-center mb-5">
                  <span className="text-warning small fw-bold text-uppercase tracking-wider">Industrial Excellence Credentials</span>
                  <h2 className="text-white fw-bold mt-2">The SREW 8-Factor Performance Ledger</h2>
                  <p className="small text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
                    Quantifiable track record of turnkey reliability, engineered toughness, and resource conservation in B2B material processing.
                  </p>
                </div>

                <div className="row g-4 justify-content-center">
                  
                  {/* Factor 1: Turnkey Projects */}
                  <div className="col-lg-3 col-md-6">
                    <div className="metric-card">
                      <div className="metric-number">
                        <AnimatedCounter endValue={120} suffix="+" />
                      </div>
                      <div className="metric-label">Turnkey Plants</div>
                    </div>
                  </div>

                  {/* Factor 2: B2B Clients */}
                  <div className="col-lg-3 col-md-6">
                    <div className="metric-card">
                      <div className="metric-number">
                        <AnimatedCounter endValue={45} suffix="+" />
                      </div>
                      <div className="metric-label">Active Clients</div>
                    </div>
                  </div>

                  {/* Factor 3: TPH Capacity */}
                  <div className="col-lg-3 col-md-6">
                    <div className="metric-card">
                      <div className="metric-number">
                        <AnimatedCounter endValue={800} suffix=" TPH" />
                      </div>
                      <div className="metric-label">Max Plant Capacity</div>
                    </div>
                  </div>

                  {/* Factor 4: Experience */}
                  <div className="col-lg-3 col-md-6">
                    <div className="metric-card">
                      <div className="metric-number">
                        <AnimatedCounter endValue={30} suffix="+" />
                      </div>
                      <div className="metric-label">Years Core Expertise</div>
                    </div>
                  </div>

                  {/* Factor 5: Certified Quality */}
                  <div className="col-lg-3 col-md-6">
                    <div className="metric-card">
                      <div className="metric-number" style={{ fontSize: '2.5rem' }}>ISO 9001</div>
                      <div className="metric-label">Certified QA Standards</div>
                    </div>
                  </div>

                  {/* Factor 6: Monsoon Uptime */}
                  <div className="col-lg-3 col-md-6">
                    <div className="metric-card">
                      <div className="metric-number">
                        <AnimatedCounter endValue={94} suffix="%" />
                      </div>
                      <div className="metric-label">Monsoon Plant Uptime</div>
                    </div>
                  </div>

                  {/* Factor 7: Water Clarification */}
                  <div className="col-lg-3 col-md-6">
                    <div className="metric-card">
                      <div className="metric-number">
                        <AnimatedCounter endValue={90} suffix="%" />
                      </div>
                      <div className="metric-label">Clarified Water Recycled</div>
                    </div>
                  </div>

                  {/* Factor 8: C&D Concrete Salvage */}
                  <div className="col-lg-3 col-md-6">
                    <div className="metric-card">
                      <div className="metric-number">
                        <AnimatedCounter endValue={92} suffix="%" />
                      </div>
                      <div className="metric-label">Concrete Rubble Recycled</div>
                    </div>
                  </div>

                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Corporate Trust Badge Sections */}
        <section className="py-5 bg-light" aria-label="Corporate profile trust indicators">
          <div className="container py-3">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <ScrollReveal>
                  <span className="text-primary small fw-bold text-uppercase"><i className="fas fa-crown me-1"></i> Engineering Distinction</span>
                  <h2 className="text-primary-ultra mt-2 mb-4">ISO 9001:2015 Certified Quarry Systems</h2>
                  <p className="lead text-muted mb-4">
                    S R ENGG WORKS develops heavy-duty jaw, cone, VSI impactors, and high-frequency sizing screens that form the backbone of top infrastructure sites in India.
                  </p>
                  <p className="text-body mb-4">
                    With an integrated, IP55-automated electric PLC panel coordination mechanism, SREW plants optimize sequential machinery boot sequences, matching feed rates to avoid crusher chamber blockages.
                  </p>
                  <div className="d-flex gap-3">
                    <Link to="/about" className="btn btn-outline-primary btn-curved">Our Infrastructure</Link>
                    <Link to="/certifications" className="btn btn-primary btn-curved">Quality Hub</Link>
                  </div>
                </ScrollReveal>
              </div>
              
              <div className="col-lg-6">
                <ScrollReveal delay={200}>
                  <div className="row g-4">
                    <div className="col-6">
                      <div className="card border-0 p-4 shadow-sm text-center bg-white h-100">
                        <div className="text-primary fs-2 mb-2"><i className="fas fa-industry"></i></div>
                        <h3 className="h6 fw-bold mb-1">State-of-the-Art Plant</h3>
                        <p className="small text-muted mb-0">Jeedimetla, Hyderabad facility housing CNC machining centers.</p>
                      </div>
                    </div>
                    
                    <div className="col-6">
                      <div className="card border-0 p-4 shadow-sm text-center bg-white h-100">
                        <div className="text-primary fs-2 mb-2"><i className="fas fa-cogs"></i></div>
                        <h3 className="h6 fw-bold mb-1">Custom Engineering</h3>
                        <p className="small text-muted mb-0">Tailor-made aggregates layouts matching raw rock mineral profiles.</p>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="card border-0 p-4 shadow-sm text-center bg-white h-100">
                        <div className="text-primary fs-2 mb-2"><i className="fas fa-truck-loading"></i></div>
                        <h3 className="h6 fw-bold mb-1">Genuine Spares</h3>
                        <p className="small text-muted mb-0">Fully-stocked wear alloy inventory for rapid dispatches.</p>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="card border-0 p-4 shadow-sm text-center bg-white h-100">
                        <div className="text-primary fs-2 mb-2"><i className="fas fa-headset"></i></div>
                        <h3 className="h6 fw-bold mb-1">Field Support</h3>
                        <p className="small text-muted mb-0">On-call technical specialists executing onsite optimizations.</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Home dynamic Selector tool prompt card */}
        <section className="py-5" aria-label="Interactive planning tool prompt">
          <div className="container py-3">
            <ScrollReveal>
              <div className="card border-0 bg-dark text-white p-5 rounded-lg shadow-lg text-center" style={{ background: 'var(--grad-dark)' }}>
                <span className="text-warning small fw-bold text-uppercase mb-2">Interactive Planning Systems</span>
                <h2 className="text-white fw-bold mb-3">Optimize your quarry setup instantly</h2>
                <p className="small text-white-50 mx-auto mb-4" style={{ maxWidth: '600px' }}>
                  Use SREW's integrated primary crusher calculator to determine recommended jaw crusher models, electrical horsepowers, and Closed Side Setting layouts.
                </p>
                <div>
                  <Link to="/products" className="btn btn-warning btn-curved text-dark fw-bold px-4 py-2">
                    Open Crusher Selector Tool
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
