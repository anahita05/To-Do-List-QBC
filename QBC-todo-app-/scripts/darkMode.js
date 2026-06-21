const lightModeBtn = document.querySelector(".light-mode-btn");
const darkModeBtn = document.querySelector(".dark-mode-btn");

darkModeBtn.addEventListener("click", () => {
  document.documentElement.classList.add("dark");
  localStorage.setItem("darkMode", "dark");
});

lightModeBtn.addEventListener("click", () => {
  document.documentElement.classList.remove("dark");
  localStorage.setItem("darkMode", "light");
});

window.addEventListener("load", () => {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});
