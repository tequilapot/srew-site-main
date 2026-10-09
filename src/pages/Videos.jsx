import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';

export const Videos = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState('');
  const [activeVideoTitle, setActiveVideoTitle] = useState('');

  const openVideo = (url, title) => {
    setActiveVideoUrl(url);
    setActiveVideoTitle(title);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setActiveVideoUrl('');
    setActiveVideoTitle('');
    setModalOpen(false);
    document.body.style.overflow = '';
  };

  const videoList = [
    {
      title: "SREW Roller Crusher | Heavy-Duty Industrial Roll Crusher",
      duration: "0:47",
      description: "Heavy-duty roller crusher for coal, clay and industrial crushing applications.",
      thumbnail: "/images/Products/srew-roller-crusher.jpg",
      url: "https://www.youtube.com/embed/ECjllQYxTMk?si=FVavcdGX2A-cTGWz&autoplay=1"
    },
    {
      title: "Jaw Crusher Plant | Primary Rock Breaking",
      duration: "2:12",
      description: "Primary jaw crusher plant designed for high-capacity rock crushing.",
      thumbnail: "/images/Products/srew-jaw-crusher.jpg",
      url: "https://www.youtube.com/embed/s8r6FAvzzgo?si=-zSm_Mnkld2s9F5W&autoplay=1"
    },
    {
      title: "Turnkey Crushing Screening & Washing Plant",
      duration: "1:31",
      description: "Complete turnkey crushing, screening and washing plant operation.",
      thumbnail: "/images/Products/srew-cone-crusher-plant.png",
      url: "https://www.youtube.com/embed/cpBA2UDgPgI?si=melBAJFqJ6PweRaC&autoplay=1"
    },
    {
      title: "Turnkey Crushing & Screening Plant",
      duration: "1:03",
      description: "Integrated crushing and screening plant with optimized performance.",
      thumbnail: "/images/Products/srew-mobile-crushing-plant.png",
      url: "https://www.youtube.com/embed/a15meWcHKHM?si=YyK7SELL0xGARERQ&autoplay=1"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Plant Operations &amp; Equipment Videos - SREW Projects</title>
        <meta name="description" content="Watch high-capacity SREW crushing plants, screening systems, roller crushers, and M-Sand manufacturing plants in real-world operations across India." />
        <link rel="canonical" href="https://srewprojects.com/videos" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://srewprojects.com/videos" />
        <meta property="og:title" content="Plant Operations &amp; Equipment Videos - SREW Projects" />
        <meta property="og:description" content="Watch high-capacity SREW crushing plants, screening systems, roller crushers, and M-Sand manufacturing plants in real-world operations across India." />
        <meta property="og:image" content="https://srewprojects.com/images/Projects/project1.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="IN-TG" />
        <meta name="geo.placename" content="Hyderabad, Telangana, India" />
        <meta name="geo.position" content="17.5158653;78.4377875" />
        <meta name="ICBM" content="17.5158653, 78.4377875" />
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "SREW Plant Operations & Equipment Videos",
            "description": "Watch real-world equipment operation and plant setups for primary jaw crushers, heavy-duty roller crushers, M-sand washing, and complete turnkey aggregate systems.",
            "url": "https://srewprojects.com/videos"
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
              {"@type": "ListItem", "position": 2, "name": "Videos", "item": "https://srewprojects.com/videos"}
            ]
          }
        `}
        </script>
      </Helmet>

      <main id="main-content" role="main">
        {/* Page Header */}
        <section className="page-header py-5 bg-light" aria-label="Page header">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8 text-center text-lg-start">
                <h1 className="fw-extrabold text-white" style={{ color: '#ffffff !important' }}>Plant Operations &amp; Equipment Videos</h1>
                <p className="lead mt-3 mb-0" style={{ maxWidth: '800px', color: 'rgba(255,255,255,0.95)' }}>
                  Watch SREW crushing, screening, M-Sand and material handling systems operating in real-world projects.
                </p>
                <nav aria-label="Breadcrumb" className="mt-4">
                  <ol className="breadcrumb justify-content-center justify-content-lg-start">
                    <li className="breadcrumb-item"><Link to="/" className="text-white opacity-75">Home</Link></li>
                    <li className="breadcrumb-item active text-white" aria-current="page">Videos</li>
                  </ol>
                </nav>
              </div>
              <div className="col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
                <Link to="/contact" className="btn btn-warning btn-lg btn-curved px-4 py-2" style={{ fontWeight: 600, borderRadius: '30px' }}>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Video Grid Section */}
        <section className="py-5" aria-label="Equipment operations gallery" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container py-4">
            <div className="row g-4">
              {videoList.map((vid, idx) => (
                <div className="col-lg-4 col-md-6" key={idx}>
                  <ScrollReveal>
                    <div 
                      className="video-card card h-100 border-0 overflow-hidden" 
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => openVideo(vid.url, vid.title)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px) scale(1.01)';
                        e.currentTarget.style.boxShadow = '0 15px 30px rgba(30, 96, 179, 0.12)';
                        const img = e.currentTarget.querySelector('img');
                        if (img) img.style.transform = 'scale(1.06)';
                        const btn = e.currentTarget.querySelector('.play-btn-circle');
                        if (btn) {
                          btn.style.background = '#FFC107';
                          btn.style.color = '#1E60B3';
                          btn.style.transform = 'scale(1.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                        const img = e.currentTarget.querySelector('img');
                        if (img) img.style.transform = 'none';
                        const btn = e.currentTarget.querySelector('.play-btn-circle');
                        if (btn) {
                          btn.style.background = 'rgba(30, 96, 179, 0.9)';
                          btn.style.color = '#ffffff';
                          btn.style.transform = 'none';
                        }
                      }}
                    >
                      <div className="position-relative overflow-hidden" style={{ height: '220px', background: '#000' }}>
                        <img 
                          src={vid.thumbnail} 
                          alt={vid.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                          loading="lazy"
                        />
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.3)', transition: 'background 0.3s ease' }}>
                          <div className="play-btn-circle" style={{ width: '60px', height: '60px', background: 'rgba(30, 96, 179, 0.9)', borderRadius: '50%', color: '#ffffff', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                            <i className="fas fa-play" style={{ fontSize: '1.25rem', marginLeft: '3px' }}></i>
                          </div>
                        </div>
                        <span className="position-absolute bottom-0 end-0 m-3 px-2 py-1 bg-dark text-white rounded font-weight-bold" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px', background: 'rgba(0, 0, 0, 0.85)' }}>
                          {vid.duration}
                        </span>
                      </div>
                      <div className="card-body p-4 d-flex flex-column text-start">
                        <h3 className="h5 fw-bold text-dark mb-2">{vid.title}</h3>
                        <p className="text-muted small flex-grow-1">{vid.description}</p>
                        <button className="btn btn-outline-primary btn-curved w-100 mt-3" style={{ borderRadius: '30px', fontWeight: 600 }}>Watch Video</button>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video CTA Section */}
        <section className="cta-section py-5 text-white" aria-label="Call to action" style={{ background: 'linear-gradient(135deg, #1E60B3 0%, #1d528f 100%)' }}>
          <div className="container text-center py-4">
            <h2 className="display-6 fw-bold mb-3 text-white">Need a customized crushing or screening solution?</h2>
            <p className="lead mb-4" style={{ opacity: 0.9, maxWidth: '700px', margin: '0 auto 2rem', color: 'rgba(255,255,255,0.95)' }}>
              Our engineering team can help design the right plant for your requirement.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/contact" className="btn btn-warning btn-lg btn-curved px-4 py-2" style={{ borderRadius: '30px', fontWeight: 600 }}>
                Talk To Our Experts
              </Link>
              <a href="https://wa.me/918790759460" target="_blank" rel="noopener noreferrer" className="btn btn-success btn-lg btn-curved px-4 py-2" style={{ borderRadius: '30px', fontWeight: 600 }}>
                <i className="fab fa-whatsapp me-2"></i> WhatsApp Us
              </a>
            </div>
          </div>
        </section>

        {/* Video Lightbox Modal */}
        {modalOpen && (
          <div 
            className="video-lightbox-overlay active" 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(8, 20, 38, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              transition: 'opacity 0.3s ease'
            }}
            onClick={closeVideo}
          >
            <div 
              className="video-lightbox-content" 
              style={{
                position: 'relative',
                width: '90%',
                maxWidth: '900px',
                background: '#081426',
                borderRadius: '16px',
                padding: '30px 20px 20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="video-lightbox-close" 
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '0',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '2rem',
                  cursor: 'pointer'
                }}
                onClick={closeVideo}
              >
                ✕
              </button>
              <h4 className="video-lightbox-title" style={{ color: '#ffffff', fontWeight: 700, marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                {activeVideoTitle}
              </h4>
              <div className="video-iframe-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                <iframe 
                  id="videoLightboxIframe" 
                  src={activeVideoUrl} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Videos;
