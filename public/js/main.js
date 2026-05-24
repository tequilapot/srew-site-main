/**
 * SREW Core Engine v3.0
 * (c) S R ENGG WORKS - Proprietary
 * Advanced scroll animations, counter engine, navbar transitions
 */
;(function(w,d){'use strict';
console.log("[SREW Debug] main.js is executing...");


/* ──────────────────────────────────────────────
   UTILITY HELPERS
   ────────────────────────────────────────────── */
const _qs=(s,c)=>(c||d).querySelector(s);
const _qa=(s,c)=>(c||d).querySelectorAll(s);
const _id=s=>d.getElementById(s);
const _on=(el,ev,fn,opts)=>el&&el.addEventListener(ev,fn,opts);
const _raf=w.requestAnimationFrame||function(cb){return setTimeout(cb,16)};
const _throttle=(fn,ms)=>{let t=0;return function(...a){const n=Date.now();if(n-t>=ms){t=n;fn.apply(this,a)}}};
const _debounce=(fn,ms)=>{let t;return function(...a){clearTimeout(t);t=setTimeout(()=>fn.apply(this,a),ms)}};

/* ──────────────────────────────────────────────
   NAVBAR SCROLL EFFECT
   ────────────────────────────────────────────── */
function initNavbar(){
    const nav=_qs('.navbar.fixed-top');
    if(!nav)return;
    const scrollThreshold=60;
    let ticking=false;
    function updateNavbar(){
        const sy=w.scrollY||w.pageYOffset;
        nav.classList.toggle('scrolled',sy>scrollThreshold);
        ticking=false;
    }
    _on(w,'scroll',function(){
        if(!ticking){_raf(updateNavbar);ticking=true}
    },{passive:true});
    updateNavbar();

    // Close mobile menu on link click (except dropdown toggles and mega triggers)
    _qa('.navbar-nav .nav-link:not(.dropdown-toggle):not(.mega-nav-trigger), .navbar-nav .dropdown-item, .mega-item').forEach(function(link){
        _on(link,'click',function(){
            console.log("[JS main.js click listener debug] Link clicked: Tag=" + link.tagName + " Text=" + link.innerText.split('\n')[0] + " Classes=" + link.className);
            const collapse=_qs('.navbar-collapse');
            if(collapse&&collapse.classList.contains('show')){
                const bsCollapse=bootstrap.Collapse.getInstance(collapse);
                if(bsCollapse)bsCollapse.hide();
            }
        });
    });
}

function initNavbarDismissOutside(){
    _on(d,'click',function(ev){
        const navbar=_qs('#navbarNav');
        const toggler=_qs('.navbar-toggler');
        if(navbar&&navbar.classList.contains('show')&&toggler&&!navbar.contains(ev.target)&&!toggler.contains(ev.target)){
            toggler.click();
        }
    });
}

/* ──────────────────────────────────────────────
   SCROLL REVEAL - IntersectionObserver
   ────────────────────────────────────────────── */
function initRevealAnimations(){
    if(!('IntersectionObserver' in w))return;
    const elements=_qa('.reveal, .stagger-container');
    if(!elements.length)return;

    const observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                // Optional: add a slight delay for children if it's a stagger container
                if(entry.target.classList.contains('stagger-container')){
                    Array.from(entry.target.children).forEach(function(child, i){
                        child.style.transitionDelay = (i * 100) + 'ms';
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    },{
        threshold:0.15,
        rootMargin:'0px 0px -50px 0px'
    });

    elements.forEach(function(el){observer.observe(el)});
}

/* ──────────────────────────────────────────────
   ANIMATED COUNTER - Count-Up Engine
   ────────────────────────────────────────────── */
function initCounters(){
    const counters=_qa('[data-counter]');
    if(!counters.length||!('IntersectionObserver' in w))return;

    function animateCounter(el){
        const target=parseInt(el.getAttribute('data-counter'),10);
        const suffix=el.getAttribute('data-suffix')||'';
        const duration=1800;
        const startTime=performance.now();

        function easeOutQuart(t){return 1-Math.pow(1-t,4)}

        function tick(now){
            const elapsed=now-startTime;
            const progress=Math.min(elapsed/duration,1);
            const value=Math.floor(easeOutQuart(progress)*target);
            el.textContent=value+suffix;
            if(progress<1)_raf(tick);
            else el.textContent=target+suffix;
        }
        _raf(tick);
    }

    const observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    },{threshold:0.4});

    counters.forEach(function(el){observer.observe(el)});
}

/* ──────────────────────────────────────────────
   HERO - Cinematic Entry + Scroll Fade
   ────────────────────────────────────────────── */
function initHero(){
    const hero=_qs('.hero-section');
    if(!hero)return;

    // Trigger cinematic scale on load
    setTimeout(function(){hero.classList.add('loaded')},100);

    const heroImg=_qs('.hero-image',hero);
    const heroContent=_qs('.hero-content',hero);
    if(!heroImg)return;

    // Subtle parallax + content fade on scroll
    _on(w,'scroll',_throttle(function(){
        const rect=hero.getBoundingClientRect();
        if(rect.bottom>0){
            const scrollRatio=Math.min(1,Math.max(0,-rect.top/(hero.offsetHeight*0.5)));
            // Gentle image parallax
            const imgScroll=-rect.top*0.15;
            heroImg.style.transform='scale(1.02) translateY('+imgScroll+'px)';
            // Fade out hero content as user scrolls
            if(heroContent){
                heroContent.style.opacity=1-scrollRatio*0.8;
                heroContent.style.transform='translateY('+(scrollRatio*40)+'px)';
            }
        }
    },16),{passive:true});
}

/* ──────────────────────────────────────────────
   SMOOTH SCROLL - Enhanced
   ────────────────────────────────────────────── */
function initSmoothScroll(){
    _qa('a[href^="#"]').forEach(function(anchor){
        _on(anchor,'click',function(e){
            const href=this.getAttribute('href');
            if(!href||href==='#')return void e.preventDefault();
            try{
                const target=_qs(href);
                if(target){
                    e.preventDefault();
                    const navH=_qs('.navbar.fixed-top');
                    const offset=navH?navH.offsetHeight:72;
                    const y=target.getBoundingClientRect().top+w.scrollY-offset;
                    w.scrollTo({top:y,behavior:'smooth'});
                }
            }catch(err){}
        });
    });
}

/* ──────────────────────────────────────────────
   ACTIVE NAV LINK
   ────────────────────────────────────────────── */
function initActiveNav(){
    const loc=w.location.href;
    const links=_qa('.navbar-nav .nav-link');
    let homeActive=true;

    links.forEach(function(link){
        link.classList.remove('active');
        if(link.href===loc){
            link.classList.add('active');
            homeActive=false;
        }else if(loc.endsWith('/')&&link.getAttribute('href')==='index.html'&&homeActive){
            link.classList.add('active');
            homeActive=false;
        }
    });
    if(homeActive&&(loc.endsWith('/index.html')||loc.endsWith('/'))){
        const h=_qs('.navbar-nav .nav-link[href="index.html"]');
        if(h)h.classList.add('active');
    }
}

/* ──────────────────────────────────────────────
   DYNAMIC YEAR
   ────────────────────────────────────────────── */
function initYear(){
    const y=new Date().getFullYear();
    _qa('#currentYear,#currentYearContact').forEach(function(el){el.textContent=y});
}

/* ──────────────────────────────────────────────
   LAZY LOAD IMAGES
   ────────────────────────────────────────────── */
function initLazyImages(){
    if(!('IntersectionObserver' in w))return;
    const imgs=_qa('img[data-src]');
    if(!imgs.length)return;

    const io=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                const img=entry.target;
                img.src=img.getAttribute('data-src');
                img.removeAttribute('data-src');
                io.unobserve(img);
            }
        });
    },{rootMargin:'200px'});

    imgs.forEach(function(img){io.observe(img)});
}

/* ──────────────────────────────────────────────
   AUTO-INJECT REVEAL CLASSES
   ────────────────────────────────────────────── */
function injectReveals(){
    // Section headers — skip #products (no animation wanted there)
    _qa('.section-header').forEach(function(el){
        if(el.closest('#products')) return;
        if(!el.classList.contains('reveal')){
            el.classList.add('reveal');
        }
    });

    // Feature items
    _qa('.feature-item').forEach(function(el){
        if(!el.classList.contains('reveal')){
            el.classList.add('reveal','reveal-scale');
        }
    });

    // Cards
    _qa('.product-card, .project-card').forEach(function(el,i){
        if(el.closest('#products')) return; // Skip animations in the #products section (requested to be removed)
        if(!el.classList.contains('reveal')){
            el.classList.add('reveal');
            el.style.transitionDelay=(i%3)*120+'ms';
        }
    });

    // Stat boxes
    _qa('.stat-box').forEach(function(el,i){
        if(!el.classList.contains('reveal')){
            el.classList.add('reveal');
            el.style.transitionDelay=i*150+'ms';
        }
    });

    // About section content
    _qa('.about-section .col-lg-6').forEach(function(el,i){
        if(!el.classList.contains('reveal')){
            el.classList.add('reveal');
            el.classList.add(i===0?'reveal-left':'reveal-right');
        }
    });

    // CTA section
    _qa('.cta-section .row').forEach(function(el){
        if(!el.classList.contains('reveal')){
            el.classList.add('reveal');
        }
    });

    // Inner page sections
    _qa('.product-section .row, .project-section .row, .industry-section .row').forEach(function(el){
        if(!el.classList.contains('reveal')){
            el.classList.add('reveal');
        }
    });

    // Cards on about and other pages
    _qa('.card.h-100').forEach(function(el,i){
        if(!el.classList.contains('reveal')){
            el.classList.add('reveal','reveal-scale');
            el.style.transitionDelay=(i%4)*100+'ms';
        }
    });

    // Spare parts categories
    _qa('.spare-parts-category').forEach(function(el,i){
        if(!el.classList.contains('reveal')){
            el.classList.add('reveal');
            el.style.transitionDelay=i*80+'ms';
        }
    });
}

/* ──────────────────────────────────────────────
   TOAST NOTIFICATIONS
   ────────────────────────────────────────────── */
w._srew_toast=function(message,type){
    type=type||'info';
    let container=_qs('.toast-container');
    if(!container){
        container=d.createElement('div');
        container.className='toast-container';
        d.body.appendChild(container);
    }
    const icons={success:'✓',error:'✕',info:'ℹ'};
    const toast=d.createElement('div');
    toast.className='toast-notification '+type;
    toast.innerHTML='<strong>'+((icons[type])||'ℹ')+'</strong> <span>'+message+'</span>';
    container.appendChild(toast);

    setTimeout(function(){
        toast.classList.add('hiding');
        setTimeout(function(){toast.remove()},500);
    },4000);
};

/* ──────────────────────────────────────────────
   BROCHURE MODAL (home)
   ────────────────────────────────────────────── */
function initBrochureModal(){
    console.log("[SREW Debug] initBrochureModal() called.");
    const overlay = _id('brochureOverlay');
    const popup = _id('brochurePopup');
    const cta = _id('hero-cta-brochure');
    const closeBtn = _id('brochureCloseBtn');
    const okBtn = _id('brochureSuccessOkBtn');
    const grid = _id('brochureGrid');
    const successPane = _id('brochureSuccessPane');

    function openPDF(){
        const pdfUrl = new URL('brochures/srew-company-profile.pdf', window.location.href).href;
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'SREW-Company-Profile.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if(typeof window._srew_toast === 'function') {
            window._srew_toast('Downloading brochure.', 'success');
        }
    }

    function openModal() {
        if (!overlay || !popup) {
            // Graceful fallback if modal markup is not present (e.g. on other pages)
            openPDF();
            return;
        }
        // Reset layout display styles before showing
        if (grid) grid.style.display = '';
        if (successPane) successPane.style.display = 'none';

        overlay.classList.add('active');
        popup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        if (!overlay || !popup) return;
        overlay.classList.remove('active');
        popup.classList.remove('active');
        document.body.style.overflow = '';

        // Wait for visual transition to complete before resetting styles & fields
        setTimeout(function(){
            if (grid) grid.style.display = '';
            if (successPane) successPane.style.display = 'none';
            const form = _id('brochureForm');
            if (form) {
                form.reset();
                form.querySelectorAll('.is-valid,.is-invalid').forEach(function(el){
                    el.classList.remove('is-valid','is-invalid');
                });
            }
        }, 400);
    }

    // Expose helpers globally so forms.js can invoke them
    window.openBrochureModal = openModal;
    window.closeBrochureModal = closeModal;

    if (cta) {
        console.log("[SREW Debug] brochure CTA button found:", cta);
        _on(cta, 'click', function(e) {
            console.log("[SREW Debug] brochure CTA button clicked!");
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    }

    _qa('[data-brochure-trigger]').forEach(function(btn) {
        _on(btn, 'click', function(e) {
            e.preventDefault();
            openModal();
        });
    });

    if (closeBtn) {
        _on(closeBtn, 'click', function(e) {
            e.preventDefault();
            closeModal();
        });
    }

    if (okBtn) {
        _on(okBtn, 'click', function(e) {
            e.preventDefault();
            closeModal();
        });
    }

    if (overlay) {
        _on(overlay, 'click', function(e) {
            closeModal();
        });
    }

    // Escape key closes the modal
    _on(document, 'keydown', function(e) {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ──────────────────────────────────────────────
   MEGA DROPDOWN MENU
   ────────────────────────────────────────────── */
function initMegaMenu(){
    const items = _qa('.mega-nav-item');
    if(!items.length) return;

    const isMobile = () => w.innerWidth < 992;

    // Create backdrop element for desktop
    let backdrop = _id('megaBackdrop');
    if(!backdrop){
        backdrop = d.createElement('div');
        backdrop.id = 'megaBackdrop';
        backdrop.className = 'mega-backdrop';
        d.body.appendChild(backdrop);
    }

    function openItem(item){
        // Close any other open items first
        items.forEach(function(i){ if(i !== item) closeItem(i); });
        item.classList.add('is-open');
        const trigger = item.querySelector('.mega-nav-trigger');
        if(trigger) trigger.setAttribute('aria-expanded', 'true');
        if(!isMobile()) backdrop.classList.add('active');
    }

    function closeItem(item){
        item.classList.remove('is-open');
        const trigger = item.querySelector('.mega-nav-trigger');
        if(trigger) trigger.setAttribute('aria-expanded', 'false');
    }

    function closeAll(){
        items.forEach(closeItem);
        backdrop.classList.remove('active');
    }

    items.forEach(function(item){
        const trigger = item.querySelector('.mega-nav-trigger');
        const dropdown = item.querySelector('.mega-dropdown');
        if(!trigger || !dropdown) return;

        let leaveTimer;

        // Desktop: hover open
        item.addEventListener('mouseenter', function(){
            if(isMobile()) return;
            clearTimeout(leaveTimer);
            openItem(item);
        });

        item.addEventListener('mouseleave', function(){
            if(isMobile()) return;
            leaveTimer = setTimeout(function(){ closeItem(item); backdrop.classList.remove('active'); }, 120);
        });

        // Desktop & mobile: click/tap the trigger to navigate or toggle
        trigger.addEventListener('click', function(e){
            if(isMobile()){
                // On mobile, toggle the accordion
                e.preventDefault();
                e.stopPropagation();
                const isOpen = item.classList.contains('is-open');
                if(isOpen){
                    closeItem(item);
                } else {
                    openItem(item);
                }
            }
            // On desktop, the link navigates naturally — allow it
        });

        // Keep open when hovering over the dropdown panel itself
        dropdown.addEventListener('mouseenter', function(){
            if(isMobile()) return;
            clearTimeout(leaveTimer);
        });
        dropdown.addEventListener('mouseleave', function(){
            if(isMobile()) return;
            leaveTimer = setTimeout(function(){ closeItem(item); backdrop.classList.remove('active'); }, 120);
        });
    });

    // Backdrop click closes all (desktop)
    backdrop.addEventListener('click', closeAll);

    // Escape key closes all
    _on(d, 'keydown', function(e){
        if(e.key === 'Escape') closeAll();
    });

    // Close when clicking outside on mobile
    _on(d, 'click', function(e){
        if(isMobile()){
            const insideAnyItem = Array.from(items).some(function(item){ return item.contains(e.target); });
            if(!insideAnyItem) closeAll();
        }
    });

    // Close mega menu on window resize to avoid stuck states
    _on(w, 'resize', _debounce(function(){ closeAll(); }, 200));
}

/* ──────────────────────────────────────────────
   WHATSAPP FLOAT - Show after hero/header
   ────────────────────────────────────────────── */
function initWhatsAppFloat(){
    const waBtn=_qs('.whatsapp-float');
    if(!waBtn)return;

    // Find the hero section or page-header to observe
    const hero=_qs('.hero-section')||_qs('.page-header');
    if(!hero){
        // No hero/header — show button after a small scroll (200px)
        _on(w,'scroll',_throttle(function(){
            const sy=w.scrollY||w.pageYOffset;
            waBtn.classList.toggle('visible',sy>200);
        },100),{passive:true});
        // Check initial state
        if((w.scrollY||w.pageYOffset)>200) waBtn.classList.add('visible');
        return;
    }

    // Use IntersectionObserver to detect when hero leaves viewport
    if('IntersectionObserver' in w){
        const observer=new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                // When hero is NOT intersecting (scrolled past), show button
                waBtn.classList.toggle('visible',!entry.isIntersecting);
            });
        },{threshold:0.1});
        observer.observe(hero);
    }else{
        // Fallback for old browsers
        _on(w,'scroll',_throttle(function(){
            const rect=hero.getBoundingClientRect();
            waBtn.classList.toggle('visible',rect.bottom<0);
        },100),{passive:true});
    }
}

/* ──────────────────────────────────────────────
   WHATSAPP GOOGLE ADS CONVERSION TRACKER
   ────────────────────────────────────────────── */
w.gtag_report_conversion = function(url, isBlank) {
    console.log("[SREW Google Ads] gtag_report_conversion called with url:", url, "isBlank:", isBlank);
    var callback = function () {
        if (typeof(url) != 'undefined') {
            if (isBlank) {
                w.open(url, '_blank', 'noopener,noreferrer');
            } else {
                w.location = url;
            }
        }
    };
    if (typeof w.gtag !== 'undefined') {
        w.gtag('event', 'conversion', {
            'send_to': 'AW-17075907493/BJVNCPn1xbIcEKXXts4_',
            'value': 1.0,
            'currency': 'INR',
            'event_callback': callback
        });
    } else {
        console.warn("[SREW Google Ads] window.gtag is not defined. Executing callback directly.");
        callback();
    }
    return false;
};

function initWhatsAppClickTracker() {
    _on(d, 'click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && (link.href.indexOf('wa.me') !== -1 || link.href.indexOf('whatsapp') !== -1)) {
            console.log("[SREW Google Ads] WhatsApp link click detected:", link.href);
            e.preventDefault();
            const isBlank = link.target === '_blank';
            w.gtag_report_conversion(link.href, isBlank);
        }
    });
}

/* ──────────────────────────────────────────────
   BOOT SEQUENCE
   ────────────────────────────────────────────── */
function boot(){
    console.log("[SREW Debug] Booting systems...");
    injectReveals();
    initNavbar();
    initNavbarDismissOutside();
    initMegaMenu();
    initHero();
    initRevealAnimations();
    initCounters();
    initSmoothScroll();
    initActiveNav();
    initYear();
    initLazyImages();
    initWhatsAppFloat();
    initBrochureModal();
    initWhatsAppClickTracker();
}

if(d.readyState==='loading'){
    _on(d,'DOMContentLoaded',boot);
}else{
    boot();
}

})(window,document);