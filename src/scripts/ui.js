const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

function setStatus(message) {
  if (status) status.textContent = message;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(value).trim());
}

function markInvalid(el, invalid) {
  if (!el) return;
  el.setAttribute("aria-invalid", invalid ? "true" : "false");
  el.classList.toggle("ring-red-400/60", invalid);
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    const nameVal = name?.value.trim() || "";
    const emailVal = email?.value.trim() || "";
    const messageVal = message?.value.trim() || "";

    let ok = true;

    const badName = nameVal.length < 2;
    const badEmail = !isValidEmail(emailVal);
    const badMessage = messageVal.length < 10;

    markInvalid(name, badName);
    markInvalid(email, badEmail);
    markInvalid(message, badMessage);

    ok = !badName && !badEmail && !badMessage;

    if (!ok) {
      setStatus("Revisa los campos marcados para continuar.");
      return;
    }

    setStatus("¡Listo! Mensaje preparado. (Placeholder sin backend).");

    setTimeout(() => {
      form.reset();
      markInvalid(name, false);
      markInvalid(email, false);
      markInvalid(message, false);
      setStatus("Gracias. Puedes continuar el contacto por email o LinkedIn.");
    }, 1200);
  });
}

// Mobile menu 
const mobileBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

function setMobileMenu(open) {
  if (!mobileBtn || !mobileMenu) return;
  mobileBtn.setAttribute("aria-expanded", String(open));
  mobileMenu.classList.toggle("hidden", !open);
}

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener("click", () => {
    const expanded = mobileBtn.getAttribute("aria-expanded") === "true";
    setMobileMenu(!expanded);
  });

  mobileMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => setMobileMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMobileMenu(false);
  });
}

// Back to top
const backToTop = document.getElementById("backToTop");

function updateBackToTop() {
  if (!backToTop) return;
  const show = window.scrollY > 700;
  backToTop.classList.toggle("hidden", !show);
  backToTop.classList.toggle("inline-flex", show);
}

updateBackToTop();
window.addEventListener("scroll", updateBackToTop, { passive: true });

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Reveal on scroll
const animatedSections = Array.from(document.querySelectorAll(".section-animate"));

const hiddenClasses = [
  "opacity-0",
  "translate-y-3",
  "blur-[2px]",
  "transition",
  "duration-700",
  "ease-out",
  "will-change-transform",
];

const shownClasses = ["opacity-100", "translate-y-0", "blur-0"];

animatedSections.forEach((el) => hiddenClasses.forEach((c) => el.classList.add(c)));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      hiddenClasses.forEach((c) => el.classList.remove(c));
      shownClasses.forEach((c) => el.classList.add(c));
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.15, rootMargin: "-15% 0px -40% 0px" }
);

animatedSections.forEach((el) => revealObserver.observe(el));

// Active nav
const sections = Array.from(document.querySelectorAll("section[id]"));
const navLinks = Array.from(document.querySelectorAll('a.nav-link[href^="#"]'));

function setActiveLink(id) {
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const active = href === `#${id}`;

    link.classList.toggle("bg-black/5", active);
    link.classList.toggle("text-zinc-950", active);
    link.classList.toggle("dark:bg-white/10", active);
    link.classList.toggle("dark:text-zinc-50", active);

    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

// Keep nav feedback immediate on tap/click, especially on mobile.
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href")?.slice(1);
    if (targetId) setActiveLink(targetId);
  });
});

const spyObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible.length > 0) {
      setActiveLink(visible[0].target.id);
    }
  },
  { threshold: [0.2, 0.35, 0.5, 0.65], rootMargin: "-20% 0px -55% 0px" }
);

sections.forEach((section) => spyObserver.observe(section));
