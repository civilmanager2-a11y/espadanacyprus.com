/* ═══════════════════════════════════════════════════
   ESPADANA — Data Loader
   Reads window.ESPADANA_DATA and injects property
   cards into designated containers.
   
   This file is the bridge between the central data
   (populated by n8n or manually in data.js) and the
   HTML pages.
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('partner-source-grid')) {
    renderPartnerSources('partner-source-grid');
    hydrateSourceStatus('partner-source-grid');
  }

  // Home page: featured properties
  if (document.getElementById('featured-properties')) {
    renderProperties('featured-properties', { featured: true }, 6);
  }

  // Properties page: all properties + filter
  if (document.getElementById('properties-container')) {
    renderProperties('properties-container');
    initPropertyFilter();
  }

  // Contact page: form handler
  if (document.getElementById('contact-form')) {
    initContactForm();
  }
});
