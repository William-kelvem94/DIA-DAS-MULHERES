/* ── QR Code ─────────────────────── */

/* ── Music FAB + YouTube Modal ───── */
// when GitHub Pages serves the site the MP3 must be committed along with the
// HTML; otherwise the <audio> element will 404. as an alternative the YouTube
// embed is configured to jump to the chorus (≈44 s) so visitors can play that
// directly without relying on a local file.
const ytEmbedUrl =
  "https://www.youtube.com/embed/YQ-qToZUybM?start=44&autoplay=1";
const musicBtn = document.getElementById("music-btn");
const musicMenu = document.getElementById("music-menu");
const playLocalBtn = document.getElementById("play-local-btn");
const ytOpenBtn = document.getElementById("yt-open-btn");
const ytChorusBtn = document.getElementById("yt-chorus-btn"); // new
const audio = document.getElementById("bg-audio");
const ytModal = document.getElementById("yt-modal");
const ytIframe = document.getElementById("yt-iframe");
const ytClose = document.getElementById("yt-close");

// Toggle mini-menu
musicBtn.addEventListener("click", () => {
  musicMenu.classList.toggle("open");
});

// Close menu on outside click
document.addEventListener("click", (e) => {
  if (!document.getElementById("music-fab").contains(e.target))
    musicMenu.classList.remove("open");
});

// Play / pause local file
// if you want the track to start at the chorus instead of the beginning,
// set the `currentTime` property before calling play().
// the chorus is around 44 seconds into this MP3.
playLocalBtn.addEventListener("click", () => {
  musicMenu.classList.remove("open");
  if (audio.paused) {
    // jump to the lyrics' refrão
    audio.currentTime = 44; // change this value if the chorus timing is different
    audio
      .play()
      .then(() => {
        playLocalBtn.textContent = "⏸ Pausar música";
        musicBtn.classList.add("playing");
        musicBtn.textContent = "🎶";
      })
      .catch(() => {
        showToast("Adicione musica.mp3 na pasta do projeto 🎵");
      });
  } else {
    audio.pause();
    playLocalBtn.textContent = "🎵 Tocar música";
    musicBtn.classList.remove("playing");
    musicBtn.textContent = "🎵";
  }
});
audio.addEventListener("ended", () => {
  playLocalBtn.textContent = "🎵 Tocar música";
  musicBtn.classList.remove("playing");
  musicBtn.textContent = "🎵";
});

// Open YouTube modal
ytOpenBtn.addEventListener("click", () => {
  ytIframe.src = ytEmbedUrl;
  ytModal.classList.add("open");
  musicMenu.classList.remove("open");
});

// play chorus directly in modal (same URL but start param is already set)
ytChorusBtn.addEventListener("click", () => {
  ytIframe.src = ytEmbedUrl; // already starts at 44s
  ytModal.classList.add("open");
  musicMenu.classList.remove("open");
});

// Close YouTube modal
function closeYtModal() {
  ytModal.classList.remove("open");
  ytIframe.src = "";
}
ytClose.addEventListener("click", closeYtModal);
ytModal.addEventListener("click", (e) => {
  if (e.target === ytModal) closeYtModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && ytModal.classList.contains("open")) closeYtModal();
});

// toast utility
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.opacity = "1";
  setTimeout(() => {
    t.style.opacity = "0";
  }, 1800);
}

// easter egg keyboard sequence
(() => {
  const seq = ["a", "m", "o", "r"];
  let idx = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === seq[idx]) {
      idx++;
      if (idx === seq.length) {
        showToast("📝 Segredo: você é minha razão!");
        idx = 0;
      }
    } else idx = 0;
  });
})();

// photo triple click messages
const momentPhotos = document.querySelectorAll(".moment-photo");
momentPhotos.forEach((p) => {
  let clicks = 0;
  p.addEventListener("click", () => {
    clicks++;
    setTimeout(() => {
      clicks = 0;
    }, 600);
    if (clicks === 3) {
      showToast("💖 Três vezes e você ganhou meu coração");
    }
  });
});

// click QR copy url + show toast
const qrcodeContainer = document.getElementById("qrcode");
if (qrcodeContainer) {
  qrcodeContainer.addEventListener("click", () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => showToast("Link copiado!"));
  });
}

window.addEventListener("DOMContentLoaded", () => {
  new QRCode(document.getElementById("qrcode"), {
    text: window.location.href,
    width: 152,
    height: 152,
    colorDark: "#7c3aed",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
});

/* ── Progress bar ────────────────── */
const progressEl = document.getElementById("progress");
let tick = false;

// paint-based phases
if ("PerformanceObserver" in window) {
  const phaseColors = {
    "first-paint": "var(--rose)",
    "first-contentful-paint": "var(--violet)",
    "largest-contentful-paint": "var(--gold)",
  };
  const obs = new PerformanceObserver((list) => {
    list.getEntries().forEach((e) => {
      if (phaseColors[e.name]) {
        progressEl.style.background = phaseColors[e.name];
        // animate width to a fraction depending on step
        let w = 0;
        if (e.name === "first-paint") w = 15;
        else if (e.name === "first-contentful-paint") w = 35;
        else if (e.name === "largest-contentful-paint") w = 65;
        progressEl.style.width = w + "%";
      }
    });
  });
  obs.observe({ type: "paint", buffered: true });
}

window.addEventListener("load", () => {
  progressEl.style.transition = "width 1.2s ease,inset 0.3s";
  progressEl.style.background = "var(--gold)";
  progressEl.style.width = "100%";
  setTimeout(() => {
    progressEl.style.width = "0%";
  }, 1200);
});

// theme picker cycle
const themeBtn = document.getElementById("theme-toggle");
const themes = ["", "rose", "paper"];
if (themeBtn) {
  let idx =
    themes.indexOf(localStorage.theme) >= 0
      ? themes.indexOf(localStorage.theme)
      : 0;
  function apply(t) {
    if (t) document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
    localStorage.theme = t;
    themeBtn.textContent = t === "rose" ? "🌹" : t === "paper" ? "📜" : "🌙";
  }
  apply(themes[idx]);
  themeBtn.addEventListener("click", () => {
    idx = (idx + 1) % themes.length;
    apply(themes[idx]);
  });
}

window.addEventListener("scroll", () => {
  // hero shrink
  const hero = document.querySelector(".hero");
  if (window.scrollY > 120) hero.classList.add("shrink");
  else hero.classList.remove("shrink");
  // ripple effect on scroll hint
  const hint = document.querySelector(".scroll-hint");
  if (window.scrollY > 80 && hint) {
    hint.classList.add("ripple");
    setTimeout(() => hint.classList.remove("ripple"), 600);
  }
  if (!tick) {
    window.requestAnimationFrame(() => {
      const pct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      progressEl.style.width = pct + "%";
      tick = false;
    });
    tick = true;
  }
});

/* ── Timeline horizontal ───────────── */
(function () {
  const tl = document.getElementById("timeline");
  if (!tl) return;
  const moments = document.querySelectorAll(".moment");
  const treasure = Math.floor(Math.random() * moments.length);
  moments.forEach((m, i) => {
    const pic = m.querySelector(".moment-photo");
    const badge = m.querySelector(".photo-badge")?.textContent || "";
    const item = document.createElement("div");
    item.className = "tl-item";
    const img = document.createElement("img");
    img.src = pic ? pic.src : "";
    img.alt = badge;
    item.appendChild(img);
    const lbl = document.createElement("div");
    lbl.className = "tl-label";
    lbl.textContent = badge;
    item.appendChild(lbl);
    item.addEventListener("click", () => {
      // scroll to corresponding moment
      m.scrollIntoView({ behavior: "smooth", block: "center" });
      const img = m.querySelector(".moment-photo");
      if (img) {
        img.animate([{ transform: "scale(1)" }, { transform: "scale(1.12)" }], {
          duration: 400,
          iterations: 2,
          direction: "alternate",
        });
      }
      if (i === treasure) {
        showToast("🏆 Você encontrou o tesouro!");
        item.classList.add("found");
        for (let k = 0; k < 12; k++) {
          const sp = document.createElement("span");
          sp.className = "sparkle";
          sp.textContent = "✨";
          document.body.appendChild(sp);
          setTimeout(() => sp.remove(), 800);
        }
      }
    });
    tl.appendChild(item);
  });
  // keyboard navigation
  tl.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") tl.scrollBy({ left: 240, behavior: "smooth" });
    if (e.key === "ArrowLeft") tl.scrollBy({ left: -240, behavior: "smooth" });
  });
  tl.addEventListener("focus", () => {
    document.body.style.overflow = "hidden";
  });
  tl.addEventListener("blur", () => {
    document.body.style.overflow = "";
  });
})();

/* ── Galeria mosaico ─────────────── */
const allPhotos = [
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.02.jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.03 (1).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.03 (2).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.03 (3).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.03 (4).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.03.jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.04 (1).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.04 (2).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.04 (3).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.04.jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.05 (1).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.05 (2).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.05 (3).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.05 (4).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.05.jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.06 (1).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.06 (2).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.06 (3).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.06 (4).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.06 (5).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.06.jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.07 (1).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.07 (2).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.07 (3).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.07 (4).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.07.jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.08 (1).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.08 (2).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.08 (3).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.08 (4).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.08 (5).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.08.jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.09 (1).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-07 at 11.36.09.jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.46.01.jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.46.02 (1).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.46.02 (2).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.46.02 (3).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.46.02.jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.47.02 (1).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.47.02.jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.47.03 (1).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.47.03 (2).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.47.03 (3).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.47.03 (4).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.47.03 (5).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.47.03 (6).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.47.03.jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.47.04 (1).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.47.04 (2).jpeg",
  "FOTOS MOZINHO/WhatsApp Image 2026-03-08 at 06.47.04.jpeg",
];

const galleryPhotos = [...new Set(allPhotos)];

function toWebpPath(src) {
  return src.replace(/\.jpe?g$/i, ".webp");
}

function hasWebpVariant(src) {
  // The 2026-03-07 batch has generated WEBP files; the newer batch is JPEG-only for now.
  return src.includes("2026-03-07");
}

function setBestSource(imgEl, src) {
  const encodedJpegSrc = encodeURI(src);
  const rawJpegSrc = src;

  function handleFatalError() {
    const picture = imgEl.closest("picture");
    if (picture) {
      picture.remove();
      return;
    }
    imgEl.style.opacity = "0.25";
  }

  if (!hasWebpVariant(src)) {
    imgEl.onerror = () => {
      if (imgEl.src !== rawJpegSrc) {
        imgEl.src = rawJpegSrc;
        return;
      }
      handleFatalError();
    };
    imgEl.src = encodedJpegSrc;
    return;
  }

  const webpSrc = encodeURI(toWebpPath(src));
  const jpegSrc = encodedJpegSrc;
  imgEl.onerror = () => {
    if (imgEl.src !== jpegSrc) {
      // Fallback to JPEG when WEBP is unavailable.
      imgEl.src = jpegSrc;
      return;
    }
    if (imgEl.src !== rawJpegSrc) {
      // Final fallback for edge cases with encoded paths.
      imgEl.src = rawJpegSrc;
      return;
    }
    handleFatalError();
  };
  imgEl.src = webpSrc;
}

let lbIndex = 0;
const mosaic = document.getElementById("mosaic");
galleryPhotos.forEach((src, i) => {
  const picture = document.createElement("picture");
  const img = document.createElement("img");
  img.alt = "Memória nossa";
  img.loading = "lazy";
  img.decoding = "async";
  if (i < 6) img.fetchPriority = "high";
  img.style.setProperty("--rand", Math.random());
  img.addEventListener("click", () => openLb(i));
  if (hasWebpVariant(src)) {
    const webp = document.createElement("source");
    webp.srcset = encodeURI(toWebpPath(src));
    webp.type = "image/webp";
    picture.appendChild(webp);
  }
  setBestSource(img, src);
  picture.appendChild(img);
  mosaic.appendChild(picture);
});

// rotate moment photos periodically (rodízio)
const momentPics = Array.from(document.querySelectorAll(".moment-photo"));
function cycleMoments() {
  if (momentPics.length === 0) return;
  const lastSrc = momentPics[momentPics.length - 1].src;
  for (let i = momentPics.length - 1; i > 0; i--) {
    momentPics[i].src = momentPics[i - 1].src;
  }
  momentPics[0].src = lastSrc;
}
setInterval(cycleMoments, 10000);

/* ── Lightbox com navegação ──────── */
let lbMainImage;

function ensureLightboxImage() {
  if (lbMainImage) return lbMainImage;
  const carousel = document.getElementById("carousel");
  carousel.innerHTML = "";
  const slide = document.createElement("div");
  slide.className = "slide active";
  const img = document.createElement("img");
  img.alt = "Memória";
  img.loading = "eager";
  img.decoding = "sync";
  slide.appendChild(img);
  carousel.appendChild(slide);
  lbMainImage = img;
  return img;
}

function renderLightboxPhoto() {
  const img = ensureLightboxImage();
  setBestSource(img, galleryPhotos[lbIndex]);
}

function openLb(i) {
  lbIndex = i;
  const lightboxEl = document.getElementById("lightbox");
  renderLightboxPhoto();
  lightboxEl.setAttribute("aria-hidden", "false");
  lightboxEl.classList.add("open");
  lightboxEl.focus();
}
document.getElementById("lb-close").addEventListener("click", () => {
  const lb = document.getElementById("lightbox");
  lb.setAttribute("aria-hidden", "true");
  lb.classList.remove("open");
});
document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
});
document.getElementById("lb-prev").addEventListener("click", () => {
  lbIndex = (lbIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
  renderLightboxPhoto();
});
document.getElementById("lb-next").addEventListener("click", () => {
  lbIndex = (lbIndex + 1) % galleryPhotos.length;
  renderLightboxPhoto();
});
document.addEventListener("keydown", (e) => {
  if (!document.getElementById("lightbox").classList.contains("open")) return;
  if (e.key === "ArrowLeft") document.getElementById("lb-prev").click();
  if (e.key === "ArrowRight") document.getElementById("lb-next").click();
  if (e.key === "Escape")
    document.getElementById("lightbox").classList.remove("open");
});

// Swipe support for mobile on carousel
let startX = 0;
const carouselElement = document.getElementById("carousel");
if (carouselElement) {
  carouselElement.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });
  carouselElement.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      // threshold
      if (diff > 0)
        document.getElementById("lb-next").click(); // swipe left
      else document.getElementById("lb-prev").click(); // swipe right
    }
  });
}

/* ── Scroll reveal ───────────────── */
// Lazily create the audio context to avoid autoplay restrictions before user interaction.
let audioCtx;
function getAudioCtx() {
  if (!audioCtx)
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function tone(freq, dur) {
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.stop(ctx.currentTime + dur);
}

const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        if (e.target.classList.contains("moment")) {
          const idx = parseInt(e.target.dataset.index || 0, 10);
          const freq = 350 + idx * 40;
          tone(freq, 0.3);
        }
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
document
  .querySelectorAll("[data-reveal]")
  .forEach((el) => revealObs.observe(el));

/* ── Typewriter ──────────────────── */
const phrases = [
  "Minha parceira de vida e de código 💻",
  "Feliz Dia das Mulheres, meu amor ❤️",
  "Obrigado por cuidar tanto de mim 🌸",
  "Com você, todo bug tem solução 💫",
];
let pi = 0,
  ci = 0,
  deleting = false;
function type() {
  const el = document.getElementById("typewriter");
  const cur = phrases[pi];
  if (!deleting) {
    el.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) {
      deleting = true;
      setTimeout(type, 2200);
      return;
    }
  } else {
    el.textContent = cur.slice(0, --ci);
    if (ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 48 : 72);
}
setTimeout(type, 1800);

/* ── Sparkle no clique ───────────── */
document.addEventListener("click", (e) => {
  if (window.innerWidth < 600) return; // skip sparkles on phones
  for (let i = 0; i < 7; i++) {
    const sp = document.createElement("span");
    sp.className = "sparkle";
    sp.textContent = ["✨", "💫", "🌟", "💥", "💎"][
      Math.floor(Math.random() * 5)
    ];
    const size = Math.random() * 18 + 14;
    sp.style.cssText = `left:${e.clientX + (Math.random() - 0.5) * 60}px;top:${e.clientY + window.scrollY + (Math.random() - 0.5) * 60}px;font-size:${size}px`;
    document.body.appendChild(sp);
    setTimeout(() => sp.remove(), 750);
  }
});

/* ── Corações + estrelas flutuantes ─ */
(function () {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", resize);

  const particles = Array.from(
    { length: window.innerWidth < 600 ? 12 : 36 },
    () => mkParticle(),
  );
  function mkParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight,
      type: Math.random() > 0.5 ? "heart" : "star",
      size: Math.random() * 12 + 6,
      speed: Math.random() * 0.6 + 0.15,
      alpha: Math.random() * 0.3 + 0.06,
      drift: (Math.random() - 0.5) * 0.45,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    };
  }

  function drawHeart(x, y, s, a) {
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = "#f06292";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y - s / 2, x - s, y - s / 2, x - s, y);
    ctx.bezierCurveTo(x - s, y + s * 0.6, x, y + s * 1.1, x, y + s * 1.3);
    ctx.bezierCurveTo(x, y + s * 1.1, x + s, y + s * 0.6, x + s, y);
    ctx.bezierCurveTo(x + s, y - s / 2, x, y - s / 2, x, y);
    ctx.fill();
    ctx.restore();
  }

  function drawStar(x, y, s, a, rot) {
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = "#f9d423";
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const ang = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? s : s * 0.42;
      ctx[i === 0 ? "moveTo" : "lineTo"](r * Math.cos(ang), r * Math.sin(ang));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      if (p.type === "heart") drawHeart(p.x, p.y, p.size, p.alpha);
      else drawStar(p.x, p.y, p.size, p.alpha, p.rot);
      p.y -= p.speed;
      p.x += p.drift;
      p.rot += p.rotSpeed;
      p.alpha -= 0.00025;
      if (p.y < -40 || p.alpha <= 0) {
        Object.assign(p, mkParticle());
        p.y = canvas.height + 20;
        p.x = Math.random() * canvas.width;
        p.alpha = Math.random() * 0.3 + 0.06;
      }
    });
    requestAnimationFrame(tick);
  }
  tick();
})();
