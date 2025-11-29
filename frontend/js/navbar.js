// Navigation bar component that works across all pages of the site.

// Index page navbar - used only on the main index.html page.
document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("index-navbar");
    if (!navbarContainer) return;

    const nav = document.createElement("nav");
    nav.className = "navbar navbar-expand-lg navbar-light bg-body-tertiary shadow-sm";

    const container = document.createElement("div");
    container.className = "container-fluid";

    // Brand Link Logo and Text
    const brandLink = document.createElement("a");
    brandLink.className = "navbar-brand d-flex align-items-center";
    brandLink.href = "./index.html";

    const logoImg = document.createElement("img");
    logoImg.src = "./images/nav-logo.png";
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
    toggler.setAttribute("data-bs-target", "#navbarNavIndex");
    toggler.setAttribute("aria-controls", "navbarNavIndex");
    toggler.setAttribute("aria-expanded", "false");
    toggler.setAttribute("aria-label", "Toggle navigation");

    const togglerIcon = document.createElement("span");
    togglerIcon.className = "navbar-toggler-icon";
    toggler.appendChild(togglerIcon);

    const collapseDiv = document.createElement("div");
    collapseDiv.className = "collapse navbar-collapse";
    collapseDiv.id = "navbarNavIndex";

    const ul = document.createElement("ul");
    ul.className = "navbar-nav me-auto mb-2 mb-lg-0";

    const links = [
        { name: "Home", href: "index.html", active: true },
        { name: "Dashboard", href: "user-dashboard.html" },
        { name: "Create Memorial", href: "create-memorial.html" },
        { name: "Login", href: "login.html" },
        { name: "Log Out", href: "" },
    ];

    links.forEach(linkData => {
        const li = document.createElement("li");
        li.className = "nav-item";

        const a = document.createElement("a");
        a.className = "nav-link";
        if (linkData.active) a.classList.add("active");
        a.href = linkData.href;
        a.textContent = linkData.name;

        li.appendChild(a);
        ul.appendChild(li);
    });

    const form = document.createElement("form");
    form.className = "d-flex";
    form.role = "search";

    const searchInput = document.createElement("input");
    searchInput.className = "form-control me-2";
    searchInput.type = "search";
    searchInput.placeholder = "Search";
    searchInput.setAttribute("aria-label", "Search");

    const searchButton = document.createElement("button");
    searchButton.className = "btn btn-outline-primary";
    searchButton.type = "submit";
    searchButton.textContent = "Search";

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert(`Searching for: ${searchInput.value}`);
    });

    form.appendChild(searchInput);
    form.appendChild(searchButton);

    collapseDiv.appendChild(ul);
    collapseDiv.appendChild(form);
    container.appendChild(brandLink);
    container.appendChild(toggler);
    container.appendChild(collapseDiv);
    nav.appendChild(container);
    navbarContainer.appendChild(nav);
});


// Pages navbar - used on all pages inside the /pages directory.
document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar");
    if (!navbarContainer) return;

    const nav = document.createElement("nav");
    nav.className = "navbar navbar-expand-lg navbar-light bg-body-tertiary shadow-sm";

    const container = document.createElement("div");
    container.className = "container-fluid";

    // Brand Link Logo and Text
    const brandLink = document.createElement("a");
    brandLink.className = "navbar-brand d-flex align-items-center";
    brandLink.href = "./index.html";

    const logoImg = document.createElement("img");
    logoImg.src = "./images/nav-logo.png";
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

    const ul = document.createElement("ul");
    ul.className = "navbar-nav me-auto mb-2 mb-lg-0";

    const links = [
        { name: "Home", href: "index.html" },
        { name: "Dashboard", href: "user-dashboard.html" },
        { name: "Create Memorial", href: "create-memorial.html" },
        { name: "Login", href: "login.html" },
        { name: "Log Out", href: "" },
    ];

    links.forEach(linkData => {
        const li = document.createElement("li");
        li.className = "nav-item";

        const a = document.createElement("a");
        a.className = "nav-link";

        if (window.location.href.includes(linkData.href)) a.classList.add("active");
        a.href = linkData.href;
        a.textContent = linkData.name;

        li.appendChild(a);
        ul.appendChild(li);
    });

    const form = document.createElement("form");
    form.className = "d-flex";
    form.role = "search";

    const searchInput = document.createElement("input");
    searchInput.className = "form-control me-2";
    searchInput.type = "search";
    searchInput.placeholder = "Search";
    searchInput.setAttribute("aria-label", "Search");

    const searchButton = document.createElement("button");
    searchButton.className = "btn btn-outline-primary";
    searchButton.type = "submit";
    searchButton.textContent = "Search";

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert(`Searching for: ${searchInput.value}`);
    });

    form.appendChild(searchInput);
    form.appendChild(searchButton);

    collapseDiv.appendChild(ul);
    collapseDiv.appendChild(form);
    container.appendChild(brandLink);
    container.appendChild(toggler);
    container.appendChild(collapseDiv);
    nav.appendChild(container);
    navbarContainer.appendChild(nav);
});


