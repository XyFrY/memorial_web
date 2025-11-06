// Navagation Section 
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");

    
    const nav = document.createElement("nav");
    nav.classList.add("navbar", "navbar-expand-lg", "navbar-light", "bg-body-tertiary", "shadow-sm");


    const container = document.createElement("div");
    container.classList.add("container-fluid");

 
    const brand = document.createElement("a");
    brand.classList.add("navbar-brand", "d-flex", "align-items-center");
    brand.href = "#";

    const logo = document.createElement("img");
    logo.src = "../images/nav-logo.png";
    logo.alt = "Logo";
    logo.width = 30;
    logo.height = 24;
    logo.classList.add("d-inline-block", "align-text-top", "me-2");

    const brandText = document.createElement("span");
    brandText.textContent = "Memorial Web";

    brand.appendChild(logo);
    brand.appendChild(brandText);


    const toggler = document.createElement("button");
    toggler.classList.add("navbar-toggler");
    toggler.type = "button";
    toggler.setAttribute("data-bs-toggle", "collapse");
    toggler.setAttribute("data-bs-target", "#navbarNav");
    toggler.setAttribute("aria-controls", "navbarNav");
    toggler.setAttribute("aria-expanded", "false");
    toggler.setAttribute("aria-label", "Toggle navigation");

    const togglerIcon = document.createElement("span");
    togglerIcon.classList.add("navbar-toggler-icon");
    toggler.appendChild(togglerIcon);

  
    const collapse = document.createElement("div");
    collapse.classList.add("collapse", "navbar-collapse");
    collapse.id = "navbarNav";


    const ul = document.createElement("ul");
    ul.classList.add("navbar-nav", "ms-auto");

    const links = [
        { text: "Home", href: "inde.tml" },
        { text: "Dashboard", href: "dashboard.html" },
        { text: "Create Memorial", href: "create-memorial.html" },
        { text: "Login", href: "login.html" },
    ];

    links.forEach((link, index) => {
        const li = document.createElement("li");
        li.classList.add("nav-item");

        const a = document.createElement("a");
        a.classList.add("nav-link");
        if (index === 0) a.classList.add("active"); 
        a.href = link.href;
        a.textContent = link.text;

        li.appendChild(a);
        ul.appendChild(li);
    });

    
    collapse.appendChild(ul);
    container.appendChild(brand);
    container.appendChild(toggler);
    container.appendChild(collapse);
    nav.appendChild(container);
    navbar.appendChild(nav);
});

// Login Page Section
document.getElementById("loginForm").addEventListener("submit", (e) => {
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

// Signup Page Section
   document.getElementById("signupForm").addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const confirmPassword = document.getElementById("confirmPassword").value.trim();

            if (!name || !email || !password || !confirmPassword) {
                alert("Please fill out all fields.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match. Please try again.");
                return;
            }


            console.log("Signing up:", { name, email, password });

         
            window.location.href = "login.html";
        });

// Create Memorial Section
 document.getElementById("memorialForm").addEventListener("submit", (e) => {
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