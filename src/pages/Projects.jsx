import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';
import { projects } from '../data/projects';

export const Projects = () => {
  return (
    <>
      <Helmet>
        <title>Project Case Studies - Turnkey Crushing &amp; Screening Plants | SREW</title>
        <meta name="description" content="View S R ENGG WORKS successful turnkey installations across India: West Bengal 200 TPH plant, Singareni 400 TPH plant, Keesara 150 TPH plant." />
      </Helmet>

      <main id="main-content" role="main">
        {/* Page Header */}
        <section className="page-header py-5 bg-light" aria-label="Page header">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1 className="fw-extrabold text-primary-ultra">Engineering Case Studies</h1>
                <p className="lead mt-3 mb-0" style={{ maxWidth: '800px', color: '#555' }}>
                  Proven performance: Discover how SREW delivers custom engineering plant setups across mining and construction sectors.
                </p>
                <nav aria-label="Breadcrumb" className="mt-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Projects</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {/* Project Listings */}
        <div className="container py-5">
          <div className="row g-5">
            {projects.map((proj, idx) => (
              <div className="col-12" key={proj.slug}>
                <ScrollReveal>
                  <div className={`row align-items-center g-5 ${idx % 2 === 1 ? 'flex-md-row-reverse' : ''}`}>
                    
                    {/* Image Column */}
                    <div className="col-lg-5">
                      <div className="position-relative overflow-hidden rounded shadow-md" style={{ height: '320px' }}>
                        <img 
                          src={proj.image} 
                          alt={proj.name} 
                          className="w-100 h-100" 
                          style={{ objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/images/logo.png'; e.target.style.objectFit = 'contain'; e.target.style.padding = '40px'; }}
                        />
                        <div className="position-absolute top-0 start-0 m-3 bg-primary text-white py-1 px-3 rounded small fw-bold">
                          Commissioned {proj.year}
                        </div>
                      </div>
                    </div>

                    {/* Text Column */}
                    <div className="col-lg-7">
                      <span className="text-primary fw-bold small text-uppercase"><i className="fas fa-map-marker-alt me-1"></i> {proj.location}</span>
                      <h2 className="text-primary-ultra h3 mt-1 mb-3">{proj.name}</h2>
                      
                      <div className="mb-4">
                        <p className="text-body mb-2"><strong>System Config:</strong> {proj.system}</p>
                        <p className="small text-muted">{proj.objective}</p>
                      </div>

                      <div className="d-flex flex-wrap gap-3">
                        <Link to={`/projects/${proj.slug}`} className="btn btn-primary btn-curved">
                          View Technical Specs
                        </Link>
                        <Link to={`/contact?project_inquiry=${encodeURIComponent(proj.name)}`} className="btn btn-outline-primary btn-curved">
                          Inquire Similar Setup
                        </Link>
                      </div>
                    </div>

                  </div>
                </ScrollReveal>
                {idx < projects.length - 1 && <hr className="my-5" />}
              </div>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <section className="cta-section py-5 bg-primary text-white" aria-label="Call to action">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8 text-center text-lg-start mb-3 mb-lg-0">
                <h2 className="text-white">Have a dynamic B2B plant project in mind?</h2>
                <p className="mb-0">Let SREW design a tailor-made aggregate solution meeting your local specifications, grading, and budget curves.</p>
              </div>
              <div className="col-lg-4 text-center text-lg-end">
                <Link to="/contact" className="btn btn-light btn-lg btn-curved">
                  Initiate Design Dialog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Projects;
