import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';
import { ENV } from '../env';

export const Contact = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Read search parameters for pre-filling form subjects
    const inquiry = searchParams.get('inquiry') || searchParams.get('product') || searchParams.get('project_inquiry') || searchParams.get('industry');
    if (inquiry) {
      setFormData(prev => ({
        ...prev,
        subject: `Inquiry about ${decodeURIComponent(inquiry)}`
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (status.text) setStatus({ type: '', text: '' });
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      setStatus({ type: 'danger', text: 'Please fill out all required fields.' });
      return;
    }

    if (phone && !/^[0-9]{10}$/.test(phone)) {
      setStatus({ type: 'danger', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setSubmitting(true);
    if (status.text) setStatus({ type: '', text: '' });

    // Web3Forms payload using central ENV
    const web3Payload = JSON.stringify({
      access_key: ENV.WEB3FORMS_ACCESS_KEY,
      name: name,
      email: email,
      phone: phone || 'Not provided',
      subject: subject,
      message: message,
      from_name: 'SREW Contact Form'
    });

    // Submit payload to both Web3Forms and Google Apps Script endpoint from central ENV
    const url = ENV.GOOGLE_SHEETS_CONTACT_URL;
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    params.append('phone', phone);
    params.append('subject', subject);
    params.append('message', message);
    params.append('source', 'Contact Form');

    Promise.all([
      fetch(ENV.WEB3FORMS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: web3Payload
      }).then(res => res.json()),
      fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      }).catch(() => {})
    ])
      .then(() => {
        // Show toaster notification popup ONLY (remove inline success alert)
        if (typeof window._srew_toast === 'function') {
          window._srew_toast('✓ Form sent successfully! We will contact you soon.', 'success');
        } else {
          const c = document.createElement('div');
          c.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;background:#fff;padding:16px 24px;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,0.18);border-left:4px solid #10b981;font-size:14px;max-width:380px;animation:toastIn 0.5s ease;display:flex;align-items:center;gap:12px;color:#0f172a;font-weight:500;';
          c.innerHTML = '<strong style="color:#10b981;font-size:16px;">✓</strong> <span>Form sent successfully! We will get back to you shortly.</span>';
          document.body.appendChild(c);
          setTimeout(() => c.remove(), 4500);
        }

        // Reset the form right away and clear inline status so another form can be submitted immediately
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setSubmitting(false);
        setStatus({ type: '', text: '' });
      })
      .catch(() => {
        setStatus({ type: 'danger', text: 'There was an error sending your message. Please try again or call us directly.' });
        if (typeof window._srew_toast === 'function') {
          window._srew_toast('Failed to send form. Please try again.', 'error');
        } else {
          const c = document.createElement('div');
          c.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;background:#fff;padding:16px 24px;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,0.18);border-left:4px solid #ef4444;font-size:14px;max-width:380px;animation:toastIn 0.5s ease;display:flex;align-items:center;gap:12px;color:#0f172a;font-weight:500;';
          c.innerHTML = '<strong style="color:#ef4444;font-size:16px;">✕</strong> <span>Failed to send form. Please try again.</span>';
          document.body.appendChild(c);
          setTimeout(() => c.remove(), 4500);
        }
        setSubmitting(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>Contact SREW Projects - Crushing & Screening Plant Manufacturer WORKS - Request RFQ &amp; Consultation</title>
        <meta name="description" content="Request a quote or consult SREW Projects - Crushing & Screening Plant Manufacturer WORKS on crushing, screening, M-Sand, and C&amp;D waste recycling plants. Multiple office coordinates in Hyderabad, India." />
        <link rel="canonical" href="https://srewprojects.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://srewprojects.com/contact" />
        <meta property="og:title" content="Contact SREW Projects - Crushing & Screening Plant Manufacturer WORKS - Request RFQ &amp; Consultation" />
        <meta property="og:description" content="ISO 9001:2015 Certified Manufacturer of Crushing, Screening &amp; Sand Processing Plants | 30–800 TPH | Hyderabad, India | 10+ Years Experience" />
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
            "@type": "LocalBusiness",
            "name": "SREW Projects - Crushing & Screening Plant Manufacturer WORKS",
            "alternateName": "SREW",
            "@id": "https://srewprojects.com/#localbusiness",
            "url": "https://srewprojects.com",
            "telephone": "+91-8790759460",
            "email": "srenggworks2016@gmail.com",
            "image": "https://srewprojects.com/images/logo.png",
            "logo": "https://srewprojects.com/images/logo.png",
            "priceRange": "₹₹₹",
            "description": "ISO 9001:2015 Certified Manufacturer of Crushing, Screening & Sand Processing Plants. 30–800 TPH capacity. 10+ years experience. Hyderabad, India.",
            "hasMap": "https://share.google/hDqCzUIV3UuE8WGLg",
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
            "sameAs": [
              "https://www.facebook.com/profile.php?id=100070029793724",
              "https://www.linkedin.com/company/thesrew",
              "https://www.youtube.com/channel/UCXv5mgy6tQZUApyfT3Komtw",
              "https://www.instagram.com/srenggworks/",
              "https://share.google/hDqCzUIV3UuE8WGLg"
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
              {"@type": "ListItem", "position": 2, "name": "Contact Us", "item": "https://srewprojects.com/contact"}
            ]
          }
        `}
        </script>
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Contact SREW Projects - Crushing & Screening Plant Manufacturer WORKS - Request RFQ & Consultation",
            "url": "https://srewprojects.com/contact",
            "dateModified": "2026-05-21"
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
                <h1 className="fw-extrabold text-primary-ultra">Contact Our Team</h1>
                <p className="lead mt-3 mb-0" style={{ maxWidth: '800px', color: '#555' }}>
                  Request an RFQ quote, consult on equipment engineering, or request immediate technical field support.
                </p>
                <nav aria-label="Breadcrumb" className="mt-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Contact Us</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Coordinates Section */}
        <section className="py-5" aria-label="Contact coordinates and form">
          <div className="container py-3">
            <div className="row g-5">
              
              {/* Form Column */}
              <div className="col-lg-7">
                <ScrollReveal>
                  <div className="card border-0 shadow-sm p-4 p-md-5 rounded-lg bg-light-alt">
                    <h2 className="text-primary-ultra h3 mb-2">Request an RFQ Quote</h2>
                    <p className="small text-muted mb-4">Complete our engineering inquiry form and our sales representatives will contact you within 24 hours.</p>
                    
                    {status.text && (
                      <div className={`alert alert-${status.type} d-flex align-items-center gap-2`} role="alert">
                        {status.type === 'info' && <i className="fas fa-spinner fa-spin"></i>}
                        <span>{status.text}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label small fw-bold">Your Name <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={submitting}
                          placeholder="e.g. Rajesh Kumar"
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label small fw-bold">Business Email <span className="text-danger">*</span></label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={submitting}
                          placeholder="e.g. rajesh@infrastructure.com"
                        />
                      </div>

                      <div className="col-md-12">
                        <label htmlFor="phone" className="form-label small fw-bold">Mobile Number (10-Digit) <span className="text-muted">(Optional)</span></label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          pattern="[0-9]{10}"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={submitting}
                          placeholder="e.g. 9876543210"
                        />
                      </div>

                      <div className="col-md-12">
                        <label htmlFor="subject" className="form-label small fw-bold">Subject / Plant Equipment Interest <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          disabled={submitting}
                          placeholder="e.g. Inquiry about 200 TPH Primary Jaw Crusher"
                        />
                      </div>

                      <div className="col-md-12">
                        <label htmlFor="message" className="form-label small fw-bold">Inquiry Details / Material Type &amp; TPH <span className="text-danger">*</span></label>
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          disabled={submitting}
                          placeholder="Please provide details about your feed rock material, target sizing output, and capacity (TPH) requirements..."
                        ></textarea>
                      </div>

                      <div className="col-md-12 mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-curved btn-lg w-100"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="40 20" />
                              </svg>
                              Submitting Inquiry...
                            </span>
                          ) : 'Submit Engineering Request'}
                        </button>
                      </div>
                    </form>
                  </div>
                </ScrollReveal>
              </div>

              {/* Coordinates Column */}
              <div className="col-lg-5">
                <ScrollReveal delay={200}>
                  <div className="mb-5">
                    <h2 className="text-primary-ultra h3 mb-4">Contact Information</h2>
                    
                    <div className="d-flex align-items-start mb-4">
                      <div className="text-primary me-3 fs-3"><i className="fas fa-map-marker-alt"></i></div>
                      <div>
                        <h3 className="h6 fw-bold mb-1">Corporate Manufacturing Plant</h3>
                        <p className="small text-muted mb-0">11-125, IDA Jeedimetla, Dulapally, Hyderabad, Telangana, India 500100</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-4">
                      <div className="text-primary me-3 fs-3"><i className="fas fa-phone-alt"></i></div>
                      <div>
                        <h3 className="h6 fw-bold mb-1">Direct Sales Hotline</h3>
                        <p className="small text-muted mb-0">
                          <a href="tel:+918790759460" className="text-decoration-none text-muted">+91 8790759460</a> / <a href="tel:+919533333333" className="text-decoration-none text-muted">+91 95333 33333</a>
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-4">
                      <div className="text-primary me-3 fs-3"><i className="fas fa-envelope"></i></div>
                      <div>
                        <h3 className="h6 fw-bold mb-1">Official Communications</h3>
                        <p className="small text-muted mb-0">
                          <a href="mailto:srenggworks2016@gmail.com" className="text-decoration-none text-muted">srenggworks2016@gmail.com</a>
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-4 p-3 bg-light rounded border" style={{ borderLeft: '4px solid #4285F4' }}>
                      <div className="me-3 fs-1 text-primary"><i className="fab fa-google"></i></div>
                      <div className="flex-grow-1">
                        <h3 className="h6 fw-bold mb-1 text-primary-ultra">Google Business Rating</h3>
                        <div className="d-flex align-items-center gap-1 mb-1 text-warning small">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <span className="text-muted ms-1 small fw-medium">5.0 Star Rated</span>
                        </div>
                        <a 
                          href="https://share.google/hDqCzUIV3UuE8WGLg" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary btn-sm btn-curved d-inline-flex align-items-center mt-1"
                          style={{
                            background: '#4285F4',
                            borderColor: '#4285F4',
                          }}
                        >
                          <i className="fas fa-pen-alt me-2"></i> Review Us on Google
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Map Embed */}
                  <div className="rounded overflow-hidden shadow-sm border" style={{ height: '300px' }}>
                    <iframe
                      title="SREW Projects - Crushing & Screening Plant Manufacturer WORKS Office &amp; Plant Location Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3804.8251347076595!2d78.43521257597143!3d17.515865299105436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb906cf2c78a0d%3A0xe54fb7a2e8c281df!2sS%20R%20Engineering%20Works!5e0!3m2!1sen!2sin!4v1712490000000!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
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

export default Contact;
