import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';
import { products } from '../data/products';

export const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Calculator state
  const [calcCapacity, setCalcCapacity] = useState('50-100');
  const [calcMaterial, setCalcMaterial] = useState('granite');
  const [calcFeedSize, setCalcFeedSize] = useState('300-500');
  
  const categories = ['All', 'Crushers', 'Screening', 'Feeding', 'Sand Processing', 'Handling', 'Sustainability'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Dynamic selection logic for TPH calculator
  const getRecommendation = () => {
    const isHard = calcMaterial === 'granite' || calcMaterial === 'iron-ore';
    
    if (calcCapacity === '30-50') {
      return {
        model: "SREW 24x15 Heavy-Duty Jaw Crusher",
        motor: "45 HP - 55 HP",
        ratio: "5:1",
        css: "40mm - 60mm",
        yield: "High cubical fines"
      };
    } else if (calcCapacity === '50-100') {
      if (calcFeedSize === '800+') {
        return {
          model: "SREW 36x24 Deep-Chamber Jaw Crusher",
          motor: "100 HP",
          ratio: "6:1",
          css: "75mm - 100mm",
          yield: "Excellent primary feed reduction"
        };
      }
      return {
        model: "SREW 30x20 Heavy-Duty Primary Jaw Crusher",
        motor: "75 HP",
        ratio: "5.5:1",
        css: "50mm - 75mm",
        yield: "Premium cubical outputs"
      };
    } else if (calcCapacity === '100-200') {
      if (isHard) {
        return {
          model: "SREW 36x24 Deep-Chamber Jaw Crusher + SREW Medium Cone Crusher",
          motor: "125 HP (Jaw) + 150 HP (Cone)",
          ratio: "6:1 primary",
          css: "75mm CSS primary",
          yield: "Premium NHAI standard ballast & aggregates"
        };
      }
      return {
        model: "SREW 36x24 Deep-Chamber Jaw Crusher",
        motor: "100 HP - 125 HP",
        ratio: "6:1",
        css: "75mm - 90mm",
        yield: "High TPH stable continuous screening feed"
      };
    } else if (calcCapacity === '200-300' || calcCapacity === '300-500' || calcCapacity === '500-800') {
      return {
        model: "SREW Dual-Toggle 42x36 Primary Jaw Crusher + SREW Hydraulic Cone Crusher",
        motor: "200 HP (Jaw) + 250 HP (Cone)",
        ratio: "6.5:1 aggregate system",
        css: "100mm CSS primary",
        yield: "Maximum output stability for continuous mining lines"
      };
    }

    return {
      model: "SREW 30x20 Heavy-Duty Primary Jaw Crusher",
      motor: "75 HP",
      ratio: "5.5:1",
      css: "50mm",
      yield: "Standard high-density road metal"
    };
  };

  const rec = getRecommendation();

  return (
    <>
      <Helmet>
        <title>Products - Jaw Crushers, Cone Crushers, VSI, Vibrating Screens | S R ENGG WORKS</title>
        <meta name="description" content="ISO 9001:2015 Certified Manufacturer of Crushing, Screening &amp; Sand Processing Plants | 30–800 TPH | Hyderabad, India | 30+ Years Experience" />
        <meta name="keywords" content="crushing plant, screening plant, jaw crusher, cone crusher, VSI crusher, sand dryer, vibrating screen, material handling, quarry crushing plant, M-Sand plant, M-Sand manufacturer, stone crusher manufacturer, aggregate plant, NHAI crusher, C&amp;D recycling plant, EPC equipment partner, turnkey crushing plant, Hyderabad, India, SREW" />
        <link rel="canonical" href="https://srewprojects.com/products" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://srewprojects.com/products" />
        <meta property="og:title" content="Products - Crushing, Screening &amp; Material Handling Equipment | SREW" />
        <meta property="og:description" content="ISO 9001:2015 Certified Manufacturer of Crushing, Screening &amp; Sand Processing Plants | 30–800 TPH | Hyderabad, India | 30+ Years Experience" />
        <meta property="og:image" content="https://srewprojects.com/images/product-jaw-crusher.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Products - Crushing &amp; Screening Plant Equipment" />
        <meta name="twitter:description" content="Explore S R ENGG WORKS comprehensive range of heavy duty jaw crushers, cone crushers, M-sand VSI crushers, vibrating screens, grizzly feeders, and sand dryers." />
        <meta name="twitter:image" content="https://srewprojects.com/images/product-jaw-crusher.jpg" />
        <meta name="geo.region" content="IN-TG" />
        <meta name="geo.placename" content="Hyderabad, Telangana, India" />
        <meta name="geo.position" content="17.5158653;78.4377875" />
        <meta name="ICBM" content="17.5158653, 78.4377875" />
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "S R ENGG WORKS Products",
            "description": "Comprehensive range of crushing, screening and processing equipment",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@type": "Product",
                  "name": "Jaw Crushers",
                  "description": "Primary crushing of large hard materials like granite, basalt, and limestone. 30-800 TPH capacity.",
                  "brand": {"@type": "Brand", "name": "SREW"},
                  "url": "https://srewprojects.com/products#jaw-crushers"
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@type": "Product",
                  "name": "Cone Crushers",
                  "description": "Secondary and tertiary crushing to produce fine and uniform aggregates. 50-500 TPH capacity.",
                  "brand": {"@type": "Brand", "name": "SREW"},
                  "url": "https://srewprojects.com/products#cone-crushers"
                }
              },
              {
                "@type": "ListItem",
                "position": 3,
                "item": {
                  "@type": "Product",
                  "name": "VSI/HSI Crushers",
                  "description": "Shaping and producing cubical sand and aggregates. 50-300 TPH capacity.",
                  "brand": {"@type": "Brand", "name": "SREW"},
                  "url": "https://srewprojects.com/products#vsi-hsi-crushers"
                }
              },
              {
                "@type": "ListItem",
                "position": 4,
                "item": {
                  "@type": "Product",
                  "name": "Vibrating Screens",
                  "description": "Screening and grading materials into multiple precise sizes. Up to 400 TPH.",
                  "brand": {"@type": "Brand", "name": "SREW"},
                  "url": "https://srewprojects.com/products#vibrating-screens"
                }
              },
              {
                "@type": "ListItem",
                "position": 5,
                "item": {
                  "@type": "Product",
                  "name": "Sand Dryers",
                  "description": "Reduce moisture content in sand for industrial applications. 20-50 TPH.",
                  "brand": {"@type": "Brand", "name": "SREW"},
                  "url": "https://srewprojects.com/products#sand-dryers"
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
              {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://srewprojects.com/"},
              {"@type": "ListItem", "position": 2, "name": "Products", "item": "https://srewprojects.com/products"}
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
                "name": "What types of crushers does SREW manufacture?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "S R ENGG WORKS manufactures four types of crushers: Jaw Crushers (30-800 TPH) for primary rock breaking, Cone Crushers (50-500 TPH) for secondary aggregate shaping, VSI/HSI Crushers (50-300 TPH) for M-Sand and cubical aggregate production, and Roller Crushers (50-100 TPH) for fine crushing of soft materials like coal, clay, and limestone."
                }
              },
              {
                "@type": "Question",
                "name": "What is the capacity range of SREW jaw crushers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SREW jaw crushers are available from 30 TPH to 800 TPH capacity. They feature heavy-duty construction, high reduction ratio, adjustable Closed Side Setting (CSS), and optional hydraulic toggle systems. Applications include mining, road construction, cement plants, and rock crushing."
                }
              },
              {
                "@type": "Question",
                "name": "Does SREW manufacture sand dryers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, SREW manufactures rotary sand dryers with 20-50 TPH capacity. They are available in LPG, Natural Gas, and Diesel-fired options with automatic temperature control, cyclone dust separation, and adjustable heat zones that maintain moisture levels under 2%. Used in foundries, ready-mix plants, and glass manufacturing."
                }
              },
              {
                "@type": "Question",
                "name": "What is a VSI crusher used for?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A VSI (Vertical Shaft Impact) crusher is used for producing cubical manufactured sand (M-Sand) and high-quality aggregates. SREW VSI crushers use rock-on-rock or rock-on-anvil crushing principles at high RPM for superior particle shape. They are used in M-Sand manufacturing, plaster sand production, asphalt mixes, and concrete production."
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
            "name": "Products - Jaw Crushers, Screening &amp; Sand Plants | SREW",
            "url": "https://srewprojects.com/products",
            "dateModified": "2026-05-21",
            "author": {"@type": "Organization", "name": "S R ENGG WORKS"},
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
      </Helmet>

      <main id="main-content" role="main">
        {/* Page Header */}
        <section className="page-header py-5 bg-light" aria-label="Page header">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h1 className="fw-extrabold text-primary-ultra">Machinery Products &amp; Systems</h1>
                <p className="lead mt-3 mb-0" style={{ maxWidth: '800px', color: '#555' }}>
                  Industrial aggregate systems ranging from 30 TPH to 800 TPH capacities, certified to ISO 9001:2015.
                </p>
                <nav aria-label="Breadcrumb" className="mt-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Products</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {/* TPH Crusher Selector Calculator Widget */}
        <section className="py-5" aria-label="TPH Crusher Selector Calculator">
          <div className="container py-3">
            <ScrollReveal>
              <div className="calc-container">
                <div className="row align-items-center mb-4">
                  <div className="col-lg-8">
                    <h2 className="text-primary-ultra h3 mb-2"><i className="fas fa-calculator text-primary me-2"></i> TPH Crusher Selector Calculator</h2>
                    <p className="small text-muted mb-0">Select your operational parameters and our engineering selector will instantly recommend the optimal crusher system configuration.</p>
                  </div>
                  <div className="col-lg-4 text-lg-end mt-2 mt-lg-0">
                    <span className="badge bg-primary text-white p-2 fw-bold"><i className="fas fa-robot me-1"></i> SREW AI Engineering Guide</span>
                  </div>
                </div>

                <div className="row g-4">
                  
                  {/* Inputs Column */}
                  <div className="col-md-6">
                    <div className="calc-card h-100">
                      <div className="mb-4">
                        <label className="form-label small fw-bold">1. Target Plant Capacity (TPH)</label>
                        <select 
                          className="form-select" 
                          value={calcCapacity} 
                          onChange={(e) => setCalcCapacity(e.target.value)}
                        >
                          <option value="30-50">30 - 50 TPH (Small Quarry)</option>
                          <option value="50-100">50 - 100 TPH (Medium Plant)</option>
                          <option value="100-200">100 - 200 TPH (High-Capacity Highway)</option>
                          <option value="200-300">200 - 300 TPH (Heavy Construction)</option>
                          <option value="300-500">300 - 500 TPH (Large Scale Mining)</option>
                          <option value="500-800">500 - 800 TPH (Mega Turnkey Site)</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="form-label small fw-bold">2. Rock Material &amp; Hardness</label>
                        <select 
                          className="form-select" 
                          value={calcMaterial} 
                          onChange={(e) => setCalcMaterial(e.target.value)}
                        >
                          <option value="granite">Granite / Basalt / Blue Metal (Very Hard)</option>
                          <option value="iron-ore">Iron Ore / Quartzite (Extremely Hard &amp; Abrasive)</option>
                          <option value="limestone">Limestone / River Gravel (Medium Hard)</option>
                          <option value="cd-waste">C&amp;D Waste / Brick Rubble (Soft Recycling)</option>
                        </select>
                      </div>

                      <div className="mb-0">
                        <label className="form-label small fw-bold">3. Maximum Feed Rock Size (mm)</label>
                        <select 
                          className="form-select" 
                          value={calcFeedSize} 
                          onChange={(e) => setCalcFeedSize(e.target.value)}
                        >
                          <option value="under-300">Under 300 mm</option>
                          <option value="300-500">300 - 500 mm</option>
                          <option value="500-800">500 - 800 mm</option>
                          <option value="800+">800 mm - 1000 mm</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Outputs Column */}
                  <div className="col-md-6">
                    <div className="calc-result-box text-white">
                      <span className="text-warning small fw-bold text-uppercase mb-2">Recommended Setup Recommendation</span>
                      <h3 className="h4 text-white fw-bold mb-4">{rec.model}</h3>
                      
                      <div className="row g-3 mb-4 text-start">
                        <div className="col-6">
                          <span className="small text-white-50 d-block">Required Power (HP):</span>
                          <span className="fw-bold text-warning">{rec.motor}</span>
                        </div>
                        <div className="col-6">
                          <span className="small text-white-50 d-block">Recommended CSS Setting:</span>
                          <span className="fw-bold text-warning">{rec.css}</span>
                        </div>
                        <div className="col-6">
                          <span className="small text-white-50 d-block">Estimated Reduction:</span>
                          <span className="fw-bold text-white">{rec.ratio}</span>
                        </div>
                        <div className="col-6">
                          <span className="small text-white-50 d-block">Secondary Output Yield:</span>
                          <span className="fw-bold text-white">{rec.yield}</span>
                        </div>
                      </div>

                      <Link 
                        to={`/contact?inquiry=${encodeURIComponent(rec.model)}`} 
                        className="btn btn-warning btn-curved text-dark fw-bold w-100"
                      >
                        Request Quote for this Configuration
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Dynamic Category Filter Products Grid */}
        <section className="py-5 bg-light" aria-label="Product Catalog Filter Deck">
          <div className="container py-3">
            <div className="text-center mb-5">
              <h2 className="text-primary-ultra">Our Machinery Product Hub</h2>
              <p className="text-muted">Browse complete, high-capacity components and automated aggregate sizing systems.</p>
            </div>

            {/* Category Filter Pills */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-curved px-4 py-2 small fw-bold ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary bg-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Dynamic Grid */}
            <div className="row g-4">
              {filteredProducts.map(prod => (
                <div className="col-lg-4 col-md-6" key={prod.slug}>
                  <ScrollReveal className="card h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
                    <div className="overflow-hidden" style={{ height: '220px' }}>
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-100 h-100" 
                        style={{ objectFit: 'cover', transition: 'transform var(--tr-slow)' }}
                        onError={(e) => { e.target.src = '/images/logo.png'; e.target.style.objectFit = 'contain'; e.target.style.padding = '20px'; }}
                      />
                    </div>
                    
                    <div className="card-body p-4 d-flex flex-column">
                      <span className="badge bg-primary-light text-white align-self-start mb-2 small">{prod.category}</span>
                      <h3 className="h5 text-primary-ultra fw-bold mb-2">{prod.name}</h3>
                      <p className="small text-muted mb-4 flex-grow-1">{prod.purpose}</p>
                      
                      <div className="small text-muted border-top pt-3 mb-4">
                        <strong>Capacity Range:</strong> <span className="text-primary fw-bold">{prod.capacity}</span>
                      </div>

                      <div className="d-flex gap-2">
                        <Link to={`/products/${prod.slug}`} className="btn btn-outline-primary btn-curved flex-grow-1 text-center py-2">
                          Learn More
                        </Link>
                        <Link to={`/contact?product=${encodeURIComponent(prod.name)}`} className="btn btn-primary btn-curved flex-grow-1 text-center py-2">
                          Request RFQ
                        </Link>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Products;
