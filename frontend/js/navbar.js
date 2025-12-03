document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer =
        document.getElementById("navbar") ||
        document.getElementById("index-navbar");
    if (!navbarContainer) return;

    const nav = document.createElement("nav");
    nav.className =
        "navbar navbar-expand-lg navbar-light bg-body-tertiary shadow-sm";

    const container = document.createElement("div");
    container.className = "container-fluid";

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

    const token = localStorage.getItem("authToken");
    const isLoggedIn = !!token;

    const navList = document.createElement("ul");
    navList.className = "navbar-nav ms-auto mb-2 mb-lg-0";

    const navLinks = [
        { text: "Home", href: "index.html" },
        { text: "Learn More", href: "learn-more.html" },
        { text: "Create Memorial", href: "create-memorial.html" },
    ];

    if (isLoggedIn) {
        navLinks.push({ text: "Dashboard", href: "dashboard.html" });
    }

    navLinks.forEach((link) => {
        const li = document.createElement("li");
        li.className = "nav-item";

        const a = document.createElement("a");
        a.className = "nav-link";
        a.href = link.href;
        a.textContent = link.text;

        li.appendChild(a);
        navList.appendChild(li);
    });

    const navButton = document.createElement("a");
    navButton.className = "btn btn-primary ms-2";

    if (isLoggedIn) {
        navButton.textContent = "Sign Out";
        navButton.href = "#";
        navButton.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });
    } else {
        navButton.textContent = "Login";
        navButton.href = "login.html";
    }

    collapseDiv.appendChild(navList);
    collapseDiv.appendChild(navButton);
    container.appendChild(brandLink);
    container.appendChild(toggler);
    container.appendChild(collapseDiv);
    nav.appendChild(container);
    navbarContainer.appendChild(nav);
});
