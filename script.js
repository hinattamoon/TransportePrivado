/* ========== NAVBAR ========== */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id], div[id]');

// Scroll → sticky style
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  highlightNavLink();
});

// Active nav link on scroll
function highlightNavLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

// Close mobile nav on link click
document.querySelectorAll('.mobile-link, .mobile-wa').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 10;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ========== CALCULADORA ========== */
const TARIFAS = {
  dia:       { mujer: 800,  hombre: 840  },
  tarde:     { mujer: 900,  hombre: 950  },
  madrugada: { mujer: 1050, hombre: 1150 },
};

const HORARIO_LABEL = {
  dia:       'Día (06:00 - 18:00)',
  tarde:     'Tarde (18:00 - 23:59)',
  madrugada: 'Madrugada (00:00 - 05:59)',
};

function calcular() {
  const km      = parseFloat(document.getElementById('km').value);
  const horario = document.getElementById('horario').value;
  const genero  = document.getElementById('genero').value;
  const origen  = document.getElementById('origen').value.trim();
  const destino = document.getElementById('destino').value.trim();

  const placeholder = document.getElementById('estimacion-content');
  const result      = document.getElementById('estimacion-result');

  if (!km || km <= 0) {
    shakeField('km');
    return;
  }

  const tarifa = TARIFAS[horario][genero];
  const total  = Math.round(km * tarifa);

  // Route label
  const rutaEl = document.getElementById('est-ruta');
  if (origen && destino) {
    rutaEl.textContent = origen + '  →  ' + destino;
    rutaEl.style.display = 'block';
  } else {
    rutaEl.style.display = 'none';
  }

  // Price
  document.getElementById('est-price').textContent =
    '$' + total.toLocaleString('es-CL');

  // Meta (madrugada notice)
  const metaEl = document.getElementById('est-meta');
  if (horario === 'madrugada') {
    metaEl.innerHTML = '<i class="fas fa-user-shield" style="color:#aac0ff;margin-right:6px"></i> Incluye copiloto acompañante obligatorio';
    metaEl.classList.add('visible');
  } else {
    metaEl.classList.remove('visible');
  }

  placeholder.classList.add('hidden');
  result.classList.remove('hidden');

  // WhatsApp message pre-fill
  const waBtn = result.querySelector('.est-wa-btn');
  const msg = buildWhatsAppMsg({ origen, destino, km, horario, genero, tarifa, total });
  waBtn.href = 'https://wa.me/56942348184?text=' + encodeURIComponent(msg);

  // Scroll to result on mobile
  if (window.innerWidth < 768) {
    document.getElementById('estimacion-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function buildWhatsAppMsg({ origen, destino, km, horario, genero, tarifa, total }) {
  const g = genero === 'mujer' ? 'Mujer' : 'Hombre';
  const h = HORARIO_LABEL[horario];
  let msg = '¡Hola! Quisiera reservar un viaje.\n\n';
  if (origen)  msg += '📍 Origen: ' + origen + '\n';
  if (destino) msg += '📍 Destino: ' + destino + '\n';
  msg += '📏 Distancia aprox: ' + km + ' km\n';
  msg += '🕐 Horario: ' + h + '\n';
  msg += '👤 Pasajero: ' + g + '\n';
  msg += '💰 Estimación: $' + total.toLocaleString('es-CL') + '\n\n';
  msg += '¿Está disponible?';
  return msg;
}

function shakeField(id) {
  const el = document.getElementById(id);
  el.style.borderColor = '#ff4444';
  el.style.boxShadow = '0 0 10px rgba(255,68,68,0.4)';
  el.focus();
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.boxShadow = '';
  }, 1800);
}

/* ========== SCROLL REVEAL ========== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.service-card, .tarifa-card, .confort-card, .seg-card, .gender-card, .strip-item'
).forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

/* Reveal CSS injected via JS to keep style.css clean */
const style = document.createElement('style');
style.textContent = `
  .reveal { opacity: 0; transform: translateY(22px); transition: opacity .55s ease, transform .55s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);
