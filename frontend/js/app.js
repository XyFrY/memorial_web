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


// Login Page Section - handles user authentication.
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");

    // Display an error message at the top of the form and scroll so the user can see it.
    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove("d-none");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Hide the error alert and clear any previous error messages.
    function hideError() {
        errorAlert.classList.add("d-none");
        errorMessage.textContent = "";
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideError();

        // Grab the email and password from the form.
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Make sure both fields are filled out before submitting.
        if (!email || !password) {
            showError("Please enter both email and password.");
            return;
        }

        // Disable the submit button while we're logging in to prevent duplicate submissions.
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";

        try {
            // Send credentials to the server and get back a token if they're correct.
            const response = await authAPI.login(email, password);

            // Save the authentication data so the user stays logged in.
            authStorage.saveAuth(response.token, response.user);

            // Send them to the dashboard now that they're logged in.
            window.location.href = "dashboard.html";
        } catch (error) {
            // If login failed, show the error and let them try again.
            showError(error.message || "Login failed. Please try again.");
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});

// Signup Page Section - handles account creation and validation.
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    if (!signupForm) return;

    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");
    const emailInput = document.getElementById("email");
    const emailFeedback = document.getElementById("emailFeedback");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const passwordMatchFeedback = document.getElementById("passwordMatchFeedback");

    // Display an error message at the top of the form and scroll so the user can see it.
    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove("d-none");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Hide the error alert and clear any previous error messages.
    function hideError() {
        errorAlert.classList.add("d-none");
        errorMessage.textContent = "";
    }

    // Check if email is in the correct format (WORD@DOMAIN.TLD).
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Check if password meets the minimum length requirement of 8 characters.
    function isValidPassword(password) {
        return password.length >= 8;
    }

    // Validate email format and show visual feedback as the user types.
    function checkEmailFormat() {
        const email = emailInput.value.trim();

        if (email.length > 0) {
            if (!isValidEmail(email)) {
                emailInput.classList.add("is-invalid");
                emailInput.classList.remove("is-valid");
                emailFeedback.textContent = "Please enter a valid email (e.g., user@example.com)";
                emailFeedback.style.display = "block";
            } else {
                emailInput.classList.remove("is-invalid");
                emailInput.classList.add("is-valid");
                emailFeedback.style.display = "none";
            }
        } else {
            emailInput.classList.remove("is-invalid", "is-valid");
            emailFeedback.style.display = "none";
        }
    }

    // Validate password length and show visual feedback as the user types.
    function checkPasswordRequirements() {
        const password = passwordInput.value;

        if (password.length > 0) {
            if (!isValidPassword(password)) {
                passwordInput.classList.add("is-invalid");
                passwordInput.classList.remove("is-valid");
            } else {
                passwordInput.classList.remove("is-invalid");
                passwordInput.classList.add("is-valid");
            }
        } else {
            passwordInput.classList.remove("is-invalid", "is-valid");
        }

        // Also recheck password match when password changes.
        checkPasswordMatch();
    }

    // Check if the password and confirm password fields match and show visual feedback.
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Only show feedback if they've started typing in the confirm password field.
        if (confirmPassword.length > 0) {
            if (password !== confirmPassword) {
                confirmPasswordInput.classList.add("is-invalid");
                confirmPasswordInput.classList.remove("is-valid");
                passwordMatchFeedback.textContent = "Passwords do not match";
                passwordMatchFeedback.classList.remove("valid-feedback");
                passwordMatchFeedback.classList.add("invalid-feedback");
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

    // Add real-time validation as the user types.
    emailInput.addEventListener("input", checkEmailFormat);
    passwordInput.addEventListener("input", checkPasswordRequirements);
    confirmPasswordInput.addEventListener("input", checkPasswordMatch);

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideError();

        // Grab all the form values and trim whitespace.
        const name = document.getElementById("name").value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Make sure all fields are filled out before submitting.
        if (!name || !email || !password || !confirmPassword) {
            showError("Please fill out all fields.");
            return;
        }

        // Check that email is in the correct format.
        if (!isValidEmail(email)) {
            showError("Please enter a valid email address (e.g., user@example.com).");
            return;
        }

        // Check that password meets the minimum length requirement.
        if (!isValidPassword(password)) {
            showError("Password must be at least 8 characters long.");
            return;
        }

        // Double-check that passwords match before sending to the server.
        if (password !== confirmPassword) {
            showError("Passwords do not match. Please try again.");
            return;
        }

        // Disable the submit button while we're creating the account to prevent duplicate submissions.
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Creating account...";

        try {
            // Create the account and get back a token we can use for future requests.
            const response = await authAPI.signup(name, email, password);

            // Save the authentication data so the user stays logged in.
            authStorage.saveAuth(response.token, response.user);

            // Send them to the dashboard now that they're signed up and logged in.
            window.location.href = "dashboard.html";
        } catch (error) {
            // If something went wrong, show the error and let them try again.
            showError(error.message || "An error occurred during signup. Please try again.");
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
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
