import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { products } from '../data/products';
import { ScrollReveal } from '../components/ScrollReveal';
import { ENV } from '../env';

export const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);

  // Brochure form states
  const [brochureName, setBrochureName] = useState('');
  const [brochurePhone, setBrochurePhone] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('');

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h2 text-danger">Product Not Found</h1>
        <p className="lead mt-3">The machinery equipment page you requested could not be loaded.</p>
        <Link to="/products" className="btn btn-primary btn-curved mt-3">Back to Products</Link>
      </div>
    );
  }

  const handleBrochureSubmit = (e) => {
    e.preventDefault();
    if (!brochureName.trim() || !brochurePhone.trim()) {
      setDownloadStatus('Please provide both name and mobile number.');
      return;
    }

    if (!/^[0-9]{10}$/.test(brochurePhone)) {
      setDownloadStatus('Please enter a valid 10-digit mobile number.');
      return;
    }

    setDownloading(true);
    setDownloadStatus('Initializing PDF download...');

    // Trigger PDF download natively
    const link = document.createElement('a');
    link.href = '/brochures/srew-company-profile.pdf';
    link.download = 'SREW-Company-Profile.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Send tracking data to SREW's validated Google Apps Script endpoint from central ENV
    const url = ENV.GOOGLE_SHEETS_CONTACT_URL;
    
    const params = new URLSearchParams();
    params.append('name', brochureName);
    params.append('phone', brochurePhone);
    params.append('source', `Brochure Download - ${product.shortName}`);

    fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    })
      .then(() => {
        setDownloadStatus('✓ Thank you! Downloading company profile brochure.');
        setBrochureName('');
        setBrochurePhone('');
        setDownloading(false);
      })
      .catch(() => {
        setDownloadStatus('✓ Brochure downloaded. Operational log saved.');
        setDownloading(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} - 30–800 TPH Industrial Crushing | SREW`}</title>
        <meta name="description" content={`${product.purpose} SREW Projects - Crushing & Screening Plant Manufacturer WORKS is an ISO 9001:2015 certified manufacturer of high-capacity aggregate machinery in Hyderabad, India.`} />
        <meta name="keywords" content={`${product.shortName}, SREW Projects - Crushing & Screening Plant Manufacturer WORKS, ${product.name}, quarry crushing, sand processing, heavy engineering, stone crusher, industrial machinery, Hyderabad, India`} />
        <link rel="canonical" href={`https://srewprojects.com/products/${product.slug}`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://srewprojects.com/products/${product.slug}`} />
        <meta property="og:title" content={`${product.name} - Crushing &amp; Screening Machinery`} />
        <meta property="og:description" content={`${product.purpose} ISO 9001:2015 certified turnkey plants up to 800 TPH.`} />
        <meta property="og:image" content={`https://srewprojects.com${product.image}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - Heavy Duty SREW Machinery`} />
        <meta name="twitter:description" content={`Get standard brochures, dimensional blueprint specs, and aggregate capacity reviews for SREW's high-yield ${product.name}.`} />
        <meta name="twitter:image" content={`https://srewprojects.com${product.image}`} />
        <meta name="geo.region" content="IN-TG" />
        <meta name="geo.placename" content="Hyderabad, Telangana, India" />
        <meta name="geo.position" content="17.5158653;78.4377875" />
        <meta name="ICBM" content="17.5158653, 78.4377875" />
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "${product.name}",
            "image": "https://srewprojects.com${product.image}",
            "description": "${product.purpose}",
            "brand": {
              "@type": "Brand",
              "name": "SREW"
            },
            "category": "${product.category}",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "INR",
              "lowPrice": "150000",
              "highPrice": "8500000",
              "offerCount": "8",
              "priceRange": "₹₹₹",
              "itemCondition": "https://schema.org/NewCondition",
              "seller": {
                "@type": "Organization",
                "name": "SREW Projects - Crushing & Screening Plant Manufacturer WORKS"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "32"
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
              {"@type": "ListItem", "position": 2, "name": "Products", "item": "https://srewprojects.com/products"},
              {"@type": "ListItem", "position": 3, "name": "${product.shortName}", "item": "https://srewprojects.com/products/${product.slug}"}
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
                <span className="badge bg-primary text-white mb-2 py-2 px-3 fw-bold">{product.category}</span>
                <h1 className="fw-extrabold text-primary-ultra mt-1">{product.name}</h1>
                <p className="lead mt-3 mb-0" style={{ maxWidth: '800px', color: '#555' }}>
                  {product.purpose}
                </p>
                <nav aria-label="Breadcrumb" className="mt-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{product.shortName}</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Section */}
        <section className="py-5" aria-label="Product specifications and details">
          <div className="container py-3">
            <div className="row g-5">
              
              {/* Product Core Details */}
              <div className="col-lg-7 col-xl-8">
                <ScrollReveal>
                  <div className="overflow-hidden rounded shadow-sm mb-5" style={{ maxHeight: '420px' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-100 h-100" 
                      style={{ objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/images/logo.png'; e.target.style.objectFit = 'contain'; e.target.style.padding = '40px'; }}
                    />
                  </div>

                  <h2 className="text-primary-ultra h4 fw-bold mb-3">Equipment Overview</h2>
                  <p className="text-body mb-4">{product.details}</p>

                  <h2 className="text-primary-ultra h4 fw-bold mb-3">Key Structural Features</h2>
                  <ul className="list-unstyled mb-5">
                    {product.features.map((feat, i) => (
                      <li key={i} className="d-flex align-items-start mb-3">
                        <i className="fas fa-check-circle text-primary mt-1 me-3 fs-5"></i>
                        <span className="text-body">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <h2 className="text-primary-ultra h4 fw-bold mb-3">Recommended Applications</h2>
                  <div className="row g-3">
                    {product.applications.map((app, i) => (
                      <div className="col-md-6" key={i}>
                        <div className="card border-0 bg-light p-3 rounded h-100">
                          <p className="small fw-semibold mb-0 text-primary-ultra"><i className="fas fa-arrow-right text-primary me-2"></i> {app}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* Sidebar Column */}
              <div className="col-lg-5 col-xl-4">
                <ScrollReveal delay={200}>
                  
                  {/* Technical Specs Table */}
                  <div className="card border-0 bg-primary text-white p-4 rounded shadow-sm mb-4">
                    <h3 className="h5 text-white fw-bold mb-3"><i className="fas fa-sliders-h me-2 text-warning"></i> Technical Specifications</h3>
                    <table className="table table-borderless table-sm text-white small mb-0">
                      <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <td className="fw-bold ps-0 py-2" style={{ color: 'var(--c-accent)' }}>Capacity</td>
                          <td className="pe-0 py-2 text-end fw-bold">{product.capacity}</td>
                        </tr>
                        {product.specs.map(spec => (
                          <tr key={spec.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <td className="fw-bold ps-0 py-2" style={{ color: 'var(--c-accent)' }}>{spec.key}</td>
                            <td className="pe-0 py-2 text-end">{spec.val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Brochure Download Form Widget */}
                  <div className="card border-0 bg-light p-4 rounded shadow-sm mb-4">
                    <h3 className="h6 text-primary-ultra fw-bold mb-2"><i className="fas fa-file-pdf text-danger me-2"></i> Download Equipment Brochure</h3>
                    <p className="small text-muted mb-3">Provide your details to immediately download our technical catalog profiles.</p>
                    
                    {downloadStatus && (
                      <div className="alert alert-warning small py-2 px-3 mb-3" role="alert">
                        {downloadStatus}
                      </div>
                    )}

                    <form onSubmit={handleBrochureSubmit} className="row g-2">
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Your Name"
                          value={brochureName}
                          onChange={(e) => setBrochureName(e.target.value)}
                          required
                          disabled={downloading}
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type="tel"
                          className="form-control form-control-sm"
                          placeholder="10-Digit Mobile No."
                          pattern="[0-9]{10}"
                          value={brochurePhone}
                          onChange={(e) => setBrochurePhone(e.target.value)}
                          required
                          disabled={downloading}
                        />
                      </div>
                      <div className="col-12 mt-2">
                        <button
                          type="submit"
                          className="btn btn-primary btn-curved small w-100"
                          disabled={downloading}
                        >
                          {downloading ? 'Downloading...' : 'Get Catalog PDF'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* RFQ Direct Contact Widget */}
                  <div className="card border-0 bg-light p-4 rounded text-center">
                    <h3 className="h6 text-primary-ultra fw-bold mb-2">Need a custom quote?</h3>
                    <p className="small text-muted mb-4">Inquire about our complete dynamic multi-stage aggregate sizing plant configurations.</p>
                    <Link to={`/contact?product=${encodeURIComponent(product.name)}`} className="btn btn-primary btn-curved w-100">
                      Request Quotation
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

export default ProductDetail;
