/* main.js — place next to index.html and referenced with <script src="main.js" defer></script> */

/* helper: beep + bubble + copy */
function beep(freq = 800, duration = 0.06) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    setTimeout(() => { o.stop(); ctx.close(); }, (duration + 0.02) * 1000);
  } catch (e) { /* ignore */ }
}

function showBubbleFor(el, text = 'Copied!') {
  const bubble = document.createElement('div');
  bubble.className = 'copy-bubble';
  bubble.textContent = text;
  document.body.appendChild(bubble);
  const r = el.getBoundingClientRect();
  const left = Math.round(r.left + r.width / 2 - bubble.offsetWidth / 2);
  const top = Math.round(r.top - 8);
  bubble.style.left = left + 'px';
  bubble.style.top = top + 'px';
  requestAnimationFrame(() => bubble.classList.add('show'));
  setTimeout(() => { bubble.classList.remove('show'); setTimeout(() => bubble.remove(), 300); }, 900);
}

async function copyText(text, el) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showBubbleFor(el, 'Copied!');
    beep(1200, 0.07);
  } catch (e) {
    showBubbleFor(el, 'Copy failed');
    alert('Copy failed — please copy manually: ' + text);
  }
}

/* nav & UI functions */
function showSection(id) {
  const sections = ['home', 'works', 'abilities', 'contact'];
  sections.forEach(s => {
    const el = document.getElementById(s);
    if (!el) return;
    el.style.display = (s === id) ? 'block' : 'none';
  });
  // update active tab buttons (both sidebar quick-btn and mobile tabs)
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.target === id));
  history.replaceState(null, '', '#' + id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Abilities expand/collapse wiring */
function wireAbilities() {
  const abilities = document.querySelectorAll('.ability');
  abilities.forEach(ability => {
    const toggle = ability.querySelector('.ability-toggle');
    const content = ability.querySelector('.ability-desc');
    if (!toggle || !content) return;

    // initial collapsed
    content.style.maxHeight = '0px';
    toggle.setAttribute('aria-expanded', 'false');
    content.setAttribute('aria-hidden', 'true');

    function expand() {
      ability.classList.add('expanded');
      toggle.setAttribute('aria-expanded', 'true');
      content.setAttribute('aria-hidden', 'false');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
    function collapse() {
      content.style.maxHeight = content.scrollHeight + 'px';
      void content.offsetHeight; // force layout
      content.style.maxHeight = '0px';
      ability.classList.remove('expanded');
      toggle.setAttribute('aria-expanded', 'false');
      content.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) collapse();
      else expand();
    });
  });
}

/* DOM ready wiring */
window.addEventListener('DOMContentLoaded', () => {
  // initial section
  const h = location.hash.replace('#', '');
  const start = ['home','works','abilities','contact'].includes(h) ? h : 'home';
  showSection(start);

  // set year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sidebar Email: copy then mailto (copy first so user can paste if needed)
  const sidebarEmailBtn = document.getElementById('sidebarEmailBtn');
  if (sidebarEmailBtn) {
    sidebarEmailBtn.addEventListener('click', (ev) => {
      const email = ev.currentTarget.dataset.copy || 'zgnbusinesses@gmail.com';
      copyText(email, ev.currentTarget).then(() => {
        // small delay so bubble is visible
        setTimeout(() => window.location.href = `mailto:${encodeURIComponent(email)}`, 220);
      });
    });
  }

  // Sidebar Discord: copy only
  const sidebarDiscordBtn = document.getElementById('sidebarDiscordBtn');
  if (sidebarDiscordBtn) {
    sidebarDiscordBtn.addEventListener('click', (ev) => {
      const name = ev.currentTarget.dataset.copy || 'zgn';
      copyText(name, ev.currentTarget);
    });
  }

  // Sidebar GitHub: open profile
  const sidebarGithubBtn = document.getElementById('sidebarGithubBtn');
  if (sidebarGithubBtn) {
    sidebarGithubBtn.addEventListener('click', (ev) => {
      const url = ev.currentTarget.dataset.url || 'https://github.com/zgndia';
      window.open(url, '_blank', 'noopener');
    });
  }

  // Contact page copy buttons (email + discord)
  document.querySelectorAll('.copy-contact').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const text = ev.currentTarget.dataset.copy;
      copyText(text, ev.currentTarget);
    });
  });

  // Quick-links (sidebar)
  document.querySelectorAll('.quick-btn').forEach(b => {
    b.addEventListener('click', () => showSection(b.dataset.target));
  });

  // Mobile tabs
  document.querySelectorAll('#mobileTabs .tab').forEach(t => {
    t.addEventListener('click', () => showSection(t.dataset.target));
  });

  // Download resume
  const dl = document.getElementById('downloadResume');
  if (dl) dl.addEventListener('click', (e) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = 'resume.pdf';
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  // global pressed state + sound
  document.body.addEventListener('pointerdown', (ev) => {
    const btn = ev.target.closest('.btn, .quick-btn');
    if (btn) { btn.classList.add('pressed'); beep(800, 0.04); }
  });
  document.body.addEventListener('pointerup', (ev) => {
    const btn = ev.target.closest('.btn, .quick-btn');
    if (btn) { setTimeout(() => btn.classList.remove('pressed'), 120); }
  });

  // abilities
  wireAbilities();
});

/* keep hash navigation in sync */
window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#', '') || 'home';
  if (['home','works','abilities','contact'].includes(id)) showSection(id);
});
