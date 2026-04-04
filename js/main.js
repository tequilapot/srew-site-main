/**
 * SREW Core Engine v3.0
 * (c) S R ENGG WORKS - Proprietary
 * Advanced scroll animations, counter engine, navbar transitions
 */
;(function(w,d){'use strict';

/* ──────────────────────────────────────────────
   UTILITY HELPERS
   ────────────────────────────────────────────── */
const _qs=(s,c)=>(c||d).querySelector(s);
const _qa=(s,c)=>(c||d).querySelectorAll(s);
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

    // Close mobile menu on link click (except dropdown toggles)
    _qa('.navbar-nav .nav-link:not(.dropdown-toggle), .navbar-nav .dropdown-item').forEach(function(link){
        _on(link,'click',function(){
            const collapse=_qs('.navbar-collapse');
            if(collapse&&collapse.classList.contains('show')){
                const bsCollapse=bootstrap.Collapse.getInstance(collapse);
                if(bsCollapse)bsCollapse.hide();
            }
        });
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
                    _qa('> *', entry.target).forEach((child, i) => {
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
    // Section headers
    _qa('.section-header').forEach(function(el){
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
   BOOT SEQUENCE
   ────────────────────────────────────────────── */
function boot(){
    injectReveals();
    initNavbar();
    initHero();
    initRevealAnimations();
    initCounters();
    initSmoothScroll();
    initActiveNav();
    initYear();
    initLazyImages();
    initWhatsAppFloat();
}

if(d.readyState==='loading'){
    _on(d,'DOMContentLoaded',boot);
}else{
    boot();
}

})(window,document);