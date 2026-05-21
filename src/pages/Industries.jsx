import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ScrollReveal } from '../components/ScrollReveal';

export const Industries = () => {
  return (
    <>
      <Helmet>
        <title>Industries We Serve - Mining, Quarry &amp; C&amp;D Recycling | SREW</title>
        <meta name="description" content="Discover S R ENGG WORKS industrial solutions across Mining, Quarry, Road Aggregates, Sand Processing, and Construction &amp; Demolition (C&amp;D) Waste Recycling." />
      </Helmet>

      <main id="main-content" role="main">
        {/* Page Header */}
        <section className="page-header py-5 bg-light" aria-label="Page header">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1 className="fw-extrabold text-primary-ultra">Industries We Serve</h1>
                <p className="lead mt-3 mb-0" style={{ maxWidth: '800px', color: '#555' }}>
                  Custom-engineered equipment and plant designs delivering high yields across diverse material processing sectors.
                </p>
                <nav aria-label="Breadcrumb" className="mt-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Industries</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {/* Industries detailed list */}
        <div className="container py-5">
          {/* Industry 1: Quarry & Aggregate */}
          <section className="py-4" id="quarry-aggregate">
            <ScrollReveal>
              <div className="row align-items-center g-5">
                <div className="col-md-5">
                  <div className="rounded overflow-hidden shadow-md" style={{ height: '300px' }}>
                    <img src="/images/Products/jaw-crusher.jpg" alt="Aggregate Quarry crushing station" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                </div>
                <div className="col-md-7">
                  <h2 className="text-primary-ultra h3 mb-3">1. Quarry &amp; Aggregate Production</h2>
                  <p className="text-body mb-4">
                    High-quality concrete and asphalt aggregates require precise cubical shape and consistent size grading. SREW designs complete primary, secondary, and tertiary plants to process granite, basalt, limestone, and gravel. By integrating high-stroke jaw crushers, precision hydraulic cone crushers, and multi-deck grading screens, we enable quarry operators to optimize output volumes and meet rigorous highway development standards.
                  </p>
                  <ul className="list-inline small text-primary fw-bold">
                    <li className="list-inline-item me-3"><i className="fas fa-arrow-right me-1"></i> Road Aggregates</li>
                    <li className="list-inline-item me-3"><i className="fas fa-arrow-right me-1"></i> Concrete Aggregates</li>
                    <li className="list-inline-item"><i className="fas fa-arrow-right me-1"></i> Railway Ballast</li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
            <hr className="my-5" />
          </section>

          {/* Industry 2: Mining & Minerals */}
          <section className="py-2" id="mining-minerals">
            <ScrollReveal>
              <div className="row align-items-center g-5 flex-md-row-reverse">
                <div className="col-md-5">
                  <div className="rounded overflow-hidden shadow-md" style={{ height: '300px' }}>
                    <img src="/images/Products/cone-crusher.jpg" alt="Heavy mineral processing crushing line" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                </div>
                <div className="col-md-7">
                  <h2 className="text-primary-ultra h3 mb-3">2. Mining &amp; Mineral Extraction</h2>
                  <p className="text-body mb-4">
                    In heavy-duty mining environments, plant durability and mechanical reliability are vital. SREW provides heavy-duty jaw crushers and grizzly vibrating screens capable of processing highly abrasive ores, including iron ore, manganese, bauxite, and copper ores. Our equipment features thick structural frameworks, Hardox wear liners, and dynamically balanced shafts to withstand severe impact cycles.
                  </p>
                  <ul className="list-inline small text-primary fw-bold">
                    <li className="list-inline-item me-3"><i className="fas fa-arrow-right me-1"></i> Abrasive Ore Reduction</li>
                    <li className="list-inline-item me-3"><i className="fas fa-arrow-right me-1"></i> Mining Feed Control</li>
                    <li className="list-inline-item"><i className="fas fa-arrow-right me-1"></i> Grizzly Pre-Screening</li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
            <hr className="my-5" />
          </section>

          {/* Industry 3: Manufactured Sand (M-Sand) */}
          <section className="py-2" id="manufactured-sand">
            <ScrollReveal>
              <div className="row align-items-center g-5">
                <div className="col-md-5">
                  <div className="rounded overflow-hidden shadow-md" style={{ height: '300px' }}>
                    <img src="/images/Products/VSI-crusher.jpg" alt="M-Sand manufacturing VSI plant" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                </div>
                <div className="col-md-7">
                  <h2 className="text-primary-ultra h3 mb-3">3. Manufactured Sand (M-Sand)</h2>
                  <p className="text-body mb-4">
                    With river sand mining strictly regulated, Manufactured Sand (M-Sand) is essential for construction. SREW VSI (Vertical Shaft Impactor) crushers and high-frequency screening plants are designed specifically to shape cubical concrete and plaster sand. Our advanced dry classification systems and wet spiral washing systems separate micro-fines efficiently, producing high-grade sand that complies with IS 383 standards.
                  </p>
                  <ul className="list-inline small text-primary fw-bold">
                    <li className="list-inline-item me-3"><i className="fas fa-arrow-right me-1"></i> Concrete M-Sand</li>
                    <li className="list-inline-item me-3"><i className="fas fa-arrow-right me-1"></i> Plaster Sand Grading</li>
                    <li className="list-inline-item"><i className="fas fa-arrow-right me-1"></i> Sand Washing Systems</li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
            <hr className="my-5" />
          </section>

          {/* Industry 4: C&D Waste Recycling */}
          <section className="py-2" id="cd-waste-recycling">
            <ScrollReveal>
              <div className="row align-items-center g-5 flex-md-row-reverse">
                <div className="col-md-5">
                  <div className="rounded overflow-hidden shadow-md" style={{ height: '300px' }}>
                    <img src="/images/Products/cd-recycling.jpg" alt="Construction & Demolition Waste Recycling" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                </div>
                <div className="col-md-7">
                  <h2 className="text-primary-ultra h3 mb-3">4. Construction &amp; Demolition (C&amp;D) Recycling</h2>
                  <p className="text-body mb-4">
                    Rapid urban expansion creates massive quantities of demolition debris. S R ENGG WORKS is an engineering pioneer in circular economy solutions, designing custom C&amp;D Waste Recycling plants. Our systems process old concrete, brick, and block rubble into clean, reusable aggregates and recycled concrete sand. Complete with overbelt magnetic separators and light-refuse air classifiers, these plants deliver clean, marketable raw materials, diverting waste from urban landfills.
                  </p>
                  <ul className="list-inline small text-primary fw-bold">
                    <li className="list-inline-item me-3"><i className="fas fa-arrow-right me-1"></i> Concrete Rubble Recovery</li>
                    <li className="list-inline-item me-3"><i className="fas fa-arrow-right me-1"></i> Magnetic Metal Separating</li>
                    <li className="list-inline-item"><i className="fas fa-arrow-right me-1"></i> Eco-Friendly Aggregates</li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </section>
        </div>

        {/* CTA section */}
        <section className="cta-section py-5 bg-primary text-white" aria-label="Call to action">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8 text-center text-lg-start mb-3 mb-lg-0">
                <h2 className="text-white">Need a custom processing solution?</h2>
                <p className="mb-0">Our engineers can design a custom plant layout optimized for your specific mineral composition and yield requirements.</p>
              </div>
              <div className="col-lg-4 text-center text-lg-end">
                <a href="/contact" className="btn btn-light btn-lg btn-curved">Consult with an Engineer</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Industries;
