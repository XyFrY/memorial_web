// Navigation bar component that works across all pages of the site.
document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar") || document.getElementById("index-navbar");
    if (!navbarContainer) return;

    const nav = document.createElement("nav");
    nav.className = "navbar navbar-expand-lg navbar-light bg-body-tertiary shadow-sm";

    const container = document.createElement("div");
    container.className = "container-fluid";

    // Brand Link Logo and Text
    const brandLink = document.createElement("a");
    brandLink.className = "navbar-brand d-flex align-items-center";
    brandLink.href = "index.html";

    const logoImg = document.createElement("img");
    logoImg.src = "./frontend/images/nav-logo.png";
    logoImg.alt = "Logo";
    logoImg.width = 30;
    logoImg.height = 24;
    logoImg.className = "d-inline-block align-text-top me-2";

    const brandText = document.createElement("span");
    brandText.textContent = "Memorial Web";

    brandLink.appendChild(logoImg);
    brandLink.appendChild(brandText);

    const toggler = document.createElement("button");
    toggler.className = "navbar-toggler";
    toggler.type = "button";
    toggler.setAttribute("data-bs-toggle", "collapse");
    toggler.setAttribute("data-bs-target", "#navbarNav");
    toggler.setAttribute("aria-controls", "navbarNav");
    toggler.setAttribute("aria-expanded", "false");
    toggler.setAttribute("aria-label", "Toggle navigation");

    const togglerIcon = document.createElement("span");
    togglerIcon.className = "navbar-toggler-icon";
    toggler.appendChild(togglerIcon);

    const collapseDiv = document.createElement("div");
    collapseDiv.className = "collapse navbar-collapse";
    collapseDiv.id = "navbarNav";

    const form = document.createElement("form");
    form.className = "d-flex ms-auto me-2";
    form.role = "search";

    const searchInput = document.createElement("input");
    searchInput.className = "form-control";
    searchInput.type = "search";
    searchInput.placeholder = "Search";
    searchInput.setAttribute("aria-label", "Search");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert(`Searching for: ${searchInput.value}`);
    });

    form.appendChild(searchInput);

    // Login/Logout button
    const authButton = document.createElement("a");
    const token = localStorage.getItem("token");
    if (token) {
        authButton.textContent = "Log Out";
        authButton.href = "#";
        authButton.className = "btn btn-outline-secondary";
        authButton.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.href = "index.html";
        });
    } else {
        authButton.textContent = "Login";
        authButton.href = "login.html";
        authButton.className = "btn btn-primary";
    }

    collapseDiv.appendChild(form);
    collapseDiv.appendChild(authButton);
    container.appendChild(brandLink);
    container.appendChild(toggler);
    container.appendChild(collapseDiv);
    nav.appendChild(container);
    navbarContainer.appendChild(nav);
});

