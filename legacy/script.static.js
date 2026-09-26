/* ==========================================================================
   CYPTION DIGITAL — Master GSAP & Three.js Responsive Interaction Engine
   Digital Growth Agency: Brand. Creative. Technology. Performance.
   ========================================================================== */

const inertiaAvailable = typeof window.InertiaPlugin !== "undefined";
gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin, Flip, TextPlugin, ScrollToPlugin);
if (inertiaAvailable) gsap.registerPlugin(window.InertiaPlugin);

// Breakpoint Constants
const BP = { xs: 360, sm: 480, md: 768, lg: 1024, xl: 1280, xxl: 1600 };
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

document.body.style.overflow = "hidden";

// SplitText Alternative: preserves word wrapping so characters never break vertically
function splitChars(element, byWordOnly = false) {
  if (element.dataset.split) return element.querySelectorAll(byWordOnly ? ".word" : ".char");
  element.dataset.split = "true";
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const text = node.textContent;
    const fragment = document.createDocumentFragment();
    const words = text.split(/(\s+)/);

    words.forEach((chunk) => {
      if (/^\s+$/.test(chunk)) {
        fragment.appendChild(document.createTextNode(chunk));
      } else if (chunk.length > 0) {
        const wordSpan = document.createElement("span");
        wordSpan.className = byWordOnly ? "word" : "word-wrap";
        wordSpan.style.display = "inline-block";
        wordSpan.style.whiteSpace = "nowrap";

        if (byWordOnly) {
          wordSpan.textContent = chunk;
        } else {
          [...chunk].forEach((character) => {
            const charSpan = document.createElement("span");
            charSpan.className = "char";
            charSpan.textContent = character;
            charSpan.style.display = "inline-block";
            charSpan.style.willChange = "transform";
            wordSpan.appendChild(charSpan);
          });
        }
        fragment.appendChild(wordSpan);
      }
    });

    node.parentNode.replaceChild(fragment, node);
  });

  return element.querySelectorAll(byWordOnly ? ".word" : ".char");
}

// Live Kolkata Time in Header
function setTime() {
  const el = document.querySelector("#local-time");
  if (el) {
    el.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());
  }
}
setTime();
setInterval(setTime, 1000);

// Raster Logo Transparency Processing
document.querySelectorAll(".brand-logo img").forEach((image) => {
  const makeTransparent = () => {
    const canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height), data = pixels.data;
    const darkTone = image.dataset.logoTone === "dark";
    for (let i = 0; i < data.length; i += 4) {
      const luminance = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (luminance < 32) data[i + 3] = 0;
      else if (darkTone && luminance > 210 && Math.abs(data[i] - data[i + 1]) < 18) {
        data[i] = 23; data[i + 1] = 23; data[i + 2] = 23;
      }
    }
    ctx.putImageData(pixels, 0, 0);
    image.src = canvas.toDataURL("image/png");
  };
  image.complete ? makeTransparent() : image.addEventListener("load", makeTransparent, { once: true });
});

// Smooth Scrolling: Lenis
let lenis = null;
if (!prefersReduced && window.Lenis) {
  lenis = new Lenis({
    lerp: isTouchDevice ? 0.12 : (window.innerWidth < 1024 ? 0.10 : 0.085),
    smoothWheel: true,
    syncTouch: false
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Preloader Intro Sequence
const loader = gsap.timeline({
  onComplete: () => {
    const pre = document.querySelector(".preloader");
    if (pre) pre.remove();
    document.body.style.overflow = "";
    ScrollTrigger.refresh();
  }
});

loader.fromTo(".pre-logo i", { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.45, stagger: 0.15 })
  .fromTo(".pre-logo span", { yPercent: 110 }, { yPercent: 0, duration: 0.65, ease: "power3.out" }, "<.08")
  .to(".preloader", { yPercent: -100, duration: 0.65, ease: "power3.inOut", delay: 0.35 });

const titleChars = [...document.querySelectorAll(".hero .split-title")].map(el => splitChars(el, window.innerWidth < 1024));
if (titleChars.length > 0) {
  loader.fromTo(titleChars[0], { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: window.innerWidth < 1024 ? 0.025 : 0.012, duration: 0.8, ease: "power3.out" }, "<.35")
    .from(".hero-copy, .hero-actions-panel, .growth-pipeline-wrap, .eyebrow, .type-line", { opacity: 0, y: 20, stagger: 0.08, duration: 0.55, ease: "power2.out" }, "<.35");
}

// Custom Cursor & Magnetic Listeners
if (!prefersReduced && hasFinePointer) {
  const dot = document.querySelector(".cursor-dot"), ring = document.querySelector(".cursor-ring"), cursorText = document.querySelector(".cursor-text");
  if (dot && ring) {
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" }), dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.38, ease: "power3" }), ringY = gsap.quickTo(ring, "y", { duration: 0.38, ease: "power3" });
    window.addEventListener("pointermove", (e) => { dotX(e.clientX - 3.5); dotY(e.clientY - 3.5); ringX(e.clientX); ringY(e.clientY); });
    
    const setCursorBadge = (label) => {
      if (cursorText && label) {
        cursorText.textContent = label;
        ring.classList.add("has-badge");
        document.body.classList.add("cursor-badge-active");
      } else {
        ring.classList.remove("has-badge");
        document.body.classList.remove("cursor-badge-active");
      }
    };

    // Badge triggers
    document.querySelectorAll(".feature-card").forEach((card) => {
      card.addEventListener("pointerenter", () => setCursorBadge("Explore ↗"));
      card.addEventListener("pointerleave", () => setCursorBadge(null));
    });

    document.querySelectorAll(".problem-card").forEach((card) => {
      card.addEventListener("pointerenter", () => setCursorBadge("Problem ⦻"));
      card.addEventListener("pointerleave", () => setCursorBadge(null));
    });

    document.querySelectorAll(".case-card").forEach((card) => {
      card.addEventListener("pointerenter", () => setCursorBadge("Results ↗"));
      card.addEventListener("pointerleave", () => setCursorBadge(null));
    });

    document.querySelectorAll(".port-card").forEach((card) => {
      card.addEventListener("pointerenter", () => setCursorBadge("View ↗"));
      card.addEventListener("pointerleave", () => setCursorBadge(null));
    });

    document.querySelectorAll(".faq-item button").forEach((btn) => {
      btn.addEventListener("pointerenter", () => setCursorBadge("Read +"));
      btn.addEventListener("pointerleave", () => setCursorBadge(null));
    });

    document.querySelectorAll(".magnetic, .talk-button, .back-top, .desktop-nav a, .audit-nav-btn, .primary-hero-btn, .secondary-hero-btn, .filter-btn, .step-btn").forEach((el) => {
      el.addEventListener("pointerenter", () => gsap.to(ring, { scale: 1.4, borderColor: "var(--lime)", duration: 0.25 }));
      el.addEventListener("pointerleave", () => gsap.to(ring, { scale: 1, borderColor: "rgba(255,255,255,0.9)", duration: 0.25 }));
    });

    document.querySelectorAll(".magnetic").forEach((button) => {
      button.addEventListener("pointermove", (e) => {
        const r = button.getBoundingClientRect();
        gsap.to(button, { x: (e.clientX - r.left - r.width / 2) * 0.16, y: (e.clientY - r.top - r.height / 2) * 0.16, duration: 0.35, ease: "power2.out" });
      });
      button.addEventListener("pointerleave", () => gsap.to(button, { x: 0, y: 0, duration: 0.45, ease: "power2.out" }));
    });
  }
}

// Scroll Cue Bounce
gsap.to(".scroll-cue span", { y: 13, duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut" });

// ==========================================================================
// Interactive Growth Pipeline Visualizer in Hero
// ==========================================================================
const pipelineNodes = document.querySelectorAll(".pipeline-node");
let activePipelineIndex = 0;
let pipelineInterval;

function highlightPipelineNode(index) {
  pipelineNodes.forEach((node, i) => {
    node.classList.toggle("active", i === index);
  });
}

if (pipelineNodes.length > 0) {
  pipelineInterval = setInterval(() => {
    activePipelineIndex = (activePipelineIndex + 1) % pipelineNodes.length;
    highlightPipelineNode(activePipelineIndex);
  }, 2400);

  pipelineNodes.forEach((node, i) => {
    node.addEventListener("click", () => {
      clearInterval(pipelineInterval);
      activePipelineIndex = i;
      highlightPipelineNode(activePipelineIndex);
    });
  });
}

// ==========================================================================
// UNIFIED MASTER GSAP BREAKPOINT SYSTEM
// ==========================================================================
let mm = gsap.matchMedia();

mm.add({
  isMobile: `(max-width: ${BP.md - 1}px)`,
  isTablet: `(min-width: ${BP.md}px) and (max-width: ${BP.lg - 1}px)`,
  isDesktop: `(min-width: ${BP.lg}px)`,
  reduceMotion: `(prefers-reduced-motion: reduce)`
}, (context) => {
  let { isMobile, isTablet, isDesktop, reduceMotion } = context.conditions;

  // 1. Sticky Header
  ScrollTrigger.create({
    start: isDesktop ? 20 : 15,
    onUpdate: self => document.querySelector(".site-header")?.classList.toggle("scrolled", self.scroll() > (isDesktop ? 20 : 15))
  });

  // 2. Headline SplitText Stagger
  document.querySelectorAll(".section .split-title, .cta .split-title").forEach((title) => {
    if (reduceMotion) {
      gsap.from(title, { scrollTrigger: { trigger: title, start: "top 88%" }, opacity: 0, duration: 0.6 });
    } else if (isDesktop) {
      gsap.from(splitChars(title, false), {
        scrollTrigger: { trigger: title, start: "top 84%" },
        yPercent: 100,
        opacity: 0,
        stagger: 0.012,
        duration: 0.75,
        ease: "power3.out"
      });
    } else {
      gsap.from(splitChars(title, true), {
        scrollTrigger: { trigger: title, start: "top 88%" },
        yPercent: 65,
        opacity: 0,
        stagger: 0.03,
        duration: 0.6,
        ease: "power3.out"
      });
    }
  });

  // 3. Section Label Stagger
  document.querySelectorAll(".section-label, .eyebrow").forEach((label) => {
    const num = label.querySelector(".section-num");
    const name = label.querySelector(".label-name");
    const badge = label.querySelector(".active-badge, em");

    gsap.timeline({ scrollTrigger: { trigger: label, start: isDesktop ? "top 88%" : "top 92%" } })
      .fromTo(num, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" })
      .fromTo(name, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, "<0.08")
      .fromTo(badge, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "<0.12");
  });

  // 4. Hero Background 3D Fade on Scroll (hero-content remains stable without shrinking or fading)
  if (!reduceMotion) {
    gsap.to("#three-canvas", {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      },
      y: -30,
      opacity: 0,
      ease: "none"
    });
  }

  // 5. Capability Rail (Draggable on Desktop, Tablet & Mobile)
  const rail = document.querySelector("#capabilities-rail"), wrap = document.querySelector(".rail-wrap");
  if (rail && wrap) {
    const cards = [...rail.querySelectorAll(".feature-card")];
    const hint = wrap.querySelector(".drag-hint");
    const dots = document.querySelectorAll(".rail-pagination .dot");
    let isDragging = false;

    const cardGap = isMobile ? 14 : 18;
    const cardStep = () => (cards[0] ? cards[0].offsetWidth + cardGap : 340);
    const maxX = () => Math.min(0, wrap.clientWidth - rail.scrollWidth - (isMobile ? 24 : window.innerWidth * 0.04));

    const snapPoints = (endValue) => {
      const step = cardStep();
      const snapped = Math.round(endValue / step) * step;
      return Math.max(maxX(), Math.min(0, snapped));
    };

    Draggable.create(rail, {
      type: "x",
      bounds: () => ({ minX: maxX(), maxX: 0 }),
      inertia: inertiaAvailable,
      edgeResistance: 0.75,
      allowNativeVerticalScrolling: true,
      dragClickables: false,
      snap: isMobile || isTablet ? { x: snapPoints } : false,
      onDrag: updateCards,
      onThrowUpdate: updateCards,
      onPress() {
        isDragging = true;
        rail.classList.add("is-dragging");
        if (hint) hint.innerHTML = "Exploring capabilities <span>⟷</span>";
        gsap.to(cards, { y: -5, stagger: 0.02, duration: 0.2, ease: "power2.out" });
      },
      onRelease() {
        isDragging = false;
        rail.classList.remove("is-dragging");
        if (hint) hint.innerHTML = "Drag or swipe to explore capabilities <span>⟷</span>";
        gsap.to(cards, { y: 0, stagger: { each: 0.02, from: "end" }, duration: 0.4, ease: "power2.out" });
      }
    });

    function updateCards() {
      const wrapRect = wrap.getBoundingClientRect();
      const wrapCenter = wrapRect.left + wrapRect.width / 2;
      let closest = 0, best = Infinity;

      cards.forEach((card, i) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - wrapCenter);
        if (distance < best) { best = distance; closest = i; }

        const distRatio = distance / (wrapRect.width / 2);
        const cardScale = isMobile ? Math.max(0.94, 1 - distRatio * 0.06) : Math.max(0.90, 1 - distRatio * 0.12);
        const cardOpacity = isMobile ? Math.max(0.75, 1 - distRatio * 0.3) : Math.max(0.55, 1 - distRatio * 0.5);
        gsap.to(card, { scale: cardScale, opacity: cardOpacity, duration: 0.15, overwrite: "auto" });
      });

      cards.forEach((card, i) => {
        card.classList.toggle("in-view", i === closest);
      });

      dots.forEach((dot, i) => dot.classList.toggle("active", i === closest));
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        const targetX = Math.max(maxX(), Math.min(0, -i * cardStep()));
        gsap.to(rail, { x: targetX, duration: 0.65, ease: "power3.out", onUpdate: updateCards });
      });
    });

    updateCards();
    ScrollTrigger.create({ trigger: wrap, start: "top bottom", onEnter: updateCards, onUpdate: updateCards });
  }

  // 6. Problem Cards Reveal
  document.querySelectorAll(".problem-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 90%" },
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: index * 0.08,
      ease: "power2.out"
    });
  });

  // 7. Case Cards Reveal
  document.querySelectorAll(".case-card").forEach((card) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 85%" },
      opacity: 0,
      y: 35,
      duration: 0.7,
      ease: "power3.out"
    });
  });

  // 8. Service Columns Reveal
  document.querySelectorAll(".service-col").forEach((col, index) => {
    gsap.from(col, {
      scrollTrigger: { trigger: col, start: "top 90%" },
      opacity: 0,
      y: 25,
      duration: 0.55,
      delay: index * 0.06,
      ease: "power2.out"
    });
  });
});

// ==========================================================================
// Growth System 6-Step Interactive Switcher
// ==========================================================================
const stepButtons = document.querySelectorAll(".step-btn");
const systemCards = document.querySelectorAll(".system-card");

stepButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetIndex = parseInt(btn.dataset.stepTarget, 10);
    stepButtons.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    systemCards.forEach((card, idx) => {
      const isTarget = idx === targetIndex;
      card.classList.toggle("active", isTarget);
      if (isTarget) {
        gsap.fromTo(card, { scale: 0.98, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
        if (window.innerWidth < BP.md) {
          card.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    });
  });
});

systemCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (stepButtons[index]) stepButtons[index].click();
  });
});

// ==========================================================================
// Portfolio Filter Logic
// ==========================================================================
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    portfolioItems.forEach((item) => {
      const categories = item.dataset.category.split(" ");
      const match = filter === "all" || categories.includes(filter);

      if (match) {
        item.classList.remove("is-hidden");
        gsap.fromTo(item, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
      } else {
        item.classList.add("is-hidden");
      }
    });
  });
});

// ==========================================================================
// FAQ Accordion (Animated expand/collapse with ARIA)
// ==========================================================================
document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    const answer = item.querySelector(".faq-answer");
    const isOpen = item.classList.contains("open");

    // Close other open accordions
    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove("open");
        openItem.querySelector("button").setAttribute("aria-expanded", "false");
        gsap.to(openItem.querySelector(".faq-answer"), { height: 0, duration: 0.35, ease: "power2.inOut" });
      }
    });

    if (isOpen) {
      item.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
      gsap.to(answer, { height: 0, duration: 0.35, ease: "power2.inOut" });
    } else {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      gsap.set(answer, { height: "auto" });
      gsap.from(answer, { height: 0, duration: 0.35, ease: "power2.inOut" });
    }
  });
});

// ==========================================================================
// Free Growth Audit Form Submission
// ==========================================================================
const auditForm = document.querySelector("#growth-audit-form");
const auditSuccessBox = document.querySelector("#audit-success");
const auditResetBtn = document.querySelector("#audit-reset-btn");

if (auditForm && auditSuccessBox) {
  auditForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = auditForm.querySelector("#audit-name");
    const emailInput = auditForm.querySelector("#audit-email");
    const phoneInput = auditForm.querySelector("#audit-phone");
    const businessInput = auditForm.querySelector("#audit-business");
    const websiteInput = auditForm.querySelector("#audit-website");

    if (!nameInput.value || !emailInput.value || !phoneInput.value || !businessInput.value || !websiteInput.value) {
      alert("Please fill in all required fields to request your growth audit.");
      return;
    }

    const submitBtn = auditForm.querySelector(".submit-audit-btn");
    submitBtn.innerHTML = "<span>GENERATING AUDIT REQUEST...</span>";
    submitBtn.style.opacity = "0.75";
    submitBtn.style.pointerEvents = "none";

    // Simulate async submission and show confirmation
    setTimeout(() => {
      auditForm.style.display = "none";
      auditSuccessBox.classList.add("is-visible");
      auditSuccessBox.setAttribute("aria-hidden", "false");
      gsap.fromTo(auditSuccessBox, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
    }, 900);
  });

  if (auditResetBtn) {
    auditResetBtn.addEventListener("click", () => {
      auditForm.reset();
      auditForm.style.display = "flex";
      const submitBtn = auditForm.querySelector(".submit-audit-btn");
      submitBtn.innerHTML = "<span>GET MY FREE GROWTH AUDIT</span> <span>↗</span>";
      submitBtn.style.opacity = "";
      submitBtn.style.pointerEvents = "";
      auditSuccessBox.classList.remove("is-visible");
      auditSuccessBox.setAttribute("aria-hidden", "true");
    });
  }
}

// Newsletter form subscription feedback
document.querySelector(".subscribe form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const button = e.currentTarget.querySelector("button");
  if (button) {
    button.innerHTML = "Subscribed ✓";
    gsap.fromTo(button, { color: "var(--coral)" }, { color: "var(--lime)", duration: 0.4 });
  }
});

// Mobile Fullscreen Slide-in Drawer Menu
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const open = !menuToggle.classList.contains("active");
    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    mobileMenu.style.visibility = open ? "visible" : "hidden";
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");

    gsap.to(mobileMenu, {
      clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
      duration: 0.45,
      ease: "power3.inOut"
    });

    if (open) {
      gsap.from(".mobile-menu a", { y: 24, opacity: 0, stagger: 0.04, delay: 0.15 });
    }
  });

  document.querySelectorAll(".mobile-menu a").forEach(a => a.addEventListener("click", () => {
    if (menuToggle.classList.contains("active")) menuToggle.click();
  }));
}

// Back to Top button
document.querySelector(".back-top")?.addEventListener("click", () => {
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 });
  } else {
    gsap.to(window, { duration: 1.1, scrollTo: 0, ease: "power3.inOut" });
  }
});

// Internal Anchor Smooth Navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function(e) {
    const targetId = this.getAttribute("href");
    if (targetId && targetId !== "#") {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(targetElement, { offset: -70, duration: 1.1 });
        } else {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  });
});

// ==========================================================================
// Three.js Hero Canvas: Geometric Icosahedrons & Particle Cloud
// ==========================================================================
if (!prefersReduced && window.THREE) {
  const mount = document.querySelector("#three-canvas");
  if (mount) {
    const isMobile = window.innerWidth < BP.md;
    const isTablet = window.innerWidth >= BP.md && window.innerWidth < BP.lg;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, powerPreference: "high-performance" });

    const maxDpr = isMobile || isTablet ? 1.5 : 2.0;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    camera.position.z = 12;

    const group = new THREE.Group();
    scene.add(group);

    // Particle Cloud
    const particleCount = isMobile ? 50 : (isTablet ? 90 : 210);
    const positions = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 4 + Math.random() * 6, a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1);
      positions.push(radius * Math.sin(b) * Math.cos(a), radius * Math.sin(b) * Math.sin(a), radius * Math.cos(b));
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const points = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ size: isMobile ? 0.05 : 0.04, color: 0xd8ff3e, transparent: true, opacity: 0.65 }));
    group.add(points);

    // Geometric Icosahedrons
    const meshCount = isMobile ? 4 : (isTablet ? 7 : 12);
    const geo = new THREE.IcosahedronGeometry(0.35, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xd8ff3e, wireframe: true, transparent: true, opacity: 0.55 });
    for (let i = 0; i < meshCount; i++) {
      const mesh = new THREE.Mesh(geo, material);
      const a = (i / meshCount) * Math.PI * 2;
      mesh.position.set(Math.cos(a) * (3 + (i % 3)), Math.sin(a * 1.7) * 3, (i % 4) - 2);
      mesh.scale.setScalar(0);
      group.add(mesh);
      gsap.to(mesh.scale, { x: 1, y: 1, z: 1, delay: 0.9 + i * 0.055, duration: 0.75, ease: "power2.out" });
    }

    // Pointer Parallax
    if (hasFinePointer) {
      const groupX = gsap.quickTo(group.rotation, "x", { duration: 0.6, ease: "power3" });
      const groupY = gsap.quickTo(group.rotation, "y", { duration: 0.6, ease: "power3" });
      mount.closest(".hero")?.addEventListener("pointermove", e => {
        const r = mount.getBoundingClientRect();
        groupX(((e.clientY - r.top - r.height / 2) / r.height) * 0.3);
        groupY(((e.clientX - r.left - r.width / 2) / r.width) * 0.45);
      });
    }

    let isRunning = true;
    function render() {
      if (isRunning) {
        points.rotation.y += 0.0008;
        group.rotation.y += 0.0003;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
    }
    render();

    document.addEventListener("visibilitychange", () => {
      isRunning = !document.hidden;
      if (isRunning) render();
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => {
        isRunning = entry.isIntersecting;
        if (isRunning) render();
      }, { threshold: 0.05 });
      observer.observe(mount);
    }

    window.addEventListener("resize", () => {
      if (mount.clientHeight > 0) {
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      }
    });
  }
}

// Resize & Orientation Refresh
let resizeTimer;
window.addEventListener("orientationchange", () => {
  setTimeout(() => ScrollTrigger.refresh(), 250);
});

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
});

window.addEventListener("load", () => ScrollTrigger.refresh());
