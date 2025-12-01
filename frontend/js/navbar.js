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

    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    const isLoggedIn = !!token;

    // Check if we're on the dashboard page
    const isDashboardPage = window.location.pathname.includes('dashboard.html');

    // Show appropriate button based on login state and current page
    const navButton = document.createElement("a");

    if (isLoggedIn) {
        if (isDashboardPage) {
            // On dashboard page: show "Sign Out" button
            navButton.textContent = "Sign Out";
            navButton.href = "#";
            navButton.className = "btn btn-outline-secondary";
            navButton.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                window.location.href = "index.html";
            });
        } else {
            // On other pages when logged in: show "Dashboard" button
            navButton.textContent = "Dashboard";
            navButton.href = "dashboard.html";
            navButton.className = "btn btn-primary";
        }
    } else {
        // Not logged in: show "Login" button
        navButton.textContent = "Login";
        navButton.href = "login.html";
        navButton.className = "btn btn-primary";
    }

    collapseDiv.appendChild(form);
    collapseDiv.appendChild(navButton);
    container.appendChild(brandLink);
    container.appendChild(toggler);
    container.appendChild(collapseDiv);
    nav.appendChild(container);
    navbarContainer.appendChild(nav);
});

