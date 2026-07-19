import React, { useEffect, useState } from 'react';

export const WhatsAppFloat = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    const phone = '918790759460';
    const message = encodeURIComponent("Hello SREW team, I would like to inquire about your crushing, screening, and processing equipment solutions.");
    const url = `https://wa.me/${phone}?text=${message}`;
    
    if (typeof window.gtag_report_conversion === 'function') {
      window.gtag_report_conversion(url, true);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={`whatsapp-float ${visible ? 'visible' : ''}`}
      aria-label="Chat with SREW Projects - Crushing & Screening Plant Manufacturer WORKS on WhatsApp"
    >
      <i className="fab fa-whatsapp" aria-hidden="true"></i>
    </a>
  );
};

export default WhatsAppFloat;
