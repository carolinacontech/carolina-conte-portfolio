const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const heroVideo = document.querySelector('.hero-video');
const heroStage = document.querySelector('.hero-media-stage');
const heroSection = document.querySelector('.hero');
const heroPlayBtn = document.querySelector('.hero-play');

const heroPhoneMq = window.matchMedia('(max-width: 560px)');
const setHeroPoster = () => {
  if (heroVideo) heroVideo.poster = heroPhoneMq.matches ? 'assets/hero-final-mobile.jpg?v=1' : 'assets/hero-final.jpg?v=2';
};
setHeroPoster();
heroPhoneMq.addEventListener('change', setHeroPoster);

heroPlayBtn?.addEventListener('click', () => {
  if (!heroVideo) return;
  heroVideo.muted = false;
  heroVideo.currentTime = 0;
  heroVideo.play();
  heroSection?.classList.add('is-playing');
});

heroVideo?.addEventListener('ended', () => {
  heroSection?.classList.remove('is-playing');
  heroSection?.classList.add('is-ended');
  heroStage?.classList.add('is-ended');
});

const heroLogoStage = document.querySelector('.hero-logo-stage');
const heroLogo = document.querySelector('.hero-logo');

heroLogoStage?.addEventListener('mousemove', (e) => {
  const rect = heroLogoStage.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  const maxTilt = 14;
  const rotateY = (x - 0.5) * maxTilt * 2;
  const rotateX = (0.5 - y) * maxTilt;
  heroLogo.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
});

heroLogoStage?.addEventListener('mouseleave', () => {
  heroLogo.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});

const spotlightSection = document.querySelector('.project-spotlight');
const spotlightIntro = document.querySelector('.spotlight-video-intro');
const spotlightLoop = document.querySelector('.spotlight-video-loop');

const rotatorProjects = [
  { tag: 'Mobile App', type: 'video', src: 'assets/spotlight-left-mobile.mp4' },
  { tag: 'Design System', type: 'image', src: 'assets/ui/component-library-carolina-conte.png?v=4' },
  { tag: 'Dashboard', type: 'image', src: 'assets/ui/dashboard-ui-thumb.jpg' },
  { tag: 'Marketing Site', type: 'image', src: 'assets/ui/landing-page-thumb.jpg' },
];

const sideLeft = document.querySelector('.spotlight-side-left .spotlight-side-content');
const sideRight = document.querySelector('.spotlight-side-right .spotlight-side-content');
const phoneCards = document.querySelectorAll('.phone-card');

let rotatorLeftIndex = 0;
let rotatorRightIndex = 2;
let rotatorIntervalId = null;

function renderSideProject(el, project) {
  if (!el) return;
  if (project.type === 'video') {
    el.innerHTML = `<video src="${project.src}" muted loop playsinline autoplay preload="auto"></video>`;
  } else if (project.type === 'image') {
    const img = document.createElement('img');
    img.src = project.src;
    img.alt = project.tag;
    img.loading = 'lazy';
    el.replaceChildren(img);
  } else {
    el.innerHTML = `<div class="mock">${project.tag}</div>`;
  }
}

function highlightActive(tags) {
  phoneCards.forEach((card) => {
    card.classList.toggle('is-active', tags.includes(card.dataset.tag));
  });
}

function swapSide(el, project) {
  if (!el) return;
  el.classList.add('is-fading');
  setTimeout(() => {
    renderSideProject(el, project);
    el.classList.remove('is-fading');
  }, 300);
}

function startRotator() {
  if (!sideLeft || !sideRight || rotatorIntervalId) return;

  rotatorLeftIndex = 0;
  rotatorRightIndex = 2;
  renderSideProject(sideLeft, rotatorProjects[rotatorLeftIndex]);
  renderSideProject(sideRight, rotatorProjects[rotatorRightIndex]);
  highlightActive([rotatorProjects[rotatorLeftIndex].tag, rotatorProjects[rotatorRightIndex].tag]);

  rotatorIntervalId = setInterval(() => {
    rotatorLeftIndex = (rotatorLeftIndex + 1) % rotatorProjects.length;
    rotatorRightIndex = (rotatorRightIndex + 1) % rotatorProjects.length;
    swapSide(sideLeft, rotatorProjects[rotatorLeftIndex]);
    swapSide(sideRight, rotatorProjects[rotatorRightIndex]);
    setTimeout(() => {
      highlightActive([rotatorProjects[rotatorLeftIndex].tag, rotatorProjects[rotatorRightIndex].tag]);
    }, 300);
  }, 4500);
}

function stopRotator() {
  clearInterval(rotatorIntervalId);
  rotatorIntervalId = null;
  phoneCards.forEach((card) => card.classList.remove('is-active'));
}

spotlightIntro?.addEventListener('ended', () => {
  spotlightSection?.classList.add('is-looping');
  spotlightLoop?.play().catch(() => {});
  startRotator();
});

if (spotlightIntro && spotlightLoop && spotlightSection) {
  const spotlightObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        spotlightSection.classList.remove('is-looping');
        spotlightLoop.pause();
        spotlightLoop.currentTime = 0;
        spotlightIntro.currentTime = 0;
        spotlightIntro.play().catch(() => {});
        stopRotator();
      } else {
        spotlightIntro.pause();
        spotlightLoop.pause();
        stopRotator();
      }
    });
  }, { threshold: 0.4 });

  spotlightObserver.observe(spotlightSection);
}

const BRAND_DELIVERABLES = [
  { key: 'logo', label: 'Logo', row: 1 },
  { key: 'sheet', label: 'Brand sheet', row: 1 },
  { key: 'web-desktop', label: 'Website · Desktop', row: 2 },
  { key: 'web-mobile', label: 'Website · Mobile', row: 2 },
  { key: 'aplicaciones', label: 'Logo applications', row: 3 },
];

const brandModal = document.getElementById('brand-modal');
const brandModalTitle = document.getElementById('brand-modal-title');
const brandModalBody = document.getElementById('brand-modal-body');

function brandAsset(slug, key) {
  return `assets/brands/${slug}/${slug}_${key}.png`;
}

function loadImage(src, alt) {
  const candidates = [src, src.replace(/\.png$/, '.jpg')];
  const tryNext = (i) => new Promise((resolve) => {
    if (i >= candidates.length) return resolve(null);
    const img = new Image();
    img.alt = alt;
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => tryNext(i + 1).then(resolve);
    img.src = candidates[i];
  });
  return tryNext(0);
}

document.querySelectorAll('.brand-card').forEach(async (card) => {
  const slug = card.dataset.brand;
  const mark = card.querySelector('.brand-mark');
  mark.style.background = card.dataset.bg;

  const logo = await loadImage(brandAsset(slug, 'logo'), `${card.dataset.name} logo`);
  if (logo) {
    mark.appendChild(logo);
    card.addEventListener('click', () => openBrandModal(card));
  } else {
    card.classList.add('is-soon');
    card.setAttribute('aria-disabled', 'true');
    card.removeAttribute('aria-haspopup');
    mark.innerHTML = '<span class="ph">coming soon</span>';
    card.querySelector('.brand-tags').innerHTML = '<span>Coming soon</span>';
  }
});

async function openBrandModal(card) {
  const slug = card.dataset.brand;
  document.getElementById('brand-modal-kicker').textContent = 'BRAND WORK';
  brandModal.classList.remove('is-wide');
  brandModalTitle.textContent = card.dataset.name;
  brandModalBody.innerHTML = '';

  const loaded = await Promise.all(
    BRAND_DELIVERABLES.map(async (d) => {
      const label = card.dataset[`label${d.key.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())}`] || d.label;
      const img = await loadImage(brandAsset(slug, d.key), `${card.dataset.name} ${label}`);
      return { ...d, label, img };
    })
  );

  [1, 2, 3].forEach((rowNumber) => {
    const items = loaded.filter((d) => d.row === rowNumber && d.img);
    if (!items.length) return;

    const row = document.createElement('div');
    row.className = `deliv-row deliv-row-${rowNumber}${items.length === 1 ? ' is-single' : ''}`;

    items.forEach((d) => {
      const figure = document.createElement('figure');
      figure.className = `deliv deliv-${d.key}`;

      const frame = document.createElement('div');
      frame.className = 'deliv-frame';
      frame.appendChild(d.img);
      if (d.key === 'logo') frame.style.background = card.dataset.bg;

      const caption = document.createElement('figcaption');
      caption.textContent = d.label;

      figure.append(frame, caption);
      row.appendChild(figure);
    });

    brandModalBody.appendChild(row);
  });

  brandModal.showModal();
  document.body.classList.add('modal-open');
}

function closeBrandModal() {
  brandModal.close();
}

brandModal?.querySelector('.brand-modal-close').addEventListener('click', closeBrandModal);
brandModal?.addEventListener('click', (e) => {
  if (e.target === brandModal) closeBrandModal();
});
brandModal?.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  brandModal.classList.remove('is-wide');
  brandModalBody.innerHTML = '';
});

const UI_GALLERIES = {
  'component-library': {
    title: 'Component library',
    items: [
      { src: 'assets/ui/component-library-carolina-conte.png?v=4', label: 'Carolina Conte · portfolio' },
      { src: 'assets/ui/component-library-market-open-media.png', label: 'Market Open Media' },
      { src: 'assets/ui/component-library-stay-scout.png', label: 'Stay Scout' },
    ],
  },
  'onboarding-flow': {
    title: 'Onboarding flow',
    embed: 'assets/ui/onboarding-flow.html',
    label: 'Stay Scout · first-run onboarding (interactive, sample data)',
    bg: '#fbf9f7',
  },
  'mobile-app': {
    title: 'Star Bake · Mobile App',
    embed: 'assets/ui/star-bake-gallery.html',
    label: 'Seven original bakery and rewards UI screens — swipe horizontally to explore',
    bg: '#f4efe5',
  },
  'landing-page': {
    title: 'Landing page',
    embed: 'assets/ui/free-trial/index.html',
    label: 'Market Open Media · Free 7-day ranking trial (live copy)',
    bg: '#050b18',
  },
  'form-system': {
    title: 'Form system',
    embed: 'assets/ui/form-system.html',
    label: 'Market Open Media · lead form system (interactive, nothing is sent)',
    bg: '#040c1b',
  },
  'design-tokens': {
    title: 'Design tokens',
    embeds: [
      { src: 'assets/ui/carolina-conte-tokens.html', label: 'Carolina Conte · auditing my own portfolio into a token system (interactive)', bg: '#ece6da' },
      { src: 'assets/ui/stay-scout-tokens.html', label: 'Stay Scout · from a logo to a token system (interactive)', bg: '#fbf9f7' },
    ],
  },
  'dashboard-ui': {
    title: 'Dashboard UI',
    embed: 'assets/ui/jarvis-briefing.html',
    label: 'Jarvis · daily briefing (interactive, sample data)',
  },
};

function openGalleryModal(gallery) {
  document.getElementById('brand-modal-kicker').textContent = 'INTERFACE SNAPSHOTS';
  brandModalTitle.textContent = gallery.title;
  brandModal.classList.add('is-wide');
  brandModalBody.innerHTML = '';

  const embeds = gallery.embeds || (gallery.embed ? [{ src: gallery.embed, label: gallery.label, bg: gallery.bg }] : []);

  embeds.forEach((embed) => {
    const figure = document.createElement('figure');
    figure.className = 'deliv deliv-embed';

    const frame = document.createElement('div');
    frame.className = 'deliv-frame';
    if (embed.bg) frame.style.background = embed.bg;
    const iframe = document.createElement('iframe');
    iframe.src = embed.src;
    iframe.title = `${gallery.title} · ${embed.label}`;
    frame.appendChild(iframe);

    const caption = document.createElement('figcaption');
    caption.textContent = embed.label;
    const open = document.createElement('a');
    open.href = embed.src;
    open.target = '_blank';
    open.rel = 'noopener';
    open.textContent = 'Open full screen ↗';
    caption.appendChild(open);

    figure.append(frame, caption);
    brandModalBody.appendChild(figure);
  });

  (gallery.items || []).forEach((item) => {
    const figure = document.createElement('figure');
    figure.className = 'deliv deliv-natural';

    const frame = document.createElement('div');
    frame.className = 'deliv-frame';
    const img = new Image();
    img.src = item.src;
    img.alt = `${gallery.title} · ${item.label}`;
    frame.appendChild(img);

    const caption = document.createElement('figcaption');
    caption.textContent = item.label;

    figure.append(frame, caption);
    brandModalBody.appendChild(figure);
  });

  brandModal.showModal();
  document.body.classList.add('modal-open');
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.tile-gallery').forEach((tile) => {
  const gallery = UI_GALLERIES[tile.dataset.gallery];
  const imgs = tile.querySelectorAll('img');

  tile.addEventListener('click', () => gallery && openGalleryModal(gallery));

  if (imgs.length > 1 && !reduceMotion) {
    let current = 0;
    setInterval(() => {
      imgs[current].classList.remove('is-on');
      current = (current + 1) % imgs.length;
      imgs[current].classList.add('is-on');
    }, 3500);
  }
});
