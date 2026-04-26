const skillsRoot = document.querySelector("[data-skills-root]");
const skillsTabsWrap = document.querySelectorAll("[data-skills-tabs]");
const skillsPills = document.querySelector("[data-skills-pill]");
const skillTabs = Array.from(document.querySelectorAll("[data-skill-tab]"));
const skillsPanels = Array.from(document.querySelectorAll("[data-skill-panel]"));

function moveSkillsPill(activeTab) {
  if(!skillsTabsWrap || !skillsPills || !activeTab) return;

  const wrapRect = skillsTabsWrap[0].getBoundingClientRect();
  const tabRect = activeTab.getBoundingClientRect();

  skillsPills.style.width = `${tabRect.width}px`;
  skillsPills.style.height = `${tabRect.height}px`;
  skillsPills.style.transform = `translate(${tabRect.left - wrapRect.left}px, ${tabRect.top - wrapRect.top}px)`;

}



function activateSkillTab(nextId, shouldMovePill = true) {
  let activeTabEl = null;
  skillTabs.forEach((tab) => {
    const isActive = tab.dataset.skillTab === nextId;

    if(isActive) activeTabEl = tab;
    
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive);
    tab.setAttribute("tabindex", isActive ? "0" : "-1");

    tab.classList.toggle("text-white", isActive);
    tab.classList.toggle("text-zinc-500", !isActive);
    tab.classList.toggle("hover:text-zinc-900", !isActive);
    tab.classList.toggle("dark:text-zinc-400", !isActive);
    tab.classList.toggle("dark:hover:text-zinc-100", !isActive);

  });

  skillsPanels.forEach((panel) => {
    const isActive = panel.dataset.skillPanel === nextId;

    if (isActive) {
      panel.classList.remove("hidden");
      requestAnimationFrame(() => {
        panel.classList.add("opacity-100", "translate-y-0", "pointer-events-auto");
        panel.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");
      });
      panel.setAttribute("aria-hidden", "false");
    } else {
      panel.classList.add("opacity-0", "translate-y-4", "pointer-events-none");
      panel.classList.remove("opacity-100", "translate-y-0", "pointer-events-auto");
      panel.setAttribute("aria-hidden", "true");

      setTimeout(() => {
        if (panel.dataset.skillPanel !== nextId) {
          panel.classList.add("hidden");
        }
      }, 220);
    }
  });

  if (shouldMovePill && activeTabEl) {
    moveSkillsPill(activeTabEl);
  }

}

if (skillsRoot && skillTabs.length && skillsPanels.length) {
  skillTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateSkillTab(tab.dataset.skillTab);
    })
  });

  activateSkillTab(skillTabs[0].dataset.skillTab);

  window.addEventListener("resize", () => {
    const activeTab = skillTabs.find((tab) => tab.classList.contains("is-active"));
    if (activeTab) {
      moveSkillsPill(activeTab);
    }
  });

}

