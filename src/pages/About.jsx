import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ScrollReveal } from '../components/ScrollReveal';

export const About = () => {
  return (
    <>
      <Helmet>
        <title>About S R ENGG WORKS - Precision Engineering India</title>
        <meta name="description" content="S R ENGG WORKS (SREW) is an ISO 9001:2015 certified manufacturer of crushing, screening, and sand processing plants in Hyderabad, India with 10+ years industry experience." />
        <link rel="canonical" href="https://srewprojects.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://srewprojects.com/about" />
        <meta property="og:title" content="About S R ENGG WORKS - Precision Engineering India" />
        <meta property="og:description" content="ISO 9001:2015 certified manufacturer of crushing, screening, and sand processing plants in Hyderabad, India with 10+ years industry experience." />
        <meta property="og:image" content="https://srewprojects.com/images/logo.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="geo.region" content="IN-TG" />
        <meta name="geo.placename" content="Hyderabad, Telangana, India" />
        <meta name="geo.position" content="17.5158653;78.4377875" />
        <meta name="ICBM" content="17.5158653, 78.4377875" />
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "About S R ENGG WORKS - Precision Engineering India",
            "url": "https://srewprojects.com/about",
            "dateModified": "2026-05-21",
            "author": {
              "@type": "Organization",
              "name": "S R ENGG WORKS"
            },
            "publisher": {
              "@type": "Organization",
              "name": "S R ENGG WORKS",
              "logo": {
                "@type": "ImageObject",
                "url": "https://srewprojects.com/images/logo.png"
              }
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", ".lead", "#faq-section"]
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
              {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://srewprojects.com/"},
              {"@type": "ListItem", "position": 2, "name": "About Us", "item": "https://srewprojects.com/about"}
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
              {"@type": "Question", "name": "When was S R ENGG WORKS established?", "acceptedAnswer": {"@type": "Answer", "text": "S R ENGG WORKS (SREW) was established in 2018. Our founding team brings over 10 years of combined industry experience in precision engineering, industrial fabrication, and heavy equipment manufacturing for the mining, construction, and recycling sectors."}},
              {"@type": "Question", "name": "What are SREW's manufacturing facilities?", "acceptedAnswer": {"@type": "Answer", "text": "SREW operates a state-of-the-art manufacturing facility in Hyderabad, India, equipped with CNC machining centers for precision component manufacturing, high-precision fabrication bays for large-scale industrial structures, hydraulic press shops for metal forming, and PLC panel manufacturing units for plant automation."}},
              {"@type": "Question", "name": "How many projects has SREW delivered?", "acceptedAnswer": {"@type": "Answer", "text": "SREW has successfully delivered over 120 turnkey projects for 45+ clients across India. Our projects span mining, construction, infrastructure, sand processing, and C&D waste recycling applications, with plant capacities ranging from 30 TPH to 800 TPH."}}
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
                <h1 className="fw-extrabold text-primary-ultra">About S R ENGG WORKS</h1>
                <p className="lead mt-3 mb-0" style={{ maxWidth: '800px', color: '#555' }}>
                  Precision engineering, custom industrial fabrication, and high-performance material processing solutions.
                </p>
                <nav aria-label="Breadcrumb" className="mt-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">About Us</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {/* Corporate Profile Section */}
        <section className="py-5" aria-label="Corporate Profile">
          <div className="container py-3">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <ScrollReveal>
                  <h2 className="mb-4 text-primary-ultra">Certified B2B Industrial Leaders</h2>
                  <p className="lead text-muted mb-4">
                    Founded with a vision to revolutionize aggregate crushing efficiency, S R ENGG WORKS (SREW) has grown into a key manufacturer of heavy-duty industrial processing machinery in India.
                  </p>
                  <p className="mb-4 text-body">
                    Headquartered in Hyderabad, Telangana, we design, fabricate, deploy, and service high-yield turnkey plants spanning capacities from 30 TPH to 800 TPH. Our manufacturing facility in the Jeedimetla Industrial Area is equipped with state-of-the-art CNC machining centers, automated plasma cutting, heavy-duty rolling, and custom metallurgy heat-treatment testing systems.
                  </p>
                  <p className="mb-4 text-body">
                    We maintain an unwavering commitment to quality under our certified <strong>ISO 9001:2015</strong> Quality Management Systems, ensuring every jaw crusher, screen panel, or conveyor framework is manufactured to tight mechanical tolerances.
                  </p>
                </ScrollReveal>
              </div>
              <div className="col-lg-6">
                <ScrollReveal delay={200}>
                  <div className="position-relative overflow-hidden rounded shadow-lg" style={{ height: '400px' }}>
                    <img 
                      src="/images/Products/jaw-crusher.jpg" 
                      alt="SREW precision fabrication facility showing heavy machinery assembly" 
                      className="w-100 h-100" 
                      style={{ objectFit: 'cover' }} 
                    />
                    <div className="position-absolute bottom-0 start-0 bg-primary text-white p-4 m-3 rounded shadow" style={{ maxWidth: '280px' }}>
                      <h3 className="h5 text-white mb-1">Jeedimetla Plant</h3>
                      <p className="small mb-0 opacity-90">45,000+ Sq.Ft. Modern Manufacturing Floor Space in Hyderabad</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Ledger */}
        <section className="py-5 bg-light" aria-label="Our Core Values">
          <div className="container py-3">
            <div className="text-center mb-5">
              <h2 className="text-primary-ultra">Our Engineering Values</h2>
              <p className="text-muted">The core operational pillars that guide SREW's B2B relationships.</p>
            </div>
            
            <div className="row g-4">
              <div className="col-md-4">
                <ScrollReveal className="card h-100 border-0 shadow-sm p-4 text-center">
                  <div className="text-primary mb-3" style={{ fontSize: '2.5rem' }}>
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3 className="h5 mb-3 text-primary-ultra">Uncompromising Quality</h3>
                  <p className="small text-muted mb-0">
                    From raw manganese alloy casting inspections to final dynamic rotor balancing, our quality team enforces strict ISO compliance checklists.
                  </p>
                </ScrollReveal>
              </div>
              
              <div className="col-md-4">
                <ScrollReveal delay={100} className="card h-100 border-0 shadow-sm p-4 text-center">
                  <div className="text-primary mb-3" style={{ fontSize: '2.5rem' }}>
                    <i className="fas fa-cogs"></i>
                  </div>
                  <h3 className="h5 mb-3 text-primary-ultra">Customer-Centric Design</h3>
                  <p className="small text-muted mb-0">
                    We don't sell stock machinery. Our aggregate engineering division designs custom crushing profiles suited specifically for your rock mineral compositions.
                  </p>
                </ScrollReveal>
              </div>

              <div className="col-md-4">
                <ScrollReveal delay={200} className="card h-100 border-0 shadow-sm p-4 text-center">
                  <div className="text-primary mb-3" style={{ fontSize: '2.5rem' }}>
                    <i className="fas fa-users-cog"></i>
                  </div>
                  <h3 className="h5 mb-3 text-primary-ultra">Relentless Field Support</h3>
                  <p className="small text-muted mb-0">
                    Aggregate production downtime means massive losses. Our Hyderabad-based field service team operates on call to dispatch replacement spares and optimize plants.
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Facility Details Ledger */}
        <section className="py-5" aria-label="Our Infrastructure">
          <div className="container py-3">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 order-lg-last">
                <ScrollReveal>
                  <h2 className="mb-4 text-primary-ultra">State-of-the-Art Infrastructure</h2>
                  <p className="text-body mb-4">
                    Our Jeedimetla plant features precision machinery capable of processing high-thickness plate fabrications. This infrastructure allows us to build heavy structural crusher bodies, balanced conveyor frames, and multi-deck screen systems in-house.
                  </p>
                  <ul className="list-unstyled mb-0">
                    <li className="d-flex align-items-start mb-3">
                      <i className="fas fa-check-circle text-primary mt-1 me-3"></i>
                      <div>
                        <strong>CNC Machining &amp; Boring</strong>
                        <p className="small text-muted mb-0">Ensuring bearing fits and shaft alignments are bored to micron-scale clearances.</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <i className="fas fa-check-circle text-primary mt-1 me-3"></i>
                      <div>
                        <strong>Advanced Stress Relief Testing</strong>
                        <p className="small text-muted mb-0">Heat treating all critical heavy welds to eliminate residual stress prior to assembly.</p>
                      </div>
                    </li>
                    <li className="d-flex align-items-start">
                      <i className="fas fa-check-circle text-primary mt-1 me-3"></i>
                      <div>
                        <strong>Ultrasonic Metallurgical Testing</strong>
                        <p className="small text-muted mb-0">Non-destructive test protocols checking for subsurface microscopic voids in drive shafts.</p>
                      </div>
                    </li>
                  </ul>
                </ScrollReveal>
              </div>
              <div className="col-lg-6">
                <ScrollReveal delay={200}>
                  <div className="card border-0 bg-primary text-white p-5 rounded shadow-lg">
                    <h3 className="h4 text-white mb-4">Fast Infrastructure Facts</h3>
                    <div className="row g-4">
                      <div className="col-6">
                        <h4 className="h2 text-warning fw-bold mb-0">45k+</h4>
                        <p className="small text-white-50 mb-0">Square Feet Floor Space</p>
                      </div>
                      <div className="col-6">
                        <h4 className="h2 text-warning fw-bold mb-0">75+</h4>
                        <p className="small text-white-50 mb-0">Engineering Specialists</p>
                      </div>
                      <div className="col-6">
                        <h4 className="h2 text-warning fw-bold mb-0">2018</h4>
                        <p className="small text-white-50 mb-0">Corporate Founding Year</p>
                      </div>
                      <div className="col-6">
                        <h4 className="h2 text-warning fw-bold mb-0">ISO</h4>
                        <p className="small text-white-50 mb-0">9001:2015 Management</p>
                      </div>
                    </div>
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

export default About;
