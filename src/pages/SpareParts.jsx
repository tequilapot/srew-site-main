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
        <title>Spare Parts - Crusher, Screen, Feeder &amp; Conveyor Spares | SREW</title>
        <meta name="description" content="Certified Manganese Steel Jaw Plates, Cone Mantles, VSI blow bars, and screen meshes. Precision machined S R ENGG WORKS genuine spare parts." />
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
                S R ENGG WORKS supplies a comprehensive inventory of genuine replacement parts for aggregate crushing, high-frequency screening, and material handling systems. Engineered to resist extreme impact and wear, our parts eliminate unscheduled downtime.
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
