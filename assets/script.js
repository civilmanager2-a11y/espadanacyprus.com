/* ═══════════════════════════════════════════════════
   ESPADANA — Global Scripts
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollAnimations();
  initActiveNav();
});

/* ── Mobile Menu ──────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Active Navigation ────────────────────────────── */
function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Scroll Animations ────────────────────────────── */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Format Price ─────────────────────────────────── */
function formatPrice(price) {
  return new Intl.NumberFormat('en-US').format(price);
}

/* ── Build Property Card HTML ─────────────────────── */
function buildPropertyCard(prop) {
  const bedroomText = prop.bedrooms === 0 ? '—' : prop.bedrooms;
  const sourceUrl = prop.source_url || '#';
  const linkTarget = prop.source_url ? ' target="_blank" rel="noopener"' : '';
  const linkText = prop.source_url ? 'مشاهده در منبع' : 'جزئیات بیشتر';
  return `
    <div class="property-card fade-up" data-region="${prop.region}" data-type="${prop.type}">
      <div class="property-img">
        <img src="${prop.image_url}" alt="${prop.title}" loading="lazy">
        <span class="property-badge">${prop.id}</span>
        <span class="property-region">${prop.region}</span>
      </div>
      <div class="property-info">
        <h3>${prop.title}</h3>
        <div class="property-meta">
          <span>
            <svg viewBox="0 0 24 24"><path d="M19 9h-1V4H6v5H5c-1.1 0-2 .9-2 2v6h2v3h2v-3h10v3h2v-3h2v-6c0-1.1-.9-2-2-2zM8 6h8v3H8V6z"/></svg>
            ${bedroomText} خواب
          </span>
          <span>
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7v15h20V7L12 2zm0 2.3L20 9v9H4V9l8-4.7z"/></svg>
            <span class="en-num">${prop.area_sqm}</span> متر
          </span>
          <span>${prop.type}</span>
        </div>
        <div class="property-footer">
          <div class="property-price">
            <span class="en-num">€${formatPrice(prop.price_eur)}</span>
          </div>
          <a href="${sourceUrl}" class="property-link"${linkTarget} onclick="${prop.source_url ? '' : "event.preventDefault(); alert('برای اطلاعات بیشتر با شماره ۰۹۱۲۲۴۰۰۱۳۸ تماس بگیرید.')"}">
            ${linkText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
          </a>
        </div>
      </div>
    </div>
  `;
}

/* ── Partner URL cards ───────────────────────────── */
function renderPartnerSources(containerId) {
  const container = document.getElementById(containerId);
  const sources = window.ESPADANA_REMOTE_SOURCES || [];
  if (!container || !sources.length) return;

  container.innerHTML = sources.map(source => `
    <article class="source-card" data-source="${source.id}">
      <div>
        <strong>${source.label}</strong>
        <p>${source.note}</p>
      </div>
      <div>
        <span class="source-status">URL LIVE SOURCE</span>
        <a href="${source.listingUrl}" target="_blank" rel="noopener">مشاهده فایل‌های زنده ←</a>
      </div>
    </article>
  `).join('');
}

async function hydrateSourceStatus(containerId) {
  const container = document.getElementById(containerId);
  const sources = window.ESPADANA_REMOTE_SOURCES || [];
  if (!container || !sources.length) return;

  await Promise.all(sources.map(async source => {
    const card = container.querySelector(`[data-source="${source.id}"]`);
    const status = card ? card.querySelector('.source-status') : null;
    if (!status) return;

    try {
      await fetch(source.listingUrl, { mode: 'cors', cache: 'no-store' });
      status.textContent = 'LIVE FETCH ENABLED';
    } catch (error) {
      status.textContent = 'LIVE LINK READY';
    }
  }));
}

/* ── Render Properties into a container ───────────── */
function renderProperties(containerId, filter = {}, limit = null) {
  const container = document.getElementById(containerId);
  if (!container || !window.ESPADANA_DATA) return;

  let props = window.ESPADANA_DATA.properties;

  // Apply filters
  if (filter.region && filter.region !== 'all') {
    props = props.filter(p => p.region === filter.region);
  }
  if (filter.type && filter.type !== 'all') {
    props = props.filter(p => p.type === filter.type);
  }
  if (filter.featured) {
    props = props.filter(p => p.featured);
  }

  // Apply limit
  if (limit) {
    props = props.slice(0, limit);
  }

  if (props.length === 0) {
    container.innerHTML = '<div class="no-results">ملکی با این مشخصات یافت نشد. لطفاً فیلتر دیگری انتخاب کنید.</div>';
  } else {
    container.innerHTML = props.map(p => buildPropertyCard(p)).join('');
  }

  // Re-observe for animations
  initScrollAnimations();
}

/* ── Filter Handler for Properties Page ───────────── */
function initPropertyFilter() {
  const regionSelect = document.getElementById('filter-region');
  const typeSelect = document.getElementById('filter-type');
  if (!regionSelect || !typeSelect) return;

  function applyFilter() {
    renderProperties('properties-container', {
      region: regionSelect.value,
      type: typeSelect.value
    });
  }

  regionSelect.addEventListener('change', applyFilter);
  typeSelect.addEventListener('change', applyFilter);
}

/* ── Contact Form Handler ─────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const success = document.getElementById('form-success');
    if (success) {
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    }
  });
}
