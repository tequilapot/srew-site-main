/**
 * SREW Forms Engine v3.0
 * (c) SREW Projects - Crushing & Screening Plant Manufacturer WORKS - Proprietary
 * HubSpot integration with toast notifications & validation
 */
;(function(w,d){'use strict';
console.log("[SREW Debug] forms.js is executing...");

const ENV = w.SREW_ENV || {
    WEB3FORMS_ACCESS_KEY: 'ddd31534-f1b6-47fb-84a9-7d998299513e',
    WEB3FORMS_API_URL: 'https://api.web3forms.com/submit',
    GOOGLE_SHEETS_CONTACT_URL: 'https://script.google.com/macros/s/AKfycbygp3Zch4TodP1k2VG0xh9zjZPc-NmjvOR-y7wBU24GfoyED4IXhIl8FQ76sv66CyPCuA/exec',
    GOOGLE_SHEETS_GENERAL_URL: 'https://script.google.com/macros/s/AKfycbwpwtDVKM85IDFdH_IC13Ly-zE0MP3Dx9J7e8NrDZ0I2R-oGUdCUlNcabUEIfFUFVYrXw/exec'
};

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
        valid=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
    }else if(type==='tel'&&value){
        const form=input.closest('form');
        const select=form?form.querySelector('.country-code-select'):null;
        const countryCode=select?select.value:'+91';
        const cleanPhone=value.replace(/[^0-9]/g,'');
        if(countryCode==='+91'){
            valid=/^[6-9][0-9]{9}$/.test(cleanPhone);
        }else{
            valid=cleanPhone.length>=7&&cleanPhone.length<=15;
        }
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
    const url = ENV.GOOGLE_SHEETS_GENERAL_URL;
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

        const select=form.querySelector('.country-code-select');
        const countryCode=select?select.value:'+91';
        const cleanPhone=phone.replace(/[^0-9]/g,'');
        let isPhoneValid=false;
        if(countryCode==='+91'){
            isPhoneValid=/^[6-9][0-9]{9}$/.test(cleanPhone);
        }else{
            isPhoneValid=cleanPhone.length>=7&&cleanPhone.length<=15;
        }

        if(!isPhoneValid){
            toast('Please enter a valid mobile number.','error');
            return;
        }

        const submitBtn=form.querySelector('button[type="submit"]');
        if(submitBtn) setButtonLoading(submitBtn, true);

        // Send to Google Sheets first, then show success state in the modal
        const gsData = {
            name: name,
            email: countryCode + ' ' + cleanPhone,          // Apps Script maps email -> Column C (labeled Phone)
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

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if(!emailRegex.test(email.trim())){
            if(msgs)msgs.innerHTML='<div class="alert alert-danger" role="alert">Please enter a valid corporate email address.</div>';
            toast('Please enter a valid corporate email address.','error');
            return;
        }

        const select=form.querySelector('.country-code-select');
        const countryCode=select?select.value:'+91';
        const cleanPhone=phone.replace(/[^0-9]/g,'');

        if(phone.trim()!==''){
            let isPhoneValid=false;
            if(countryCode==='+91'){
                isPhoneValid=/^[6-9][0-9]{9}$/.test(cleanPhone);
            }else{
                isPhoneValid=cleanPhone.length>=7&&cleanPhone.length<=15;
            }
            if(!isPhoneValid){
                if(msgs)msgs.innerHTML='<div class="alert alert-danger" role="alert">Please enter a valid phone number.</div>';
                toast('Please enter a valid phone number.','error');
                return;
            }
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const origBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
        if(submitBtn){
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" style="animation:spin 1s linear infinite"><style>@keyframes spin{to{transform:rotate(360deg)}}</style><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="40 20"/></svg> Sending...</span>';
        }
        if(msgs) msgs.innerHTML = '';

        // Web3Forms payload
        const web3Payload = JSON.stringify({
            access_key: ENV.WEB3FORMS_ACCESS_KEY,
            name: name,
            email: email,
            phone: phone.trim() !== '' ? (countryCode + ' ' + cleanPhone) : 'Not provided',
            subject: subject,
            message: message,
            from_name: 'SREW Contact Form'
        });

        // Send to Google Sheets
        const gsData = {
            name: name,
            email: phone.trim() !== '' ? (countryCode + ' ' + cleanPhone) : '', // Maps to Column C (labeled Phone)
            phone: email,          // Apps Script maps phone -> Column D (labeled Email)
            subject: subject,
            message: message,      // Apps Script maps message -> Column F (labeled Message)
            requirement: ''        // Keep Requirement column clear for contact form
        };

        Promise.all([
            fetch(ENV.WEB3FORMS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: web3Payload
            }).then(function(res) { return res.json(); }),
            submitToGoogleSheet(gsData).catch(function(){})
        ])
        .then(function(){
            if(submitBtn){
                submitBtn.disabled = false;
                submitBtn.innerHTML = origBtnText;
            }
            // Trigger Google Ads conversion event if available
            if (typeof w.gtag_report_conversion === 'function') {
                w.gtag_report_conversion();
            }
            if(msgs) msgs.innerHTML = '';
            toast('✓ Form submitted successfully! We will get back to you shortly.','success');
            form.reset();
            form.querySelectorAll('.is-valid,.is-invalid').forEach(function(el){
                el.classList.remove('is-valid','is-invalid');
            });
        })
        .catch(function(){
            if(submitBtn){
                submitBtn.disabled = false;
                submitBtn.innerHTML = origBtnText;
            }
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

/* ──────── B2B LEAD QUOTE FORM ──────── */
function initLeadQuoteForm() {
    const form = _id('leadQuoteForm');
    if (!form) return;

    setupValidation(form);

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = _id('quoteName').value.trim();
        const email = _id('quoteEmail').value.trim();
        const phone = _id('quotePhone').value.trim();
        const location = _id('quoteLocation').value.trim();
        const capacity = _id('quoteCapacity').value;
        const material = _id('quoteMaterial').value;
        const message = _id('quoteMessage').value.trim();

        if (!name || !email || !phone || !location || !capacity || !material) {
            toast('Please fill out all required fields.', 'error');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if(!emailRegex.test(email)){
            toast('Please enter a valid corporate email address.', 'error');
            return;
        }

        const select = form.querySelector('.country-code-select');
        const countryCode = select ? select.value : '+91';
        const cleanPhone = phone.replace(/[^0-9]/g, '');

        let isPhoneValid = false;
        if(countryCode === '+91') {
            isPhoneValid = /^[6-9][0-9]{9}$/.test(cleanPhone);
        } else {
            isPhoneValid = cleanPhone.length >= 7 && cleanPhone.length <= 15;
        }

        if(!isPhoneValid){
            toast('Please enter a valid phone number.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) setButtonLoading(submitBtn, true);

        const gsData = {
            name: name,
            email: countryCode + ' ' + cleanPhone,                  // Maps to Column C (Phone)
            phone: email,                  // Maps to Column D (Email)
            subject: 'B2B Quote Request: ' + capacity + ' Capacity Plant',
            message: 'Project Location: ' + location + '\nMaterial: ' + material + '\nMessage: ' + message, // Maps to Column F (Message)
            requirement: 'Plant Capacity: ' + capacity + ' | Material: ' + material // Maps to Column G (Requirement)
        };

        submitToGoogleSheet(gsData)
        .then(function() {
            if (submitBtn) setButtonLoading(submitBtn, false);
            // Trigger Google Ads conversion event if available
            if (typeof w.gtag_report_conversion === 'function') {
                w.gtag_report_conversion();
            }
            toast('Quote request submitted successfully!', 'success');
            form.reset();
            form.querySelectorAll('.is-valid,.is-invalid').forEach(function(el) {
                el.classList.remove('is-valid', 'is-invalid');
            });
            setTimeout(function() {
                w.location.href = 'thankyou.html';
            }, 1000);
        })
        .catch(function() {
            if (submitBtn) setButtonLoading(submitBtn, false);
            toast('Failed to submit quote request. Please try again.', 'error');
        });
    });
}

/* ──────── COUNTRY CODE INJECTOR ──────── */
function initCountryCodeSelectors() {
    const phoneInputs = d.querySelectorAll('input[type="tel"], input[name="phone"], #contactPhone, #quotePhone, #brochurePhone');
    if (!phoneInputs.length) return;

    const countries = [
        { code: '+91', name: 'India', flag: '🇮🇳' },
        { code: '+1', name: 'USA/Canada', flag: '🇺🇸' },
        { code: '+44', name: 'UK', flag: '🇬🇧' },
        { code: '+971', name: 'UAE', flag: '🇦🇪' },
        { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
        { code: '+968', name: 'Oman', flag: '🇴🇲' },
        { code: '+974', name: 'Qatar', flag: '🇶🇦' },
        { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
        { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
        { code: '+27', name: 'South Africa', flag: '🇿🇦' },
        { code: '+61', name: 'Australia', flag: '🇦🇺' },
        { code: '+65', name: 'Singapore', flag: '🇸🇬' },
        { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
        { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
        { code: '+977', name: 'Nepal', flag: '🇳🇵' },
        { code: '+880', name: 'Bangladesh', flag: '🇧🇩' }
    ];

    phoneInputs.forEach(function(input) {
        if (input.dataset.countryInjected === 'true') return;

        const select = d.createElement('select');
        select.className = 'form-select country-code-select';
        select.style.cssText = 'width: 105px; flex-shrink: 0; border-radius: 8px; border: 1px solid #ced4da; font-size: 0.88rem; padding: 0.375rem 0.5rem; background-position: right 0.5rem center; cursor: pointer;';
        
        if (input.classList.contains('form-control-premium')) {
            select.className = 'form-control-premium country-code-select';
            select.style.cssText = 'width: 110px; flex-shrink: 0; font-size: 0.9rem; padding: 10px 8px; border-radius: 8px; background-color: #fff; border: 1px solid #e2e8f0; height: 100%; cursor: pointer;';
        }

        countries.forEach(function(c) {
            const opt = d.createElement('option');
            opt.value = c.code;
            opt.textContent = c.flag + ' ' + c.code;
            select.appendChild(opt);
        });

        select.value = '+91';

        const wrapper = d.createElement('div');
        wrapper.className = 'd-flex align-items-stretch w-100 country-code-wrapper';
        wrapper.style.cssText = 'gap: 8px; position: relative;';

        const parent = input.parentNode;
        parent.insertBefore(wrapper, input);
        wrapper.appendChild(select);
        wrapper.appendChild(input);

        input.style.flexGrow = '1';
        input.style.width = 'auto';

        input.dataset.countryInjected = 'true';
    });

    fetch('https://ipapi.co/json/')
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data && data.country_calling_code) {
                const callingCode = data.country_calling_code;
                d.querySelectorAll('.country-code-select').forEach(function(sel) {
                    const exists = Array.from(sel.options).some(function(opt) { return opt.value === callingCode; });
                    if (exists) {
                        sel.value = callingCode;
                    } else {
                        const opt = d.createElement('option');
                        opt.value = callingCode;
                        opt.textContent = (data.country_code || '📍') + ' ' + callingCode;
                        sel.appendChild(opt);
                        sel.value = callingCode;
                    }
                });
            }
        })
        .catch(function(err) {
            console.log('Location detection fallback to +91:', err);
        });
}

/* ──────── BOOT ──────── */
function boot(){
    initCountryCodeSelectors();
    initBrochureForm();
    initContactForm();
    initLeadQuoteForm();
    initUrlPrefill();
}

if(d.readyState==='loading'){
    d.addEventListener('DOMContentLoaded',boot);
}else{
    boot();
}

})(window,document);