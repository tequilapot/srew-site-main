/**
 * SREW Forms Engine v3.0
 * (c) S R ENGG WORKS - Proprietary
 * HubSpot integration with toast notifications & validation
 */
;(function(w,d){'use strict';
console.log("[SREW Debug] forms.js is executing...");


const _qs=(s,c)=>(c||d).querySelector(s);
const _id=s=>d.getElementById(s);

/* Toast helper - uses global from main.js */
function toast(msg,type){
    if(typeof w._srew_toast==='function'){
        w._srew_toast(msg,type);
    }else{
        /* Fallback if main.js hasn't loaded yet */
        const c=d.createElement('div');
        c.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#fff;padding:16px 24px;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,0.15);font-size:14px;max-width:360px;animation:toastIn 0.5s ease';
        c.textContent=msg;
        d.body.appendChild(c);
        setTimeout(function(){c.remove()},4000);
    }
}

/* Real-time field validation */
function validateField(input){
    const value=input.value.trim();
    const type=input.type;
    let valid=true;

    if(input.required&&!value){
        valid=false;
    }else if(type==='email'&&value){
        valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }else if(type==='tel'&&value&&input.pattern){
        valid=new RegExp(input.pattern).test(value);
    }

    input.classList.toggle('is-valid',valid&&value);
    input.classList.toggle('is-invalid',!valid&&(input.dataset.touched==='true'));
    return valid;
}

function setupValidation(form){
    const inputs=form.querySelectorAll('input, textarea, select');
    inputs.forEach(function(input){
        input.addEventListener('blur',function(){
            this.dataset.touched='true';
            validateField(this);
        });
        input.addEventListener('input',function(){
            if(this.dataset.touched==='true'){
                validateField(this);
            }
        });
    });
}

/* Button loading state */
function setButtonLoading(btn,loading){
    if(loading){
        btn.dataset.originalText=btn.innerHTML;
        btn.innerHTML='<span style="display:inline-flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" style="animation:spin 1s linear infinite"><style>@keyframes spin{to{transform:rotate(360deg)}}</style><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="40 20"/></svg> Processing...</span>';
        btn.disabled=true;
    }else{
        btn.innerHTML=btn.dataset.originalText||'Submit';
        btn.disabled=false;
    }
}



/* Google Sheets submission */
function submitToGoogleSheet(data){
    const url = 'https://script.google.com/macros/s/AKfycbwpwtDVKM85IDFdH_IC13Ly-zE0MP3Dx9J7e8NrDZ0I2R-oGUdCUlNcabUEIfFUFVYrXw/exec';
    const formData = new URLSearchParams();
    for(const key in data){
        formData.append(key, data[key]);
    }
    return fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    });
}

/* ──────── BROCHURE FORM ──────── */
function initBrochureForm(){
    console.log("[SREW Debug] initBrochureForm() called.");
    const form=_id('brochureForm');
    if(!form) {
        console.log("[SREW Debug] brochureForm NOT found on this page.");
        return;
    }
    console.log("[SREW Debug] brochureForm found:", form);

    setupValidation(form);

    form.addEventListener('submit',function(e){
        console.log("[SREW Debug] brochureForm submit triggered!");
        e.preventDefault();

        const name=_id('brochureName').value.trim();
        const phone=_id('brochurePhone').value.trim();
        const requirement=_id('brochureRequirement') ? _id('brochureRequirement').value.trim() : '';

        if(!name||!phone||!requirement){
            toast('Please fill in all required fields.','error');
            return;
        }

        if(!/^[0-9]{10}$/.test(phone)){
            toast('Please enter a valid 10-digit mobile number.','error');
            return;
        }

        const submitBtn=form.querySelector('button[type="submit"]');
        if(submitBtn) setButtonLoading(submitBtn, true);

        // Send to Google Sheets first, then show success state in the modal
        const gsData = {
            name: name,
            email: phone,          // Apps Script maps email -> Column C (labeled Phone)
            phone: '',             // Apps Script maps phone -> Column D (labeled Email)
            subject: 'Brochure Request',
            message: '',           // Keep Message column clear for brochure request
            requirement: requirement // Apps Script maps requirement -> Column G (labeled Requirement)
        };

        submitToGoogleSheet(gsData)
        .then(function(){
            if(submitBtn) setButtonLoading(submitBtn, false);

            // Hide the standard form grid and reveal the premium success pane
            const grid=_id('brochureGrid');
            const successPane=_id('brochureSuccessPane');
            if(grid) grid.style.display='none';
            if(successPane) successPane.style.display='flex';

            /* Open PDF using hidden anchor tag to prevent adblock/popup blockers from blocking it */
            const pdfUrl=new URL('brochures/srew-company-profile.pdf',w.location.href).href;
            const link = d.createElement('a');
            link.href = pdfUrl;
            link.download = 'SREW-Company-Profile.pdf'; // Forces a download natively
            link.target = '_blank';
            d.body.appendChild(link);
            link.click();
            d.body.removeChild(link);

            toast('Brochure download started!','success');
            form.reset();
            form.querySelectorAll('.is-valid,.is-invalid').forEach(function(el){
                el.classList.remove('is-valid','is-invalid');
            });
        })
        .catch(function(){
            if(submitBtn) setButtonLoading(submitBtn, false);
            toast('Failed to capture lead. Please try again.','error');
        });
    });
}

/* ──────── CONTACT FORM ──────── */
function initContactForm(){
    const form=_id('contactForm');
    const msgs=_id('form-messages');
    if(!form)return;

    setupValidation(form);

    form.addEventListener('submit',function(e){
        e.preventDefault();

        const name=(form.querySelector('[name="name"]')||{}).value||'';
        const email=(form.querySelector('[name="email"]')||{}).value||'';
        const subject=(form.querySelector('[name="subject"]')||{}).value||'';
        const message=(form.querySelector('[name="message"]')||{}).value||'';
        const phone=(form.querySelector('[name="phone"]')||{}).value||'';

        if(!name||!email||!subject||!message){
            if(msgs)msgs.innerHTML='<div class="alert alert-danger" role="alert">Please fill out all required fields.</div>';
            toast('Please fill out all required fields.','error');
            return;
        }

        if(msgs)msgs.innerHTML='<div class="alert alert-info" role="alert"><span style="display:inline-flex;align-items:center;gap:8px"><svg width="14" height="14" viewBox="0 0 24 24" style="animation:spin 1s linear infinite"><style>@keyframes spin{to{transform:rotate(360deg)}}</style><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="40 20"/></svg> Sending your message...</span></div>';

        // Send to Google Sheets
        const gsData = {
            name: name,
            email: phone,          // Apps Script maps email -> Column C (labeled Phone)
            phone: email,          // Apps Script maps phone -> Column D (labeled Email)
            subject: subject,
            message: message,      // Apps Script maps message -> Column F (labeled Message)
            requirement: ''        // Keep Requirement column clear for contact form
        };
        submitToGoogleSheet(gsData)
        .then(function(){
            // Trigger Google Ads conversion event if available
            if (typeof w.gtag_report_conversion === 'function') {
                w.gtag_report_conversion();
            }
            if(msgs)msgs.innerHTML='<div class="alert alert-success" role="alert">✓ Thank you! Redirecting to thank you page...</div>';
            toast('Message sent successfully!','success');
            form.reset();
            form.querySelectorAll('.is-valid,.is-invalid').forEach(function(el){
                el.classList.remove('is-valid','is-invalid');
            });
            /* Redirect to the dedicated premium thank you page after 1.5 seconds */
            setTimeout(function(){
                w.location.href = 'thankyou.html';
            }, 1500);
        })
        .catch(function(){
            if(msgs)msgs.innerHTML='<div class="alert alert-danger" role="alert">There was an error sending your message. Please try again.</div>';
            toast('Failed to send. Please try again.','error');
            /* Auto-dismiss message after 5 seconds */
            if(msgs) setTimeout(function(){ msgs.innerHTML=''; }, 5000);
        });
    });
}

/* ──────── URL PARAM PRE-FILL ──────── */
function initUrlPrefill(){
    const params=new URLSearchParams(w.location.search);
    const inquiry=params.get('inquiry')||params.get('product')||params.get('project_inquiry')||params.get('industry');
    const field=_id('contactSubject');
    if(inquiry&&field){
        field.value='Inquiry about '+decodeURIComponent(inquiry);
    }
}

/* ──────── BOOT ──────── */
function boot(){
    initBrochureForm();
    initContactForm();
    initUrlPrefill();
}

if(d.readyState==='loading'){
    d.addEventListener('DOMContentLoaded',boot);
}else{
    boot();
}

})(window,document);