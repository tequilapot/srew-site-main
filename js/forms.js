/* SREW website lead capture */
;(function (w, d) {
  'use strict';

  const _id = (id) => d.getElementById(id);
  const TRACKING_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'];
  const ATTRIBUTION_KEY = 'srew_lead_attribution_v1';
  let googleScriptPromise;

  function toast(message, type) {
    if (typeof w._srew_toast === 'function') {
      w._srew_toast(message, type);
      return;
    }
    const node = d.createElement('div');
    node.setAttribute('role', 'status');
    node.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;background:#fff;padding:14px 18px;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.18);font-size:14px;max-width:360px;color:#10233f';
    node.textContent = message;
    d.body.appendChild(node);
    w.setTimeout(() => node.remove(), 4500);
  }

  function countryCodeFor(form) {
    return form.querySelector('.country-code-select')?.value || '+91';
  }

  function validateField(input) {
    const value = input.value.trim();
    let valid = !input.required || Boolean(value);
    if (valid && input.type === 'email' && value) valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    if (valid && input.type === 'tel' && value) {
      const digits = value.replace(/\D/g, '');
      valid = countryCodeFor(input.form) === '+91' ? /^[6-9]\d{9}$/.test(digits) : digits.length >= 7 && digits.length <= 15;
    }
    input.classList.toggle('is-valid', valid && Boolean(value));
    input.classList.toggle('is-invalid', !valid && input.dataset.touched === 'true');
    return valid;
  }

  function setupValidation(form) {
    form.querySelectorAll('input, textarea, select').forEach((input) => {
      input.addEventListener('blur', () => {
        input.dataset.touched = 'true';
        validateField(input);
      });
      input.addEventListener('input', () => {
        if (input.dataset.touched === 'true') validateField(input);
      });
    });
  }

  function setButtonLoading(button, loading, label) {
    if (!button) return;
    if (loading) {
      button.dataset.originalText = button.innerHTML;
      button.textContent = label || 'Sending…';
      button.disabled = true;
    } else {
      button.innerHTML = button.dataset.originalText || 'Submit';
      button.disabled = false;
    }
  }

  function sourcePath(value) {
    try {
      const url = new URL(value, w.location.origin);
      return url.origin + url.pathname;
    } catch {
      return '';
    }
  }

  function collectPageContext() {
    let firstTouch = null;
    try {
      const stored = w.sessionStorage.getItem(ATTRIBUTION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() - Number(parsed.capturedAt) < 30 * 60 * 1000) firstTouch = parsed;
      }
      if (!firstTouch) {
        const params = new URLSearchParams(w.location.search);
        const tags = {};
        TRACKING_KEYS.forEach((key) => {
          const value = params.get(key);
          if (value) tags[key] = value.slice(0, 240);
        });
        firstTouch = {
          landingPage: w.location.pathname,
          referrer: sourcePath(d.referrer),
          tags,
          capturedAt: Date.now(),
        };
        w.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(firstTouch));
      }
    } catch {
      firstTouch = { landingPage: w.location.pathname, referrer: sourcePath(d.referrer), tags: {} };
    }

    const tags = firstTouch.tags || {};
    return {
      currentPage: w.location.pathname,
      landingPage: firstTouch.landingPage || w.location.pathname,
      referrer: firstTouch.referrer || '',
      utmSource: tags.utm_source || '',
      utmMedium: tags.utm_medium || '',
      utmCampaign: tags.utm_campaign || '',
      utmTerm: tags.utm_term || '',
      utmContent: tags.utm_content || '',
      googleClickId: tags.gclid || tags.gbraid || tags.wbraid || '',
    };
  }

  function addHoneypot(form) {
    if (form.querySelector('[name="website"]')) return;
    const wrapper = d.createElement('div');
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden';
    const label = d.createElement('label');
    label.textContent = 'Leave this field blank';
    const input = d.createElement('input');
    input.type = 'text';
    input.name = 'website';
    input.tabIndex = -1;
    input.autocomplete = 'off';
    label.appendChild(input);
    wrapper.appendChild(label);
    form.appendChild(wrapper);
  }

  function addPrivacyNote(form) {
    if (form.querySelector('.srew-lead-privacy')) return;
    const note = d.createElement('p');
    note.className = 'srew-lead-privacy form-text small mt-2 mb-2';
    note.append(d.createTextNode('When you send this enquiry, SREW Projects may use these details to respond. The page and campaign source may be recorded with your enquiry. '));
    const link = d.createElement('a');
    link.href = '/privacy-policy';
    link.textContent = 'Privacy Policy';
    note.appendChild(link);
    const button = form.querySelector('button[type="submit"], input[type="submit"]');
    if (button) form.insertBefore(note, button);
    else form.appendChild(note);
  }

  function addCompanyField(form) {
    if (form.querySelector('[name="company"]')) return;
    const inputStyle = form.querySelector('.form-control-premium') ? 'form-control-premium' : 'form-control';
    const wrapper = d.createElement('div');
    wrapper.className = form.querySelector('.form-group-premium') ? 'form-group-premium srew-company-field' : 'mb-3 srew-company-field';
    const label = d.createElement('label');
    label.className = form.querySelector('.form-label-premium') ? 'form-label-premium' : 'form-label';
    label.textContent = 'Company / organization (optional)';
    const input = d.createElement('input');
    input.type = 'text';
    input.name = 'company';
    input.className = inputStyle;
    input.autocomplete = 'organization';
    input.maxLength = 160;
    input.placeholder = 'Company or project organization';
    wrapper.append(label, input);
    const message = form.querySelector('#quoteMessage, #contactMessage, textarea[name="message"], textarea[name="Message"]');
    const target = message?.closest('.form-group-premium, .mb-3') || form.querySelector('button[type="submit"]');
    if (target) form.insertBefore(wrapper, target);
    else form.appendChild(wrapper);
  }

  function decodeGoogleNameEmail(credential, form) {
    try {
      const encoded = credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const claims = JSON.parse(w.atob(encoded));
      const name = form.querySelector('[name="name"], [name="Name"]');
      const email = form.querySelector('[name="email"], [name="Email"]');
      if (name && claims.name) name.value = claims.name;
      if (email && claims.email) email.value = claims.email;
      form.dataset.googleIdToken = credential;
      form.querySelectorAll('[name="name"], [name="Name"], [name="email"], [name="Email"]').forEach(validateField);
      const note = form.querySelector('.srew-google-note');
      if (note) note.textContent = 'Google filled your name and email. You can edit them before sending.';
    } catch {
      toast('Google sign-in could not fill the form. Please enter your details manually.', 'error');
    }
  }

  function loadGoogleIdentityScript() {
    if (w.google?.accounts?.id) return Promise.resolve();
    if (googleScriptPromise) return googleScriptPromise;
    googleScriptPromise = new Promise((resolve, reject) => {
      const script = d.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      d.head.appendChild(script);
    });
    return googleScriptPromise;
  }

  function setupGoogleSignIn(form) {
    if (form.dataset.googleSignInInit === 'true') return;
    form.dataset.googleSignInInit = 'true';
    fetch('/api/google-auth-config', { headers: { Accept: 'application/json' } })
      .then((response) => response.ok ? response.json() : null)
      .then(async (config) => {
        if (!config?.enabled || !config.clientId) return;
        await loadGoogleIdentityScript();
        const wrapper = d.createElement('div');
        wrapper.className = 'srew-google-signin mb-3';
        const note = d.createElement('p');
        note.className = 'srew-google-note form-text small mb-2';
        note.textContent = 'Optional: use Google to fill your name and email for this enquiry.';
        const button = d.createElement('div');
        wrapper.append(note, button);
        const submit = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submit) form.insertBefore(wrapper, submit);
        else form.appendChild(wrapper);
        w.google.accounts.id.initialize({
          client_id: config.clientId,
          callback: (response) => decodeGoogleNameEmail(response.credential, form),
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        w.google.accounts.id.renderButton(button, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular' });
      })
      .catch(() => {});
  }

  function enhanceLeadForm(form, formType) {
    if (form.dataset.srewEnhanced === 'true') return;
    form.dataset.srewEnhanced = 'true';
    form.dataset.leadFormType = formType;
    form.dataset.srewStartedAt = String(Date.now());
    addHoneypot(form);
    addPrivacyNote(form);
    if (formType === 'quote' || formType === 'contact' || formType === 'industry') addCompanyField(form);
    if (formType !== 'brochure') setupGoogleSignIn(form);
  }

  async function submitLead(form, formType, data) {
    const result = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...data,
        formType,
        pageContext: collectPageContext(),
        website: form.querySelector('[name="website"]')?.value || '',
        formStartedAt: Number(form.dataset.srewStartedAt || Date.now()),
        googleIdToken: form.dataset.googleIdToken || '',
      }),
    });
    const payload = await result.json().catch(() => ({}));
    if (!result.ok || !payload.ok) throw new Error(payload.error || 'We could not send the enquiry. Please try again.');
    return payload;
  }

  function reportLead(formType, result) {
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'generate_lead', { method: formType, lead_reference: result.leadId || '' });
    }
    if (typeof w.gtag_report_conversion === 'function') w.gtag_report_conversion();
  }

  function formInterest() {
    return d.querySelector('main h1, h1')?.textContent.trim().slice(0, 180) || d.title.slice(0, 180);
  }

  function initBrochureForm() {
    const form = _id('brochureForm');
    if (!form) return;
    enhanceLeadForm(form, 'brochure');
    setupValidation(form);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = _id('brochureName')?.value.trim() || '';
      const phone = _id('brochurePhone')?.value.trim() || '';
      const requirement = _id('brochureRequirement')?.value.trim() || '';
      const digits = phone.replace(/\D/g, '');
      const code = countryCodeFor(form);
      if (!name || !phone || !requirement || (code === '+91' ? !/^[6-9]\d{9}$/.test(digits) : digits.length < 7 || digits.length > 15)) {
        toast('Please enter your name, a valid phone number and your requirement.', 'error');
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      setButtonLoading(button, true, 'Preparing download…');
      try {
        const result = await submitLead(form, 'brochure', {
          name,
          phone: `${code} ${digits}`,
          interest: formInterest(),
          requirement,
          subject: 'Product information / brochure request',
        });
        reportLead('brochure', result);
        const link = d.createElement('a');
        link.href = '/brochures/srew-company-profile.pdf';
        link.download = 'SREW-Company-Profile.pdf';
        link.target = '_blank';
        link.rel = 'noopener';
        d.body.appendChild(link);
        link.click();
        link.remove();
        const grid = _id('brochureGrid');
        const successPane = _id('brochureSuccessPane');
        if (grid) grid.style.display = 'none';
        if (successPane) {
          successPane.style.display = 'flex';
          const reference = successPane.querySelector('[data-lead-reference]');
          if (reference) reference.textContent = result.leadId;
        }
        form.reset();
        form.dataset.googleIdToken = '';
        toast(`Brochure request received. Reference ${result.leadId}.`, 'success');
      } catch (error) {
        toast(error.message || 'Could not capture your request. Please try again.', 'error');
      } finally {
        setButtonLoading(button, false);
      }
    });
  }

  function initContactForm() {
    const form = _id('contactForm');
    const messages = _id('form-messages');
    if (!form) return;
    enhanceLeadForm(form, 'contact');
    setupValidation(form);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const get = (name) => form.querySelector(`[name="${name}"]`)?.value.trim() || '';
      const name = get('name');
      const email = get('email');
      const phone = get('phone');
      const subject = get('subject');
      const message = get('message');
      if (!name || !email || !subject || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        if (messages) messages.textContent = 'Please enter your name, a valid email, a subject and a message.';
        toast('Please complete the required fields.', 'error');
        return;
      }
      const code = countryCodeFor(form);
      const digits = phone.replace(/\D/g, '');
      if (phone && (code === '+91' ? !/^[6-9]\d{9}$/.test(digits) : digits.length < 7 || digits.length > 15)) {
        if (messages) messages.textContent = 'Please enter a valid phone number.';
        toast('Please enter a valid phone number.', 'error');
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      setButtonLoading(button, true, 'Sending…');
      if (messages) messages.textContent = '';
      try {
        const result = await submitLead(form, 'contact', {
          name, email,
          phone: phone ? `${code} ${digits}` : '',
          company: get('company'),
          interest: subject,
          subject,
          message,
        });
        reportLead('contact', result);
        form.reset();
        form.dataset.googleIdToken = '';
        if (messages) messages.textContent = `Thanks. Your enquiry was received. Reference: ${result.leadId}.`;
        toast(`Enquiry received. Reference ${result.leadId}.`, 'success');
      } catch (error) {
        if (messages) messages.textContent = error.message || 'We could not send your enquiry. Please try again or call us.';
        toast(error.message || 'Could not send your enquiry. Please try again.', 'error');
      } finally {
        setButtonLoading(button, false);
      }
    });
  }

  function initUrlPrefill() {
    const params = new URLSearchParams(w.location.search);
    const inquiry = params.get('inquiry') || params.get('product') || params.get('project_inquiry') || params.get('industry');
    const field = _id('contactSubject');
    if (inquiry && field) field.value = `Inquiry about ${inquiry}`.slice(0, 180);
  }

  function initLeadQuoteForm() {
    const form = _id('leadQuoteForm');
    if (!form) return;
    enhanceLeadForm(form, 'quote');
    setupValidation(form);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const value = (id) => _id(id)?.value.trim() || '';
      const name = value('quoteName');
      const email = value('quoteEmail');
      const phone = value('quotePhone');
      const location = value('quoteLocation');
      const capacity = value('quoteCapacity');
      const material = value('quoteMaterial');
      const message = value('quoteMessage');
      if (!name || !email || !phone || !location || !capacity || !material) {
        toast('Please complete the required fields.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        toast('Please enter a valid email address.', 'error');
        return;
      }
      const code = countryCodeFor(form);
      const digits = phone.replace(/\D/g, '');
      if (code === '+91' ? !/^[6-9]\d{9}$/.test(digits) : digits.length < 7 || digits.length > 15) {
        toast('Please enter a valid phone number.', 'error');
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      setButtonLoading(button, true, 'Sending…');
      try {
        const result = await submitLead(form, 'quote', {
          name, email, phone: `${code} ${digits}`, company: form.querySelector('[name="company"]')?.value.trim() || '',
          location, capacity, material, interest: formInterest(), message,
          subject: `B2B quote request: ${capacity} plant`,
          requirement: `Capacity: ${capacity}; material: ${material}; location: ${location}`,
        });
        reportLead('quote', result);
        form.reset();
        form.dataset.googleIdToken = '';
        w.location.href = `/thankyou?ref=${encodeURIComponent(result.leadId)}`;
      } catch (error) {
        toast(error.message || 'Could not submit your quote request. Please try again.', 'error');
      } finally {
        setButtonLoading(button, false);
      }
    });
  }

  function initIndustryInquiryForms() {
    d.querySelectorAll('form#inquiry-form').forEach((form) => {
      if (form.dataset.srewInquiryBound === 'true') return;
      form.dataset.srewInquiryBound = 'true';
      enhanceLeadForm(form, 'industry');
      setupValidation(form);
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const get = (name) => form.querySelector(`[name="${name}"]`)?.value.trim() || '';
        const name = get('Name');
        const email = get('Email');
        const phone = get('Phone');
        const message = get('Message');
        const subject = get('Subject') || formInterest();
        const code = countryCodeFor(form);
        const digits = phone.replace(/\D/g, '');
        if (!name || !email || !phone || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || (code === '+91' ? !/^[6-9]\d{9}$/.test(digits) : digits.length < 7 || digits.length > 15)) {
          toast('Please enter a valid name, email, phone and requirement.', 'error');
          return;
        }
        const button = form.querySelector('button[type="submit"]');
        setButtonLoading(button, true, 'Sending…');
        try {
          const result = await submitLead(form, 'industry', {
            name, email, phone: `${code} ${digits}`, company: get('company'), interest: subject, subject, message,
          });
          reportLead('industry', result);
          form.reset();
          form.dataset.googleIdToken = '';
          toast(`Enquiry received. Reference ${result.leadId}.`, 'success');
        } catch (error) {
          toast(error.message || 'Could not send your enquiry. Please try again.', 'error');
        } finally {
          setButtonLoading(button, false);
        }
      });
    });
  }

  function initCountryCodeSelectors() {
    const phoneInputs = d.querySelectorAll('input[type="tel"], input[name="phone"], input[name="Phone"], #contactPhone, #quotePhone, #brochurePhone');
    if (!phoneInputs.length) return;
    const countries = [
      ['🇮🇳 India', '+91'], ['🇺🇸 USA/Canada', '+1'], ['🇬🇧 UK', '+44'], ['🇦🇪 UAE', '+971'],
      ['🇸🇦 Saudi Arabia', '+966'], ['🇴🇲 Oman', '+968'], ['🇶🇦 Qatar', '+974'], ['🇧🇭 Bahrain', '+973'],
      ['🇰🇼 Kuwait', '+965'], ['🇿🇦 South Africa', '+27'], ['🇦🇺 Australia', '+61'], ['🇸🇬 Singapore', '+65'],
      ['🇲🇾 Malaysia', '+60'], ['🇱🇰 Sri Lanka', '+94'], ['🇳🇵 Nepal', '+977'], ['🇧🇩 Bangladesh', '+880'],
    ];
    phoneInputs.forEach((input) => {
      if (input.dataset.countryInjected === 'true') return;
      const select = d.createElement('select');
      select.setAttribute('aria-label', 'Country code');
      select.className = input.classList.contains('form-control-premium') ? 'form-control-premium country-code-select' : 'form-select country-code-select';
      select.style.cssText = 'width:110px;flex:0 0 110px;';
      countries.forEach(([name, code]) => {
        const option = d.createElement('option');
        option.value = code;
        option.textContent = `${name} ${code}`;
        select.appendChild(option);
      });
      select.value = '+91';
      const wrapper = d.createElement('div');
      wrapper.className = 'd-flex align-items-stretch w-100 country-code-wrapper';
      wrapper.style.cssText = 'gap:8px;';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.append(select, input);
      input.style.flexGrow = '1';
      input.style.width = 'auto';
      input.dataset.countryInjected = 'true';
    });
  }

  function boot() {
    initCountryCodeSelectors();
    initBrochureForm();
    initContactForm();
    initLeadQuoteForm();
    initIndustryInquiryForms();
    initUrlPrefill();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window, document);
