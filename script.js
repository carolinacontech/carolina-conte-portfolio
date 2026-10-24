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

// The Websites reel plays actual video files rather than cycling UI image placeholders.
const websitePreviewVideos = document.querySelectorAll('.spotlight-website-video');
const reduceWebsiteMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceWebsiteMotion) {
  websitePreviewVideos.forEach(video => video.pause());
}

spotlightIntro?.addEventListener('ended', () => {
  spotlightSection?.classList.add('is-looping');
  spotlightLoop?.play().catch(() => {});
});

if (spotlightIntro && spotlightLoop && spotlightSection) {
  const spotlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (reduceWebsiteMotion) return;
        if (!spotlightSection.classList.contains('is-looping')) spotlightIntro.play().catch(() => {});
        else spotlightLoop.play().catch(() => {});
        websitePreviewVideos.forEach(video => video.play().catch(() => {}));
      } else {
        spotlightIntro.pause();
        spotlightLoop.pause();
        websitePreviewVideos.forEach(video => video.pause());
      }
    });
  }, { threshold: 0.1 });
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
    // The brand card is now an anchor to its dedicated case study.
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

  // Related long-form story, without changing how the interactive gallery works.
  const relatedCaseStudies = {
    'mobile-app': 'projects/star-bake.html',
    'component-library': 'projects/component-systems.html',
    'design-tokens': 'projects/component-systems.html',
    'dashboard-ui': 'projects/jarvis.html',
    'landing-page': 'projects/market-open-media.html',
    'form-system': 'projects/market-open-media.html',
  };
  const caseSlug = Object.entries(UI_GALLERIES).find(([, entry]) => entry === gallery)?.[0];
  const studyUrl = relatedCaseStudies[caseSlug];
  if (studyUrl) {
    const link = document.createElement('a');
    link.href = studyUrl;
    link.className = 'gallery-case-link';
    link.textContent = 'Read the full case study ↗';
    brandModalBody.appendChild(link);
  }
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
