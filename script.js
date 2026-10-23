// Анимации появления, мобильное меню и сохранение прогресса.
const checks = [...document.querySelectorAll("[data-course]")];
const progressFill = document.getElementById("progressFill");
const progressCount = document.getElementById("progressCount");
const saveNote = document.getElementById("saveNote");
const storageKey = "englishGardenAnimatedProgress";

function updateProgress() {
  const completed = checks.filter((item) => item.checked).length;
  progressCount.textContent = `${completed}/${checks.length}`;
  progressFill.style.width = `${checks.length ? completed / checks.length * 100 : 0}%`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(
      checks.filter((item) => item.checked).map((item) => item.dataset.course)
    ));
    saveNote.textContent = "✓ Прогресс сохранён в этом браузере.";
  } catch (error) {
    saveNote.textContent = "Прогресс работает до закрытия страницы, но браузер не разрешил его сохранить.";
  }
}

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  checks.forEach((item) => { item.checked = saved.includes(item.dataset.course); });
} catch (error) {
  // Если сохранённые данные повреждены, сайт всё равно продолжает работать.
}
checks.forEach((item) => item.addEventListener("change", updateProgress));
updateProgress();
document.getElementById("year").textContent = new Date().getFullYear();

// Плавное появление блоков по мере прокрутки.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Мобильная навигация.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const opened = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
  menuToggle.textContent = opened ? "✕" : "☰";
});
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));
