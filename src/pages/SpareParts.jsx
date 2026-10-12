import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';
import { spareParts, sparePartsCategories } from '../data/spareParts';

export const SpareParts = () => {
  const [activeCategory, setActiveCategory] = useState('crusher');

  const filteredParts = spareParts.filter(part => part.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Spare Parts - Crusher, Screen, Feeder &amp; Conveyor Spares | SREW Projects</title>
        <meta name="description" content="ISO 9001:2015 Certified Manufacturer of Crushing, Screening &amp; Sand Processing Plants | 20–250 TPH | Hyderabad, India | 10+ Years Experience" />
        <meta name="keywords" content="jaw plates, cone mantles, VSI blow bars, conveyor rollers, screen mesh, crusher spares, grizzly bar, mineral processing, Hyderabad, India, SREW" />
        <link rel="canonical" href="https://www.srewprojects.com/spare-parts" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.srewprojects.com/spare-parts" />
        <meta property="og:title" content="Spare Parts - Genuine Equipment Spares | SREW" />
        <meta property="og:description" content="ISO 9001:2015 Certified Manufacturer of Crushing, Screening &amp; Sand Processing Plants | 20–250 TPH | Hyderabad, India | 10+ Years Experience" />
        <meta property="og:image" content="https://www.srewprojects.com/images/logo.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Spare Parts - Genuine Equipment Spares" />
        <meta name="twitter:description" content="Certified Manganese Steel Jaw Plates, Cone Mantles, VSI blow bars, and screen meshes. Precision machined SREW Projects genuine spare parts." />
        <meta name="twitter:image" content="https://www.srewprojects.com/images/logo.png" />
        <meta name="geo.region" content="IN-TG" />
        <meta name="geo.placename" content="Hyderabad, Telangana, India" />
        <meta name="geo.position" content="17.5158653;78.4377875" />
        <meta name="ICBM" content="17.5158653, 78.4377875" />
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "SREW Spare Parts",
            "description": "Genuine, high-quality spare parts for crushing, screening, and material handling equipment.",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@type": "Product",
                  "name": "Manganese Steel Jaw Plate",
                  "description": "Heavy-duty corrugated manganese steel jaw plates for primary rock crushing.",
                  "image": "https://www.srewprojects.com/images/spare-parts/jaw-plate.png",
                  "brand": {"@type": "Brand", "name": "SREW"},
                  "category": "Crusher Wear Parts"
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@type": "Product",
                  "name": "High-Chrome VSI Blow Bar",
                  "description": "Thick, rectangular high-chrome VSI crusher blow bar for superior sand shaping and durability.",
                  "image": "https://www.srewprojects.com/images/spare-parts/blue-mild-steel-impact-crusher-blow-bar-1000x1000.webp",
                  "brand": {"@type": "Brand", "name": "SREW"},
                  "category": "Crusher Wear Parts"
                }
              },
              {
                "@type": "ListItem",
                "position": 3,
                "item": {
                  "@type": "Product",
                  "name": "Woven Wire Screen Mesh Panel",
                  "description": "Industrial woven wire screen mesh panel for precise aggregate sorting in vibrating screens.",
                  "image": "https://www.srewprojects.com/images/spare-parts/screen-mesh.png",
                  "brand": {"@type": "Brand", "name": "SREW"},
                  "category": "Screen Components"
                }
              },
              {
                "@type": "ListItem",
                "position": 4,
                "item": {
                  "@type": "Product",
                  "name": "Heavy-Duty Conveyor Roller",
                  "description": "Industrial heavy-duty conveyor idler roller assembly with sealed bearing housings.",
                  "image": "https://www.srewprojects.com/images/spare-parts/conveyor-roller.png",
                  "brand": {"@type": "Brand", "name": "SREW"},
                  "category": "Conveyor Components"
                }
              },
              {
                "@type": "ListItem",
                "position": 5,
                "item": {
                  "@type": "Product",
                  "name": "Manganese Steel Cone Crusher Mantle",
                  "description": "Massive, bell-shaped manganese steel cone crusher mantle wear liner for secondary crushing.",
                  "image": "https://www.srewprojects.com/images/spare-parts/crusher-mantle-500x500.webp",
                  "brand": {"@type": "Brand", "name": "SREW"},
                  "category": "Crusher Wear Parts"
                }
              },
              {
                "@type": "ListItem",
                "position": 6,
                "item": {
                  "@type": "Product",
                  "name": "Stepped Grizzly Feeder Bar",
                  "description": "Thick, stepped steel grizzly feeder bar for heavy-duty primary rock separation.",
                  "image": "https://www.srewprojects.com/images/spare-parts/grizzly-bar.png",
                  "brand": {"@type": "Brand", "name": "SREW"},
                  "category": "Feeder Components"
                }
              }
            ]
          }
        `}
        </script>
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.srewprojects.com/"},
              {"@type": "ListItem", "position": 2, "name": "Spare Parts", "item": "https://www.srewprojects.com/spare-parts"}
            ]
          }
        `}
        </script>
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What spare parts does SREW supply?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SREW Projects supplies spare parts including jaw plates, toggle plates, cheek plates for jaw crushers; mantles, concaves, and bowl liners for cone crushers; blow bars, anvils, and rotor tips for impact crushers; screen meshes and deck panels for vibrating screens; and conveyor belts, rollers, and bearings for material handling systems."
                }
              },
              {
                "@type": "Question",
                "name": "Does SREW provide jaw plates and cone liners?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, SREW manufactures and supplies high-quality jaw plates (fixed and movable) in manganese steel, as well as cone liners including mantles, concaves, and bowl liners for all major crusher brands and models."
                }
              },
              {
                "@type": "Question",
                "name": "Can SREW supply parts for other manufacturers equipment?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, SREW supplies compatible spare parts for all major crusher and screen brands operating in India. We manufacture precision-engineered compatible parts designed to match or exceed original specifications."
                }
              }
            ]
          }
        `}
        </script>
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Spare Parts - Crusher, Screen, Feeder &amp; Conveyor Spares | SREW Projects",
            "description": "ISO 9001:2015 certified manufacturer supplying genuine spare parts for crushing, screening, and sand processing equipment.",
            "url": "https://www.srewprojects.com/spare-parts",
            "dateModified": "2026-05-21",
            "author": {"@type": "Organization", "name": "SREW Projects"},
            "publisher": {
              "@type": "Organization",
              "name": "SREW Projects",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.srewprojects.com/images/logo.png"
              }
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", ".lead", "#faq-section"]
            }
          }
        `}
        </script>
      </Helmet>

      <main id="main-content" role="main">
        {/* Page Header */}
        <section className="page-header py-5 bg-light" aria-label="Page header">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1 className="fw-extrabold text-primary-ultra">Spare Parts Catalog</h1>
                <p className="lead mt-3 mb-0" style={{ maxWidth: '800px', color: '#555' }}>
                  Genuine replacement components engineered to exact metallurgical tolerances for absolute plant uptime.
                </p>
                <nav aria-label="Breadcrumb" className="mt-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Spare Parts</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog intro & interactive tabs */}
        <div className="container py-5">
          <div className="row mb-5">
            <div className="col-lg-10">
              <h2 className="text-primary-ultra h3 mb-3">Certified Wear Components &amp; Machinery Spares</h2>
              <p className="lead text-muted">
                SREW Projects supplies a comprehensive inventory of genuine replacement parts for aggregate crushing, high-frequency screening, and material handling systems. Engineered to resist extreme impact and wear, our parts eliminate unscheduled downtime.
              </p>
            </div>
          </div>

          {/* Liquid Sliding Tabs */}
          <div className="mb-5">
            <div className="liquid-tabs-nav justify-content-center justify-content-md-start">
              {sparePartsCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`liquid-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <i className={`fas fa-${cat.icon} me-2`}></i> {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Grid */}
          <div className="row g-4">
            {filteredParts.map(part => (
              <div className="col-lg-4 col-md-6" key={part.id}>
                <ScrollReveal className="part-card">
                  <div className="overflow-hidden" style={{ height: '220px' }}>
                    <img 
                      src={part.image} 
                      alt={part.name} 
                      className="part-card-img" 
                      onError={(e) => { e.target.src = '/images/logo.png'; e.target.style.objectFit = 'contain'; e.target.style.padding = '20px'; }}
                    />
                  </div>
                  <div className="p-4 d-flex flex-column" style={{ height: 'calc(100% - 220px)' }}>
                    <h3 className="h5 text-primary-ultra mb-1">{part.name}</h3>
                    <div className="text-success small fw-bold mb-3"><i className="fas fa-check-circle me-1"></i> {part.grade}</div>
                    <p className="small text-muted mb-4 flex-grow-1">{part.desc}</p>
                    
                    <ul className="list-unstyled mb-4 small text-muted border-top pt-3">
                      {part.metallurgy && <li className="mb-2"><strong>Metallurgy:</strong> {part.metallurgy}</li>}
                      <li><strong>Compatibility:</strong> {part.compatibility}</li>
                    </ul>

                    <Link to={`/contact?product=${encodeURIComponent(part.name)}`} className="btn btn-outline-primary btn-curved w-100 mt-auto">
                      Request Quote
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>

          {/* Contact Card Widget */}
          <div className="row mt-5">
            <div className="col-lg-6 mx-auto">
              <ScrollReveal className="card border-0 bg-light p-4 text-center rounded shadow-sm">
                <h4 className="h5 text-primary-ultra fw-bold mb-2">Need Custom Castings or Forgings?</h4>
                <p className="small text-muted mb-4">We custom manufacture wear parts according to client drawings for standard and custom aggregate crushing lines.</p>
                <div>
                  <Link to="/contact?inquiry=Custom Wear Parts" className="btn btn-primary btn-curved">
                    Submit Drawings for Quote
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <section className="cta-section py-5 bg-primary text-white" aria-label="Call to action">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8 text-center text-lg-start mb-3 mb-lg-0">
                <h2 className="text-white">Need parts urgently?</h2>
                <p className="mb-0">Our spare parts inventory is fully stocked. Get fast dispatch, reducing on-site downtime.</p>
              </div>
              <div className="col-lg-4 text-center text-lg-end">
                <a href="https://wa.me/918790759460" target="_blank" rel="noopener noreferrer" className="btn btn-light btn-lg btn-curved">
                  <i className="fab fa-whatsapp me-2"></i> WhatsApp for Parts
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default SpareParts;
