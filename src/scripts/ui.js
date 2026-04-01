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