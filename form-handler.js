/**
 * RHS AI Solutions — Shared Form Handler
 * 
 * Handles form submissions across all pages.
 * Supports: Formspree, Google Apps Script, mailto fallback.
 * 
 * Usage: Each form gets a data-form-type attribute:
 *   data-form-type="lead-magnet" — PDF download delivery
 *   data-form-type="cta" — General inquiry notification
 *   data-form-type="tool" — Tool result + email follow-up
 * 
 * Configure the endpoint below.
 */

(function () {
  'use strict';

  // ============================================
  // CONFIGURATION — Update this after signup
  // ============================================
  
  // Option 1: Formspree (free tier: 50 submissions/month)
  // Sign up at https://formspree.io and create a form.
  // Replace YOUR_FORM_ID with your actual form ID.
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
  
  // Option 2: Google Apps Script (uncomment after deploying GAS)
  // const GAS_ENDPOINT = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
  
  // Option 3: mailto fallback (works today, no backend needed)
  const ENABLE_MAILTO_FALLBACK = true;
  
  // RHS notification emails
  const RHS_EMAILS = ['righthandservicesbyjp@gmail.com', 'rhsjp01@gmail.com'];

  // ============================================
  // FORM SUBMISSION HANDLER
  // ============================================
  
  function handleFormSubmit(form, event) {
    event.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Submit';
    const formData = new FormData(form);
    const email = formData.get('email') || '';
    const formType = form.dataset.formType || 'cta';
    const pageSlug = window.location.pathname;
    
    // Validation
    if (!email || !isValidEmail(email)) {
      showFormMessage(form, 'Please enter a valid email address.', 'error');
      return;
    }
    
    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    
    // Build submission payload
    const payload = {
      email: email,
      page: pageSlug,
      type: formType,
      timestamp: new Date().toISOString(),
      source: window.location.href
    };
    
    // Add any additional fields
    formData.forEach((value, key) => {
      if (key !== 'email') payload[key] = value;
    });
    
    // Attempt submission
    submitToEndpoint(payload, form, submitBtn, originalText)
      .catch(() => {
        // Fallback to mailto if enabled
        if (ENABLE_MAILTO_FALLBACK) {
          triggerMailto(email, formType, pageSlug);
          showFormMessage(form, 'Opening email client to complete submission...', 'info');
          setTimeout(() => resetForm(form, submitBtn, originalText), 2000);
        } else {
          showFormMessage(form, 'Something went wrong. Please try again or call us at 317-395-3309.', 'error');
          resetForm(form, submitBtn, originalText);
        }
      });
  }
  
  async function submitToEndpoint(payload, form, submitBtn, originalText) {
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok || response.status === 200) {
        showFormMessage(form, getSuccessMessage(payload.type), 'success');
        resetForm(form, submitBtn, originalText);
        
        // Trigger PDF download for lead magnets
        if (payload.type === 'lead-magnet') {
          triggerAssetDownload(payload.page);
        }
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      throw err;
    }
  }
  
  function getSuccessMessage(type) {
    switch (type) {
      case 'lead-magnet':
        return 'Thanks! Check your email for the download link.';
      case 'tool':
        return 'Thanks! Your results are being prepared — check your email.';
      case 'cta':
      default:
        return 'Thanks! RHS will reach out within 24 hours.';
    }
  }
  
  function triggerAssetDownload(page) {
    // Map pages to their PDF download URLs
    const assetMap = {
      '/free/turf-grass-selection-guide.html': '/assets/pdfs/turf-grass-selection-guide.pdf',
      '/free/french-drain-cheat-sheet.html': '/assets/pdfs/french-drain-cheat-sheet.pdf',
      '/free/soil-health-starter-guide.html': '/assets/pdfs/soil-health-starter-guide.pdf',
      '/free/seasonal-maintenance-calendar.html': '/assets/pdfs/seasonal-maintenance-calendar.pdf',
      '/free/ai-automation-readiness-checklist.html': '/assets/pdfs/ai-automation-readiness-checklist.pdf',
      '/promo/turf-management-brochure.html': '/assets/pdfs/turf-management-brochure.pdf',
      '/promo/regenerative-landscaping-portfolio.html': '/assets/pdfs/regenerative-landscaping-portfolio.pdf',
      '/promo/ai-solutions-capabilities.html': '/assets/pdfs/ai-solutions-capabilities.pdf',
      '/promo/sample-due-diligence-report.html': '/assets/pdfs/sample-due-diligence-report.pdf',
      '/promo/drainage-solutions-brochure.html': '/assets/pdfs/drainage-solutions-brochure.pdf'
    };
    
    const pdfUrl = assetMap[page];
    if (pdfUrl) {
      // Small delay so user sees success message first
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = '';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 1500);
    }
  }
  
  function triggerMailto(email, type, page) {
    const subject = encodeURIComponent(`RHS ${type === 'lead-magnet' ? 'Lead Magnet Download' : 'Website Inquiry'} — ${page}`);
    const body = encodeURIComponent(
`New RHS website submission:

Email: ${email}
Page: ${page}
Type: ${type}
Time: ${new Date().toISOString()}

---
This is an automated notification from rhsjp1.github.io.
Follow up with the lead within 24 hours.`
    );
    
    const mailtoUrl = `mailto:${RHS_EMAILS.join(',')}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  }
  
  function showFormMessage(form, message, type) {
    // Remove any existing message
    const existing = form.parentElement.querySelector('.form-message');
    if (existing) existing.remove();
    
    const msg = document.createElement('div');
    msg.className = 'form-message';
    msg.style.marginTop = '1rem';
    msg.style.padding = '0.75rem 1rem';
    msg.style.borderRadius = '0.5rem';
    msg.style.fontSize = '0.875rem';
    msg.style.fontWeight = '500';
    
    if (type === 'success') {
      msg.style.background = 'rgba(16, 185, 129, 0.1)';
      msg.style.border = '1px solid rgba(16, 185, 129, 0.2)';
      msg.style.color = '#10b981';
    } else if (type === 'error') {
      msg.style.background = 'rgba(239, 68, 68, 0.1)';
      msg.style.border = '1px solid rgba(239, 68, 68, 0.2)';
      msg.style.color = '#ef4444';
    } else {
      msg.style.background = 'rgba(217, 119, 6, 0.1)';
      msg.style.border = '1px solid rgba(217, 119, 6, 0.2)';
      msg.style.color = '#D97706';
    }
    
    msg.textContent = message;
    form.parentElement.appendChild(msg);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => msg.remove(), 5000);
    }
  }
  
  function resetForm(form, submitBtn, originalText) {
    form.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ============================================
  // INITIALIZE FORMS
  // ============================================
  
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.lead-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        handleFormSubmit(form, e);
      });
    });
  });
  
})();
