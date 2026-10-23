import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';
import { projects } from '../data/projects';

export const Projects = () => {
  return (
    <>
      <Helmet>
        <title>Projects - Crushing &amp; Screening Plant Case Studies | SREW Projects</title>
        <meta name="description" content="ISO 9001:2015 Certified Manufacturer of Crushing, Screening &amp; Sand Processing Plants | 20–250 TPH | Hyderabad, India | 10+ Years Experience" />
        <meta name="keywords" content="crushing plant, screening plant, case studies, turnkey installation, Kepler, Singareni, Kesara, aggregate plant, project commissions, Hyderabad, India, SREW" />
        <link rel="canonical" href="https://www.srewprojects.com/projects" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.srewprojects.com/projects" />
        <meta property="og:title" content="Project Case Studies - SREW Projects" />
        <meta property="og:description" content="ISO 9001:2015 Certified Manufacturer of Crushing, Screening &amp; Sand Processing Plants | 20–250 TPH | Hyderabad, India | 10+ Years Experience" />
        <meta property="og:image" content="https://www.srewprojects.com/images/Projects/project1.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Project Case Studies - SREW Projects" />
        <meta name="twitter:description" content="View SREW Projects successful turnkey installations across India: West Bengal 200 TPH plant, Singareni 250 TPH plant, Keesara 150 TPH plant." />
        <meta name="twitter:image" content="https://www.srewprojects.com/images/Projects/project1.jpg" />
        <meta name="geo.region" content="IN-TG" />
        <meta name="geo.placename" content="Hyderabad, Telangana, India" />
        <meta name="geo.position" content="17.5158653;78.4377875" />
        <meta name="ICBM" content="17.5158653, 78.4377875" />
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "SREW Project Case Studies",
            "description": "Showcasing engineering solutions delivered across mining, construction, and recycling sectors.",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "item": {
                    "@type": "Article",
                    "name": "200 TPH Crushing & Screening Plant – West Bengal",
                    "description": "Delivered 3 output sizes and washed sand within a compact 3-acre plant layout."
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "item": {
                    "@type": "Article",
                    "name": "250 TPH Aggregate Plant – Singareni",
                    "description": "Achieved stable production even during monsoon season."
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "item": {
                    "@type": "Article",
                    "name": "40 TPH Mobile Crushing Unit – Odisha",
                    "description": "Deployed in 20 days, running in 6+ locations."
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "item": {
                    "@type": "Article",
                    "name": "150 TPH Cone Crusher Plant – Keesara",
                    "description": "Supplied materials for multiple NHAI projects across Telangana."
                  }
                },
                {
                  "@type": "ListItem",
                  "position": 5,
                  "item": {
                    "@type": "Article",
                    "name": "C&D Waste Recycling + Sand Dryer – 40 to 50 TPH",
                    "description": "Converted C&D waste into usable sand and aggregates, fully compliant with green norms."
                  }
                }
              ]
            }
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
              {"@type": "ListItem", "position": 2, "name": "Projects", "item": "https://www.srewprojects.com/projects"}
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
                "name": "How many projects has SREW completed?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SREW Projects has successfully completed over 120 turnkey projects for 45+ clients across India. Projects range from 20–250 TPH capacity plants spanning mining, construction, infrastructure, and C&D waste recycling sectors."
                }
              },
              {
                "@type": "Question",
                "name": "What types of turnkey projects does SREW deliver?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SREW delivers complete turnkey crushing and screening plants, M-Sand manufacturing plants, aggregate production plants, C&D waste recycling facilities, and sand processing & drying plants. Each project includes design-to-commissioning services with ongoing after-sales support."
                }
              },
              {
                "@type": "Question",
                "name": "Does SREW handle project installation and commissioning?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, SREW provides end-to-end project delivery including site assessment, plant design, equipment manufacturing, transportation, installation, commissioning, operator training, and comprehensive after-sales support."
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
            "name": "Projects - Turnkey Crushing &amp; Screening Plants | SREW",
            "url": "https://www.srewprojects.com/projects",
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
