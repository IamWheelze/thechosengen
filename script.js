// The Chosen Generation Bible School — Registration Form

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile nav toggle ──────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.getElementById('mainNav');

  navToggle?.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  // Close nav on link click
  mainNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });

  // ── Sticky header shadow ────────────────────────────────────
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Form submission ─────────────────────────────────────────
  const form      = document.getElementById('registrationForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText   = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');
  const toast     = document.getElementById('toast');

  let toastTimer;

  function showToast(message, type = 'success', duration = 6000) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    toastTimer = setTimeout(() => { toast.style.display = 'none'; }, duration);
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const accessKey = form.querySelector('[name="access_key"]')?.value;
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      showToast(
        '⚠️ Form not yet activated. Visit web3forms.com to get your free access key.',
        'warning',
        10000
      );
      return;
    }

    // Set loading state
    submitBtn.disabled    = true;
    btnText.style.display  = 'none';
    btnLoader.style.display = 'inline';

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        showToast('✅ Application submitted! We\'ll be in touch within 3–5 business days.', 'success');
        form.reset();
        document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Submission error:', err);
      showToast('❌ Something went wrong. Please try again or contact us directly.', 'error');
    } finally {
      submitBtn.disabled     = false;
      btnText.style.display   = 'inline';
      btnLoader.style.display = 'none';
    }
  });

  // ── Scroll-based reveal animation ─────────────────────────
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.feature-card, .programme-card, .form-block').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

});
