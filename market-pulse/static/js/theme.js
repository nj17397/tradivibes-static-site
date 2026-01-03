const body = document.body;
const toggle = document.getElementById("theme-toggle");

function setTheme(theme) {
    const isDark = theme === "dark";
    body.classList.toggle("dark", isDark);
    toggle.checked = isDark;
    localStorage.setItem("theme", theme);
}

toggle.addEventListener("change", () => {
    setTheme(toggle.checked ? "dark" : "light");
});

// Load saved theme
setTheme(localStorage.getItem("theme") || "light");