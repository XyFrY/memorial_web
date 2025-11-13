// Index Only Navigation Section
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
    brandLink.href = window.location.pathname.includes("pages") ? "../index.html" : "./index.html";


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
        { name: "Dashboard", href: "pages/dashboard.html" },
        { name: "Create Memorial", href: "pages/create-memorial.html" },
        { name: "Login", href: "pages/login.html" },
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

    // 🔍 Search Form
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


// Navagation Section 
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
   
    brandLink.href = window.location.pathname.includes("pages") ? "../index.html" : "./index.html";

    const logoImg = document.createElement("img");
    logoImg.src = window.location.pathname.includes("pages") 
        ? "../images/nav-logo.png" 
        : "./images/nav-logo.png";
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
        { name: "Home", href: "../index.html" },
        { name: "Dashboard", href: "dashboard.html" },
        { name: "Create Memorial", href: "create-memorial.html" },
        { name: "Login", href: "login.html" },
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


// Login Page Section
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        console.log("Logging in:", { email, password });

        window.location.href = "index.html";
    });
});

// Signup Page Section
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    if (!signupForm) return;

    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const passwordMatchFeedback = document.getElementById("passwordMatchFeedback");

    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove("d-none");
        // Scroll to top to show error
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function hideError() {
        errorAlert.classList.add("d-none");
        errorMessage.textContent = "";
    }

    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Only show feedback if confirm password field has content
        if (confirmPassword.length > 0) {
            if (password !== confirmPassword) {
                confirmPasswordInput.classList.add("is-invalid");
                confirmPasswordInput.classList.remove("is-valid");
                passwordMatchFeedback.textContent = "Passwords do not match";
                passwordMatchFeedback.style.display = "block";
            } else {
                confirmPasswordInput.classList.remove("is-invalid");
                confirmPasswordInput.classList.add("is-valid");
                passwordMatchFeedback.textContent = "Passwords match";
                passwordMatchFeedback.classList.remove("invalid-feedback");
                passwordMatchFeedback.classList.add("valid-feedback");
                passwordMatchFeedback.style.display = "block";
            }
        } else {
            confirmPasswordInput.classList.remove("is-invalid", "is-valid");
            passwordMatchFeedback.style.display = "none";
        }
    }

    // Add event listeners for real-time validation
    passwordInput.addEventListener("input", checkPasswordMatch);
    confirmPasswordInput.addEventListener("input", checkPasswordMatch);

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        hideError();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!name || !email || !password || !confirmPassword) {
            showError("Please fill out all fields.");
            return;
        }

        if (password !== confirmPassword) {
            showError("Passwords do not match. Please try again.");
            return;
        }

        console.log("Signing up:", { name, email, password });

        window.location.href = "login.html";
    });
});

// Create Memorial Section
document.addEventListener("DOMContentLoaded", () => {
    const memorialForm = document.getElementById("memorialForm");
    if (!memorialForm) return;

    memorialForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("memorialName").value.trim();
        const birthDate = document.getElementById("birthDate").value;
        const deathDate = document.getElementById("deathDate").value;
        const biography = document.getElementById("biography").value.trim();
        const message = document.getElementById("message").value.trim();
        const imageFile = document.getElementById("memorialImage").files[0];

        if (!name || !birthDate || !deathDate || !biography) {
            alert("Please fill in all required fields.");
            return;
        }

        console.log("Memorial Created:", {
            name,
            birthDate,
            deathDate,
            biography,
            message,
            imageFile
        });

        alert("Memorial created successfully!");
        e.target.reset();
    });
});