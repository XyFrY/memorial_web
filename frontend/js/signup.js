// Signup page handler - validates input and creates new user accounts.

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
