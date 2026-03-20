const root =document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const darkBtn = document.getElementById("darkBtn");
const lightBtn = document.getElementById("lightBtn");
const thumb = document.getElementById("themeThumb");

function applyTheme(theme) {
  const isDark = theme === "dark";

  root.classList.toggle("dark", isDark);

  if (thumb) {
    thumb.style.transform = isDark ? "translateX(0)" : "translateX(80px)";
    thumb.className = 
    "absolute left-1 top-1 h-10 w-[80px] rounded-full transition-all duration-300 ease-out " + 
    (isDark 
        ? "bg-slate-700/90 shadow-[0_0_18px_rgba(34,211,238,0.12)]"
        : "bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.18)]");
  }

  if (darkBtn && lightBtn) {
    darkBtn.classList.toggle("text-white", isDark);
    darkBtn.classList.toggle("text-zinc-400", !isDark);

    lightBtn.classList.toggle("text-zinc-400", isDark);
    lightBtn.classList.toggle("text-zinc-900", !isDark);
  }  

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }
  
  localStorage.setItem("theme", theme);

}

function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const theme = savedTheme || "dark";
    applyTheme(theme);
}

darkBtn?.addEventListener("click", () => applyTheme("dark"));
lightBtn?.addEventListener("click", () => applyTheme("light"));

themeToggle.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    const isDark = root.classList.contains("dark");
    applyTheme(isDark ? "light" : "dark");
  }   

});

initTheme();
