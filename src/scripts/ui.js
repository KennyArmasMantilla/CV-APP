const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const form = document.getElementById("contactForm");
const statusForm = document.getElementById("formStatus");

function setStatus(type, message) {
  if (!statusForm) return;

  statusForm.textContent = message;
  statusForm.classList.remove(
    "hidden",
    "text-muted",
    "text-emerald-500",
    "text-red-500",
    "text-cyan-500",
    "dark:text-emerald-300",
    "dark:text-red-300",
    "dark:text-cyan-300"
  );

  if (!message) {
    statusForm.classList.add("hidden");
    return;
  }

  switch (type) {
    case "success":
      statusForm.classList.add("text-emerald-500", "dark:text-emerald-300");
      break;

    case "error":
      statusForm.classList.add("text-red-500", "dark:text-red-300");
      break;

    case "loading":
      statusForm.classList.add("text-cyan-500", "dark:text-cyan-300");
      break;

    default:
      statusForm.classList.add("text-muted");
      break;
  }

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
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); 

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const topic = document.getElementById("topic");
    const message = document.getElementById("message");
    const submitBtn = document.querySelector("button[type='submit']");

    const nameVal = name?.value.trim() || "";
    const emailVal = email?.value.trim() || "";
    const messageVal = message?.value.trim() || "";

    const badName = nameVal.length < 2;
    const badEmail = !isValidEmail(emailVal);
    const badMessage = messageVal.length < 10;

    markInvalid(name, badName);
    markInvalid(email, badEmail);
    markInvalid(message, badMessage);

    if (badName || badEmail || badMessage) {
      setStatus("error", "Revisa los campos para continuar.");
      return;
    }

    const formData = new FormData(form);

    if (topic?.value) {
      formData.set("motivo", topic.value);
    }

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("opacity-70", "cursor-not-allowed");
      }

      setStatus("loading", "Enviando mensaje...");

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo enviar el formulario.");
      }

      form.reset();
      markInvalid(name, false);
      markInvalid(email, false);
      markInvalid(message, false);

      setStatus("success", "Mensaje enviado correctamente.");
    } catch (error) {
      setStatus("error", "Ocurrió un error al enviar. Intenta nuevamente.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
      }
    }

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
  "opacity-50",
  "translate-y-3",
  "blur-[3px]",
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
  { threshold: 0.15, rootMargin: "-15% 0px -30% 0px" }
);

animatedSections.forEach((el) => revealObserver.observe(el));

// Active nav
const sections = Array.from(
  document.querySelectorAll(
    '#hero, #about-me, #skills, #projects, #experience, #certifications, #contact'
  )
);
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


// Experience timeline + modal
const experienceScroller = document.getElementById("experienceScroller");
const yearSections = Array.from(document.querySelectorAll(".experience-year-section"));
const timelineButtons = Array.from(document.querySelectorAll(".timeline-year-btn"));

function setActiveTimeline(targetId) {
  timelineButtons.forEach((btn) => {
    const active = btn.dataset.target === targetId;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-current", active ? "true" : "false");
  });
}

timelineButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const target = document.getElementById(targetId);
    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setActiveTimeline(targetId);
  });
});

if (experienceScroller && yearSections.length) {
  const experienceObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length > 0) {
        setActiveTimeline(visible[0].target.id);
      }
    },
    {
      root: experienceScroller,
      threshold: [0.2, 0.4, 0.6],
      rootMargin: "-10% 0px -55% 0px",
    }
  );

  yearSections.forEach((section) => experienceObserver.observe(section));
}

// Experience modal
const modal = document.getElementById("experienceModal");
const modalOverlay = document.getElementById("experienceModalOverlay");
const modalClose = document.getElementById("experienceModalClose");
const detailButtons = Array.from(document.querySelectorAll(".experience-detail-btn"));

const modalTitle = document.getElementById("experienceModalTitle");
const modalDate = document.getElementById("experienceModalDate");
const modalCompanyBadge = document.getElementById("experienceModalCompanyBadge");
const modalLocation = document.getElementById("experienceModalLocation");
const modalCompanyText = document.getElementById("experienceModalCompanyText");
const modalClient = document.getElementById("experienceModalClient");
const modalDescription = document.getElementById("experienceModalDescription");
const modalTech = document.getElementById("experienceModalTech");
const modalImage = document.getElementById("experienceModalImage");

function openExperienceModal(data) {
  if (!modal || !modalOverlay || !modalClose) return;

  if (modalTitle) modalTitle.textContent = data.title || "";
  if (modalDate) modalDate.textContent = data.date || "";
  if (modalLocation) modalLocation.textContent = data.location || "";
  if (modalCompanyText) modalCompanyText.textContent = data.company || "";
  if (modalClient) modalClient.textContent = data.client || "";
  if (modalDescription) modalDescription.textContent = data.description || "";

  if (modalImage) {
    modalImage.src = data.image || "";
    modalImage.alt = data.title || "Experiencia";
  }

  if (modalTech) {
    modalTech.innerHTML = "";
    (data.tech || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => {
        const pill = document.createElement("span");
        pill.className = "quick-pill";
        pill.textContent = item;
        modalTech.appendChild(pill);
      });
  }

  modalOverlay.classList.remove("hidden", "pointer-events-none", "opacity-0");
  modal.classList.remove("hidden", "pointer-events-none", "opacity-0");
  modalClose.classList.remove("hidden", "pointer-events-none");
  modalClose.classList.add("inline-flex");

  requestAnimationFrame(() => {
    modalOverlay.classList.add("opacity-100");
    modal.classList.add("opacity-100");
  });

  document.body.classList.add("modal-open");
}

function closeExperienceModal() {
  if (!modal || !modalOverlay || !modalClose) return;

  modalOverlay.classList.add("opacity-0");
  modal.classList.add("opacity-0");
  modalClose.classList.remove("inline-flex");

  document.body.classList.remove("modal-open");

  setTimeout(() => {
    modalOverlay.classList.add("hidden", "pointer-events-none");
    modal.classList.add("hidden", "pointer-events-none");
    modalClose.classList.add("hidden", "pointer-events-none");
  }, 250);
}

detailButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    openExperienceModal({
      title: btn.dataset.modalTitle,
      date: btn.dataset.modalDate,
      company: btn.dataset.modalCompany,
      client: btn.dataset.modalClient,
      description: btn.dataset.modalDescription,
      tech: btn.dataset.modalTech,
      image: btn.dataset.modalImage,
      location: btn.dataset.modalLocation,
      badge: btn.dataset.modalBadge,
    });
  });
});

modalOverlay?.addEventListener("click", closeExperienceModal);
modalClose?.addEventListener("click", closeExperienceModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeExperienceModal();
});