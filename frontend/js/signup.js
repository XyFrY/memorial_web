document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    if (!signupForm) return;

    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");
    const emailInput = document.getElementById("email");
    const emailFeedback = document.getElementById("emailFeedback");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const passwordMatchFeedback = document.getElementById(
        "passwordMatchFeedback"
    );

    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove("d-none");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function hideError() {
        errorAlert.classList.add("d-none");
        errorMessage.textContent = "";
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPassword(password) {
        return password.length >= 8;
    }

    function checkEmailFormat() {
        const email = emailInput.value.trim();

        if (email.length > 0) {
            if (!isValidEmail(email)) {
                emailInput.classList.add("is-invalid");
                emailInput.classList.remove("is-valid");
                emailFeedback.textContent =
                    "Please enter a valid email (e.g., user@example.com)";
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

        checkPasswordMatch();
    }

    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

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

    emailInput.addEventListener("input", checkEmailFormat);
    passwordInput.addEventListener("input", checkPasswordRequirements);
    confirmPasswordInput.addEventListener("input", checkPasswordMatch);

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideError();

        const name = document.getElementById("name").value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!name || !email || !password || !confirmPassword) {
            showError("Please fill out all fields.");
            return;
        }

        if (!isValidEmail(email)) {
            showError(
                "Please enter a valid email address (e.g., user@example.com)."
            );
            return;
        }

        if (!isValidPassword(password)) {
            showError("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            showError("Passwords do not match. Please try again.");
            return;
        }

        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Creating account...";

        try {
            const response = await authAPI.signup(name, email, password);

            authStorage.saveAuth(response.token, response.user);

            window.location.href = "dashboard.html";
        } catch (error) {
            showError(
                error.message ||
                    "An error occurred during signup. Please try again."
            );
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});
