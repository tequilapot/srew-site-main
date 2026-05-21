import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { projects } from '../data/projects';
import { ScrollReveal } from '../components/ScrollReveal';

export const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h2 text-danger">Project Not Found</h1>
        <p className="lead mt-3">The project case study you requested could not be loaded.</p>
        <Link to="/projects" className="btn btn-primary btn-curved mt-3">Back to Projects</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${project.name} - Case Study | S R ENGG WORKS`}</title>
        <meta name="description" content={`Explore engineering blueprints, technical challenges, solutions, and plant specs for SREW's ${project.name} turnkey project in ${project.location}.`} />
        <meta name="keywords" content={`${project.name}, S R ENGG WORKS, case study, ${project.location}, aggregate plant, turnkey crushing plant, mineral processing, Hyderabad, India`} />
        <link rel="canonical" href={`https://www.srenggworks.com/projects/${project.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.srenggworks.com/projects/${project.slug}`} />
        <meta property="og:title" content={`${project.name} - S R ENGG WORKS Case Study`} />
        <meta property="og:description" content={`Engineering breakdown of site setups, raw feed inputs, and final aggregate output yields for SREW's ${project.name}.`} />
        <meta property="og:image" content={`https://www.srenggworks.com${project.image}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${project.name} Case Study`} />
        <meta name="twitter:description" content={`Explore engineering blueprints, technical challenges, solutions, and plant specs for SREW's ${project.name} turnkey project.`} />
        <meta name="twitter:image" content={`https://www.srenggworks.com${project.image}`} />
        <meta name="geo.region" content="IN-TG" />
        <meta name="geo.placename" content="Hyderabad, Telangana, India" />
        <meta name="geo.position" content="17.5158653;78.4377875" />
        <meta name="ICBM" content="17.5158653, 78.4377875" />
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "${project.name}",
            "name": "${project.name}",
            "description": "${project.objective.replace(/"/g, '\\"')}",
            "image": "https://www.srenggworks.com${project.image}",
            "author": {
              "@type": "Organization",
              "name": "S R ENGG WORKS"
            },
            "publisher": {
              "@type": "Organization",
              "name": "S R ENGG WORKS",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.srenggworks.com/images/logo.png"
              }
            },
            "mainEntityOfPage": "https://www.srenggworks.com/projects/${project.slug}"
          }
        `}
        </script>
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.srenggworks.com/"},
              {"@type": "ListItem", "position": 2, "name": "Projects", "item": "https://www.srenggworks.com/projects"},
              {"@type": "ListItem", "position": 3, "name": "${project.name}", "item": "https://www.srenggworks.com/projects/${project.slug}"}
            ]
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
                <span className="text-primary small fw-bold text-uppercase"><i className="fas fa-map-marker-alt me-1"></i> {project.location}</span>
                <h1 className="fw-extrabold text-primary-ultra mt-2">{project.name}</h1>
                <p className="lead mt-3 mb-0" style={{ maxWidth: '800px', color: '#555' }}>
                  A detailed engineering breakdown of site setups, raw feed inputs, and final aggregate output yields.
                </p>
                <nav aria-label="Breadcrumb" className="mt-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item"><Link to="/projects">Projects</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{project.name}</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {/* Case Study Core Body */}
        <section className="py-5" aria-label="Case study details">
          <div className="container py-3">
            <div className="row g-5">
              
              {/* Detailed Breakdown */}
              <div className="col-lg-8">
                <ScrollReveal>
                  <div className="overflow-hidden rounded shadow-sm mb-4" style={{ maxHeight: '420px' }}>
                    <img 
                      src={project.image} 
                      alt={project.name} 
                      className="w-100 h-100" 
                      style={{ objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/images/logo.png'; e.target.style.objectFit = 'contain'; e.target.style.padding = '40px'; }}
                    />
                  </div>

                  <h2 className="h4 text-primary-ultra fw-bold mb-3">1. Background Objective</h2>
                  <p className="text-body mb-4">{project.objective}</p>

                  <h2 className="h4 text-primary-ultra fw-bold mb-3">2. Engineering Challenges</h2>
                  <p className="text-body mb-4">{project.challenge}</p>

                  <h2 className="h4 text-primary-ultra fw-bold mb-3">3. SREW Custom-Built Solution</h2>
                  <p className="text-body mb-4">{project.solution}</p>

                  <h2 className="h4 text-primary-ultra fw-bold mb-3">4. Operations &amp; Production Outcome</h2>
                  <p className="text-body mb-0">{project.outcome}</p>
                </ScrollReveal>
              </div>

              {/* Technical Specifications Side Column */}
              <div className="col-lg-4">
                <ScrollReveal delay={200}>
                  <div className="card border-0 bg-light p-4 rounded shadow-sm mb-4">
                    <h3 className="h5 text-primary-ultra fw-bold mb-3"><i className="fas fa-microchip text-primary me-2"></i> Project Metadata</h3>
                    
                    <ul className="list-unstyled mb-0 small text-muted">
                      <li className="mb-3">
                        <strong>Client Portfolio:</strong>
                        <p className="mb-0 text-dark">{project.client}</p>
                      </li>
                      <li className="mb-3">
                        <strong>Integrated System:</strong>
                        <p className="mb-0 text-dark">{project.system}</p>
                      </li>
                      <li className="mb-3">
                        <strong>Commission Year:</strong>
                        <p className="mb-0 text-dark">{project.year}</p>
                      </li>
                    </ul>
                  </div>

                  <div className="card border-0 bg-primary text-white p-4 rounded shadow-sm mb-4">
                    <h3 className="h5 text-white fw-bold mb-3"><i className="fas fa-table me-2 text-warning"></i> Production Specs</h3>
                    <table className="table table-borderless table-sm text-white small mb-0">
                      <tbody>
                        {project.specs.map(spec => (
                          <tr key={spec.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <td className="fw-bold ps-0 py-2" style={{ color: 'var(--c-accent)' }}>{spec.key}</td>
                            <td className="pe-0 py-2 text-end">{spec.val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="card border-0 bg-light p-4 rounded text-center">
                    <h3 className="h6 text-primary-ultra fw-bold mb-2">Want to replicate this exact setup?</h3>
                    <p className="small text-muted mb-4">Consult with our aggregate processing team regarding machinery layouts, TPH capacities, and site budgets.</p>
                    <Link to={`/contact?project_inquiry=${encodeURIComponent(project.name)}`} className="btn btn-primary btn-curved w-100">
                      Submit RFQ Inquiry
                    </Link>
                  </div>
                </ScrollReveal>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProjectDetail;
