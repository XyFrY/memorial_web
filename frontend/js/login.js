// Login page handler - validates credentials and authenticates users.

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
