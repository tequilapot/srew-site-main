/**
 * SREW Forms Engine v3.0
 * (c) S R ENGG WORKS - Proprietary
 * HubSpot integration with toast notifications & validation
 */
;(function(w,d){'use strict';

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

/* HubSpot submission */
function submitToHubSpot(portalId,formId,fields,ctx){
    const data={fields:fields,context:ctx||{pageUri:w.location.href,pageName:d.title}};
    return fetch('https://api.hsforms.com/submissions/v3/integration/submit/'+portalId+'/'+formId,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
    }).then(function(res){
        if(!res.ok)throw new Error('Submission failed');
        return res.json();
    });
}

/* ──────── BROCHURE FORM ──────── */
function initBrochureForm(){
    const form=_id('brochureForm');
    if(!form)return;

    setupValidation(form);

    form.addEventListener('submit',function(e){
        e.preventDefault();

        const name=_id('brochureName').value.trim();
        const email=_id('brochureEmail').value.trim();
        const phone=_id('brochurePhone').value.trim();

        if(!name||!email){
            toast('Please fill in all required fields.','error');
            return;
        }

        const btn=form.querySelector('button[type="submit"]');
        setButtonLoading(btn,true);

        const fields=[
            {name:'firstname',value:name},
            {name:'email',value:email},
            {name:'phone',value:phone},
            {name:'source',value:'Website Brochure Download'}
        ];

        submitToHubSpot('242639779','bb460223-e3af-4172-9c0e-2671eb85b832',fields)
        .then(function(){
            w.open('brochures/srew-company-profile.pdf','_blank');

            const modal=_id('brochureModal');
            if(modal){
                const inst=bootstrap.Modal.getInstance(modal);
                if(inst)inst.hide();else new bootstrap.Modal(modal).hide();
            }

            setTimeout(function(){
                toast('Brochure download started! Check your new tab.','success');
            },300);
            form.reset();
            form.querySelectorAll('.is-valid,.is-invalid').forEach(function(el){
                el.classList.remove('is-valid','is-invalid');
            });
        })
        .catch(function(err){
            toast('Something went wrong. Please try again.','error');
        })
        .finally(function(){
            setButtonLoading(btn,false);
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

        const fields=[
            {name:'firstname',value:name},
            {name:'email',value:email},
            {name:'phone',value:phone},
            {name:'subject',value:subject},
            {name:'message',value:message},
            {name:'source',value:'Website Contact Form'}
        ];

        submitToHubSpot('242639779','bb460223-e3af-4172-9c0e-2671eb85b832',fields)
        .then(function(){
            if(msgs)msgs.innerHTML='<div class="alert alert-success" role="alert">✓ Thank you! Your message has been submitted. We will get back to you soon.</div>';
            toast('Message sent successfully!','success');
            form.reset();
            form.querySelectorAll('.is-valid,.is-invalid').forEach(function(el){
                el.classList.remove('is-valid','is-invalid');
            });
        })
        .catch(function(){
            if(msgs)msgs.innerHTML='<div class="alert alert-danger" role="alert">There was an error sending your message. Please try again.</div>';
            toast('Failed to send. Please try again.','error');
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