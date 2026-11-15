(function () {
  "use strict";

  const C = window.INVITE || {};
  const S = C.sections || {};
  const on = (key) => S[key] !== false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const nl = (s) => esc(s).replace(/\n/g, "<br>");
  // Tamil runs inside letter-spaced labels need normal spacing or the glyphs split apart
  const ta = (s) => esc(s).replace(/[\u0B80-\u0BFF][\u0B80-\u0BFF\s]*/g, (m) => `<span class="ta">${m.trimEnd()}</span>${m.slice(m.trimEnd().length)}`);
  const opt = (value, html) => (value ? html : "");

  const params = new URLSearchParams(location.search);
  const guestName = (params.get((C.guest && C.guest.urlParam) || "to") || "").trim().slice(0, 80);

  /* -------------------------------------------------------------------
     SVG pieces
     ------------------------------------------------------------------- */
  const DEFS = `
  <svg class="svg-defs" aria-hidden="true" focusable="false"><defs>
    <linearGradient id="g-gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6e4a10"/><stop offset=".25" stop-color="#c99a32"/>
      <stop offset=".45" stop-color="#fff0b8"/><stop offset=".6" stop-color="#e2bf5c"/>
      <stop offset=".85" stop-color="#9c7020"/><stop offset="1" stop-color="#5a3c0c"/>
    </linearGradient>
    <linearGradient id="g-gold-v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff0b8"/><stop offset=".5" stop-color="#d4af37"/><stop offset="1" stop-color="#8a6418"/>
    </linearGradient>
    <linearGradient id="g-leaf" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f6e3a1"/><stop offset=".5" stop-color="#c99a32"/><stop offset="1" stop-color="#7a5212"/>
    </linearGradient>
    <radialGradient id="g-marigold" cx=".4" cy=".35" r=".7">
      <stop offset="0" stop-color="#ffe08a"/><stop offset=".45" stop-color="#f5a623"/>
      <stop offset=".85" stop-color="#d9660b"/><stop offset="1" stop-color="#a24d05"/>
    </radialGradient>
    <linearGradient id="g-line-l" gradientUnits="userSpaceOnUse" x1="8" y1="0" x2="118" y2="0">
      <stop offset="0" stop-color="#d4af37" stop-opacity="0"/><stop offset="1" stop-color="#d4af37" stop-opacity=".9"/>
    </linearGradient>
    <linearGradient id="g-line-r" gradientUnits="userSpaceOnUse" x1="182" y1="0" x2="292" y2="0">
      <stop offset="0" stop-color="#d4af37" stop-opacity=".9"/><stop offset="1" stop-color="#d4af37" stop-opacity="0"/>
    </linearGradient>
  </defs></svg>`;

  const divider = () => `
  <svg class="divider" viewBox="0 0 300 30" fill="none" aria-hidden="true">
    <path d="M8 15 H118" stroke="url(#g-line-l)"/>
    <path d="M182 15 H292" stroke="url(#g-line-r)"/>
    <circle cx="125" cy="15" r="2" fill="#d4af37"/><circle cx="175" cy="15" r="2" fill="#d4af37"/>
    <path d="M150 2 L163 15 L150 28 L137 15Z" stroke="#d4af37"/>
    <path d="M150 8 L157 15 L150 22 L143 15Z" fill="url(#g-gold-v)"/>
  </svg>`;

  const lotus = () => `
  <svg class="lotus" viewBox="0 0 120 60" fill="none" stroke="#d4af37" stroke-width="1.2" aria-hidden="true">
    <path d="M60 6 C70 20 70 38 60 52 C50 38 50 20 60 6Z" fill="url(#g-gold-v)" fill-opacity=".3"/>
    <path d="M60 52 C48 46 36 30 34 16 C46 20 56 34 60 52Z"/>
    <path d="M60 52 C72 46 84 30 86 16 C74 20 64 34 60 52Z"/>
    <path d="M60 52 C44 52 24 44 14 32 C30 30 48 40 60 52Z"/>
    <path d="M60 52 C76 52 96 44 106 32 C90 30 72 40 60 52Z"/>
    <path d="M22 57 H98" stroke-opacity=".6"/>
  </svg>`;

  const corners = () =>
    ["tl", "tr", "bl", "br"]
      .map(
        (p) => `
  <svg class="corner ${p}" viewBox="0 0 60 60" fill="none" stroke="url(#g-gold-v)" stroke-width="1.2" aria-hidden="true">
    <path d="M3 57 V22 Q3 3 22 3 H57"/>
    <path d="M9 57 V27 Q9 9 27 9 H57" stroke-opacity=".55"/>
    <path d="M15 15 q10 -1 13 9 q-10 1 -13 -9z" fill="url(#g-gold-v)" fill-opacity=".8"/>
    <circle cx="3" cy="57" r="2" fill="#d4af37" stroke="none"/>
    <circle cx="57" cy="3" r="2" fill="#d4af37" stroke="none"/>
  </svg>`
      )
      .join("");

  function mandala() {
    let s = "";
    const ring = (n, R, rx, ry, attrs = "") => {
      for (let i = 0; i < n; i++) {
        s += `<ellipse cx="0" cy="${-R}" rx="${rx}" ry="${ry}" transform="rotate(${((360 / n) * i).toFixed(2)})" ${attrs}/>`;
      }
    };
    s += `<circle r="22"/><circle r="40"/>`;
    ring(8, 64, 12, 24);
    ring(8, 64, 4, 12, `fill="#d4af37" fill-opacity=".35"`);
    s += `<circle r="96"/><circle r="102" stroke-dasharray="1 5"/>`;
    ring(24, 136, 9, 32);
    ring(24, 120, 2, 2, `fill="#d4af37"`);
    s += `<circle r="172"/><circle r="180" stroke-dasharray="2 6"/>`;
    ring(36, 206, 6, 22);
    s += `<circle r="232"/>`;
    ring(72, 246, 1.8, 1.8, `fill="#d4af37"`);
    return `<svg class="mandala" viewBox="-260 -260 520 520" fill="none" stroke="#d4af37" stroke-width="1" aria-hidden="true">${s}</svg>`;
  }

  function thoranam(width) {
    const w = Math.max(320, Math.round(width));
    const segs = Math.max(2, Math.round(w / 380));
    const segW = w / segs;
    const top = 6;
    const sag = 16;
    const yAt = (x) => top + sag * Math.sin(Math.PI * ((x % segW) / segW));

    let d = `M0 ${top}`;
    for (let x = 4; x <= w; x += 4) d += ` L${x} ${yAt(x).toFixed(1)}`;

    const marigold = (cy, r) => `
      <circle cy="${cy}" r="${r}" fill="url(#g-marigold)"/>
      <circle cy="${cy}" r="${(r * 0.55).toFixed(1)}" fill="none" stroke="#a24d05" stroke-width=".7" opacity=".7"/>
      <circle cy="${cy}" r="${(r * 0.25).toFixed(1)}" fill="#8a3a02"/>`;

    const gap = w < 600 ? 22 : 26;
    const n = Math.floor(w / gap);
    const offset = (w - (n - 1) * gap) / 2;
    let items = "";
    for (let i = 0; i < n; i++) {
      const x = offset + i * gap;
      const y = yAt(x);
      const delay = (-(i * 0.37) % 3.6).toFixed(2);
      let inner;
      if (i % 5 === 2) {
        inner = `<path d="M0 0 V56" stroke="#d4af37" stroke-width=".8"/>${marigold(10, 7)}${marigold(25, 7)}${marigold(40, 6)}<circle cy="54" r="2.5" fill="#f6e3a1"/>`;
      } else {
        const L = 38 + ((i * 7) % 10);
        inner = `<path d="M0 0 C11 8 12 ${(L * 0.65).toFixed(1)} 0 ${L} C-12 ${(L * 0.65).toFixed(1)} -11 8 0 0Z" fill="url(#g-leaf)" stroke="#5a3c0c" stroke-width=".6"/><path d="M0 3 V${L - 4}" stroke="#5a3c0c" stroke-width=".6" opacity=".55"/>`;
      }
      items += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="sway" style="--d:${delay}s">${inner}</g></g>`;
    }

    let hooks = "";
    for (let k = 0; k <= segs; k++) {
      hooks += `<g transform="translate(${(k * segW).toFixed(1)} ${top})">${marigold(0, 9)}</g>`;
    }

    return `<svg viewBox="0 0 ${w} 92" aria-hidden="true"><path d="${d}" stroke="#d4af37" stroke-width="1.5" fill="none"/>${items}${hooks}</svg>`;
  }

  const ICON = {
    calendar: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`,
    clock: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
    pin: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>`,
    map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>`,
  };

  /* -------------------------------------------------------------------
     Sections
     ------------------------------------------------------------------- */
  const g = (C.couple && C.couple.groom) || {};
  const b = (C.couple && C.couple.bride) || {};
  const ev = C.event || {};

  function introHTML() {
    const i = C.intro || {};
    const gc = C.guest || {};
    return `
    <div id="intro" role="button" tabindex="0" aria-label="Open the invitation">
      <div class="door door-left"><div class="door-frame"></div><div class="door-arch">${lotus()}</div><span class="knocker"></span></div>
      <div class="door door-right"><div class="door-frame"></div><div class="door-arch">${lotus()}</div><span class="knocker"></span></div>
      <div class="seal">
        ${mandala()}
        ${opt(i.eyebrow, `<p class="eyebrow">${ta(i.eyebrow)}</p>`)}
        <div class="seal-monogram gold-text">${esc(g.initial)}<span class="amp">&amp;</span>${esc(b.initial)}</div>
        ${opt(guestName, `<p class="seal-guest">${esc(gc.greeting)} ${esc(guestName)},<br>${esc(gc.invitedLine)}</p>`)}
        <p class="seal-tap">${esc(i.tapText)}${opt(i.tapTextTamil, `<span class="tamil">${esc(i.tapTextTamil)}</span>`)}</p>
      </div>
    </div>`;
  }

  function heroHTML() {
    const h = C.hero || {};
    const inv = C.invocation || {};
    const gc = C.guest || {};
    return `
    <section class="hero page" id="top">
      <div class="thoranam" id="thoranam"></div>
      <div class="hero-inner">
        ${opt(inv.symbol || inv.line, `
        <div class="invocation reveal">
          ${opt(inv.symbol, `<span class="symbol gold-text">${esc(inv.symbol)}</span>`)}
          ${opt(inv.line, `<span class="line tamil">${esc(inv.line)}</span>`)}
        </div>`)}
        ${opt(guestName, `<p class="hero-guest reveal">${esc(gc.greeting)} ${esc(guestName)},</p>`)}
        ${opt(h.preTitle, `<p class="eyebrow reveal" data-delay="1">${ta(h.preTitle)}</p>`)}
        <div class="names-wrap reveal" data-delay="2">
          ${mandala()}
          <h1 class="names">
            <span class="name gold-text">${esc(g.name)}</span>
            <span class="amp">&amp;</span>
            <span class="name gold-text">${esc(b.name)}</span>
          </h1>
          ${opt(g.tamilName && b.tamilName, `<p class="hero-tamil-names tamil">${esc(g.tamilName)} · ${esc(b.tamilName)}</p>`)}
        </div>
        <div class="reveal" data-delay="3">
          ${opt(h.announce, `<p class="announce">${esc(h.announce)}</p>`)}
          ${opt(ev.tamilName, `<p class="hero-event gold-text">${esc(ev.tamilName)}</p>`)}
          ${opt(ev.subtitle, `<p class="hero-event-sub">${ta(ev.subtitle)}</p>`)}
          ${divider()}
          <p class="hero-date">${esc([ev.dayText, ev.dateText].filter(Boolean).join(" · "))}</p>
        </div>
      </div>
    </section>`;
  }

  function storyHTML() {
    const s = C.story || {};
    const cd = C.countdown || {};
    const photos = (s.photos || []).filter((p) => p && p.src);
    return `
    <section class="section page" id="story">
      <div class="container">
        ${on("countdown") ? `
        <div class="countdown reveal">
          <p class="eyebrow">${ta(cd.eyebrow)} ${ta(cd.label)}</p>
          <div class="countdown-grid" id="countdown"></div>
        </div>
        <div class="page-sep reveal" data-delay="1">${lotus()}</div>` : ""}
        <header class="section-head reveal" data-delay="2">
          ${opt(s.eyebrow, `<p class="eyebrow">${ta(s.eyebrow)}</p>`)}
          ${opt(s.tamilTitle, `<h2 class="tamil-title gold-text">${esc(s.tamilTitle)}</h2>`)}
          ${divider()}
        </header>
        ${photos.length ? `
        <div class="photos photos-${Math.min(photos.length, 3)}">
          ${photos
            .map(
              (p, i) => `
            <figure class="photo reveal" data-delay="${Math.min(i + 1, 4)}">
              <div class="photo-frame"><img src="${esc(p.src)}" alt="${esc(p.alt || "")}" loading="lazy"></div>
              ${opt(p.caption, `<figcaption>${esc(p.caption)}</figcaption>`)}
            </figure>`
            )
            .join("")}
        </div>` : ""}
        ${opt(s.text, `<p class="story-text reveal" data-delay="3">${nl(s.text)}</p>`)}
      </div>
    </section>`;
  }

  function invitationHTML() {
    const v = C.venue || {};
    const link = v.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.mapsQuery || v.name)}`;
    const embed = `https://www.google.com/maps?q=${encodeURIComponent(v.mapsQuery || v.name)}&output=embed`;
    return `
    <section class="section page" id="invitation">
      <div class="container">
        <article class="event-card card reveal">
          ${corners()}
          ${lotus()}
          ${opt(ev.cardTitle, `<h2 class="event-title gold-text">${ta(ev.cardTitle)}</h2>`)}
          ${opt(ev.cardSubtitle, `<p class="event-sub">${ta(ev.cardSubtitle)}</p>`)}
          <div class="event-details">
            <div class="event-row">${ICON.calendar}<strong>${esc([ev.dayText, ev.dateText].filter(Boolean).join(", "))}</strong>${opt(ev.tamilDate, `<span class="tamil">${nl(ev.tamilDate)}</span>`)}</div>
            <div class="event-row">${ICON.clock}<strong>${esc(ev.timeText)}</strong></div>
            ${opt(v.name, `<div class="event-row">${ICON.pin}<strong>${esc(v.name)}</strong><span>${nl(v.address)}</span></div>`)}
          </div>
          ${v.showMap !== false ? `<div class="event-map"><iframe src="${esc(embed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map to ${esc(v.name)}"></iframe></div>` : ""}
          <div class="btn-row"><a class="btn" href="${esc(link)}" target="_blank" rel="noopener">${ICON.map}Get directions</a></div>
        </article>
      </div>
    </section>`;
  }

  function closingHTML() {
    const c = C.closing || {};
    const side = (s = {}) => `
      <div class="family">
        <div class="family-names">${(s.names || [])
          .map((n) => (typeof n === "string" ? { name: n } : n))
          .map((n) => `<p class="family-person">${esc(n.name)}${opt(n.title, `<span class="family-title">${nl(n.title)}</span>`)}</p>`)
          .join("")}</div>
        ${opt(s.label, `<p class="family-label">${ta(s.label)}</p>`)}
        ${opt(s.tamilLabel, `<span class="tamil">${esc(s.tamilLabel)}</span>`)}
      </div>`;
    return `
    <section class="section page closing" id="closing">
      <div class="container">
        <header class="reveal">
          ${divider()}
          ${opt(c.tamilTitle, `<h2 class="closing-tamil tamil gold-text">${esc(c.tamilTitle)}</h2>`)}
          ${opt(c.englishLine, `<p class="closing-en">${esc(c.englishLine)}</p>`)}
        </header>
        <div class="families-grid reveal">
          ${side(c.groomSide)}
          <div class="families-sep" aria-hidden="true"></div>
          ${side(c.brideSide)}
        </div>
        ${opt(c.saying && c.saying.text, `
        <figure class="saying reveal">
          ${divider()}
          <blockquote class="saying-text tamil gold-text">${nl(c.saying.text)}</blockquote>
          ${opt(c.saying.meaning, `<p class="saying-meaning">${nl(c.saying.meaning)}</p>`)}
          ${opt(c.saying.source, `<figcaption class="saying-source">${ta(c.saying.source)}</figcaption>`)}
        </figure>`)}
      </div>
    </section>`;
  }

  /* -------------------------------------------------------------------
     Behaviour
     ------------------------------------------------------------------- */
  function startCountdown() {
    const el = document.getElementById("countdown");
    if (!el || !ev.start) return;
    const target = new Date(ev.start).getTime();
    const units = [["Days", 86400], ["Hours", 3600], ["Mins", 60], ["Secs", 1]];
    el.innerHTML = units
      .map(([label]) => `<div class="cd-unit"><span class="cd-num gold-text" data-u="${label}">00</span><span class="cd-label">${label}</span></div>`)
      .join("");
    const nums = el.querySelectorAll(".cd-num");
    const tick = () => {
      let diff = Math.floor((target - Date.now()) / 1000);
      if (diff <= 0) {
        el.innerHTML = `<p class="cd-done">${esc((C.countdown || {}).doneText)}</p>`;
        clearInterval(timer);
        return;
      }
      units.forEach(([, size], i) => {
        const v = Math.floor(diff / size);
        diff -= v * size;
        nums[i].textContent = String(v).padStart(2, "0");
      });
    };
    const timer = setInterval(tick, 1000);
    tick();
  }

  // Shrinks each group of names to one shared size so the longest still fits its container
  function fitNames() {
    const groups = [".names .name"];
    groups.forEach((sel) => {
      const els = [...document.querySelectorAll(sel)];
      els.forEach((el) => (el.style.fontSize = ""));
      let size = Infinity;
      els.forEach((el) => {
        const natural = parseFloat(getComputedStyle(el).fontSize);
        const room = el.parentElement.clientWidth;
        const ratio = el.scrollWidth > room ? room / el.scrollWidth : 1;
        size = Math.min(size, Math.floor(natural * ratio * 0.98));
      });
      if (Number.isFinite(size)) els.forEach((el) => (el.style.fontSize = `${size}px`));
    });
  }

  function mountThoranam() {
    const el = document.getElementById("thoranam");
    if (!el) return;
    let lastW = 0;
    const draw = () => {
      const w = el.clientWidth || window.innerWidth;
      if (Math.abs(w - lastW) < 40) return;
      lastW = w;
      el.innerHTML = thoranam(w);
    };
    draw();
    let t;
    window.addEventListener("resize", () => {
      clearTimeout(t);
      t = setTimeout(draw, 200);
    });
  }

  function observeReveals() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    // Reveal a whole page as it starts sliding in, so it never arrives empty mid-swipe
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".page").forEach((p) => io.observe(p));
  }

  /* Falling jasmine & marigold petals */
  function Petals(canvas) {
    const ctx = canvas.getContext("2d");
    const colors = ["#f5a623", "#f3c969", "#e9892b", "#f6e3a1", "#d4af37"];
    let W = 0;
    let H = 0;
    let parts = [];
    let running = false;
    const rand = (a, b) => a + Math.random() * (b - a);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function make(y) {
      const jasmine = Math.random() < 0.35;
      return {
        x: rand(0, W),
        y: y ?? rand(-H, 0),
        size: jasmine ? rand(4, 6.5) : rand(4, 8),
        jasmine,
        color: colors[(Math.random() * colors.length) | 0],
        vx: rand(-0.25, 0.25),
        vy: rand(0.35, 0.9),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.02, 0.02),
        phase: rand(0, Math.PI * 2),
        swing: rand(0.008, 0.02),
        alpha: rand(0.55, 0.95),
      };
    }

    function drawJasmine(p) {
      ctx.fillStyle = "#fffaf0";
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.ellipse(0, -p.size * 0.7, p.size * 0.38, p.size * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = "#f3c969";
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawPetal(p) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.quadraticCurveTo(p.size * 0.8, 0, 0, p.size);
      ctx.quadraticCurveTo(-p.size * 0.8, 0, 0, -p.size);
      ctx.fill();
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.phase += p.swing;
        p.x += p.vx + Math.sin(p.phase) * 0.5;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > H + 20) Object.assign(p, make(-20));
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, 0.6 + 0.4 * Math.abs(Math.cos(p.phase)));
        p.jasmine ? drawJasmine(p) : drawPetal(p);
        ctx.restore();
      }
      if (running) requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);

    return {
      start() {
        if (running) return;
        const count = Math.round(Math.min(42, Math.max(18, W / 32)));
        for (let i = 0; i < count; i++) parts.push(make());
        running = true;
        requestAnimationFrame(frame);
      },
    };
  }

  // Volume envelope: eased fade in at the start of the clip, fade out before its end
  const smooth = (x) => x * x * (3 - 2 * x);
  const envelope = (t, start, end, fadeIn = 4, fadeOut = 5) =>
    smooth(Math.max(0, Math.min(1, (t - start) / fadeIn, end ? (end - t) / fadeOut : 1)));

  function filePlayer(m, onChange, onFail) {
    const audio = new Audio(m.src);
    const start = m.startAt || 0;
    const vol = m.volume ?? 0.6;
    const endOf = () => m.endAt || audio.duration || 0;
    audio.preload = "auto";

    // iOS ignores audio.volume, so fades go through a Web Audio gain node when available
    let ctx = null;
    let gain = null;
    const setLevel = (v) => {
      if (gain) gain.gain.value = v;
      else audio.volume = v;
    };
    // "duck" eases the pause button in and out: 0 = silent, 1 = full envelope level
    const DUCK_SECONDS = 1.2;
    let duck = 0;
    let duckTarget = 1;
    let last = 0;
    let raf;
    const tick = (now) => {
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      const step = dt / DUCK_SECONDS;
      duck = duckTarget > duck ? Math.min(duckTarget, duck + step) : Math.max(duckTarget, duck - step);
      if (m.endAt && audio.currentTime >= m.endAt) audio.currentTime = start;
      setLevel(vol * envelope(audio.currentTime, start, endOf()) * smooth(duck));
      if (duckTarget === 0 && duck === 0) {
        audio.pause();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    let begun = false;
    audio.addEventListener("ended", () => {
      audio.currentTime = start;
      audio.play().catch(() => {});
    });
    audio.addEventListener("play", () => {
      cancelAnimationFrame(raf);
      last = 0;
      raf = requestAnimationFrame(tick);
      onChange(true);
    });
    audio.addEventListener("pause", () => {
      cancelAnimationFrame(raf);
      onChange(false);
    });
    audio.addEventListener("error", onFail);
    return {
      play() {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!ctx && AC) {
          try {
            ctx = new AC();
            gain = ctx.createGain();
            ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
          } catch (e) {
            gain = null;
          }
        }
        if (ctx && ctx.state === "suspended") ctx.resume();
        if (!begun) {
          begun = true;
          audio.currentTime = start;
          duck = 1;
        }
        duckTarget = 1;
        if (!audio.paused) {
          onChange(true);
          return;
        }
        setLevel(0);
        audio.play().catch(() => onChange(false));
      },
      pause() {
        duckTarget = 0;
        // Show the paused state right away while the sound fades out
        onChange(false);
      },
    };
  }

  function youtubePlayer(m, onChange, onFail) {
    const y = m.youtube;
    const start = y.start || 0;
    const end = y.end || 0;
    const vol = Math.round((m.volume ?? 0.6) * 100);
    const host = document.createElement("div");
    host.className = "yt-host";
    host.setAttribute("aria-hidden", "true");
    host.innerHTML = `<div id="yt-player"></div>`;
    document.body.appendChild(host);

    let player;
    let ready = false;
    let wanted = false;
    let fader;
    const fade = () => {
      clearInterval(fader);
      fader = setInterval(() => {
        const t = player.getCurrentTime();
        player.setVolume(Math.round(vol * envelope(t, start, end)));
        if (end && t >= end - 0.2) {
          player.seekTo(start, true);
        }
      }, 150);
    };

    window.onYouTubeIframeAPIReady = () => {
      player = new YT.Player("yt-player", {
        videoId: y.id,
        width: 200,
        height: 200,
        playerVars: { start, controls: 0, disablekb: 1, playsinline: 1, rel: 0, fs: 0, iv_load_policy: 3 },
        events: {
          onReady() {
            ready = true;
            player.setVolume(0);
            if (wanted) player.playVideo();
          },
          onStateChange(e) {
            if (e.data === YT.PlayerState.ENDED) {
              player.seekTo(start, true);
              player.playVideo();
              return;
            }
            const playing = e.data === YT.PlayerState.PLAYING;
            if (playing) fade();
            else if (e.data === YT.PlayerState.PAUSED) clearInterval(fader);
            onChange(playing);
          },
          onError(e) {
            // 101 / 150: the owner has disabled embedding; 100: video removed
            if ([100, 101, 150].includes(e.data)) onFail();
          },
        },
      });
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);

    return {
      play() {
        wanted = true;
        if (ready) player.playVideo();
      },
      pause() {
        wanted = false;
        if (ready) player.pauseVideo();
      },
    };
  }

  function setupMusic() {
    const m = C.music || {};
    const useYoutube = m.youtube && m.youtube.id;
    if (!m.src && !useYoutube) return { play() {}, reveal() {} };

    const root = document.getElementById("music-root");
    root.innerHTML = `
      <button class="music-btn" id="music-btn" type="button" aria-label="Play music">
        <span class="bar"></span><span class="bar"></span><span class="bar"></span><span class="bar"></span>
      </button>
      <div class="toast" id="toast"></div>`;
    const btn = document.getElementById("music-btn");
    const toast = document.getElementById("toast");
    let playing = false;
    let titleShown = false;
    let toastTimer;

    const say = (text, ms = 4500) => {
      if (!text) return;
      toast.textContent = text;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), ms);
    };
    const onChange = (isPlaying) => {
      playing = isPlaying;
      btn.classList.toggle("playing", playing);
      btn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
      if (playing) {
        btn.classList.remove("nudge");
        if (!titleShown && m.title) {
          titleShown = true;
          say(`♪ ${m.title}`);
        }
      }
    };

    let failed = false;
    const fail = () => {
      failed = true;
      root.remove();
    };
    const player = useYoutube ? youtubePlayer(m, onChange, fail) : filePlayer(m, onChange, fail);
    btn.addEventListener("click", () => (playing ? player.pause() : player.play()));

    return {
      play() {
        player.play();
        // Phones may refuse sound that isn't started by a direct tap on the player
        setTimeout(() => {
          if (!playing && !failed) {
            btn.classList.add("nudge");
            say(m.tapHint || "Tap ♪ for music", 6000);
          }
        }, 3500);
      },
      reveal() {
        btn.classList.add("show");
      },
    };
  }

  function init() {
    if (C.pageTitle) document.title = C.pageTitle;
    Object.entries(C.theme || {}).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    document.body.insertAdjacentHTML("afterbegin", DEFS);

    const main = document.getElementById("invite");
    const after = [];
    if (on("story")) after.push(storyHTML());
    if (on("invitation")) after.push(invitationHTML());
    if (on("closing")) after.push(closingHTML());
    main.innerHTML = heroHTML() + after.join("");

    mountThoranam();
    fitNames();
    if (document.fonts) document.fonts.ready.then(fitNames);
    let fitTimer;
    window.addEventListener("resize", () => {
      clearTimeout(fitTimer);
      fitTimer = setTimeout(fitNames, 200);
    });
    startCountdown();

    const petals = reduceMotion ? null : Petals(document.getElementById("petals"));
    const music = setupMusic();

    const begin = () => {
      document.body.classList.remove("locked");
      observeReveals();
      music.reveal();
      if (petals) petals.start();
    };

    if (!on("intro")) {
      begin();
      return;
    }

    const root = document.getElementById("intro-root");
    root.innerHTML = introHTML();
    const intro = document.getElementById("intro");
    const open = () => {
      if (intro.classList.contains("open")) return;
      intro.classList.add("open");
      music.play();
      window.scrollTo(0, 0);
      setTimeout(begin, 500);
      setTimeout(() => root.remove(), 2800);
    };
    intro.addEventListener("click", open);
    intro.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });
    intro.focus({ preventScroll: true });
  }

  init();
})();

