
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");

    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove("d-none");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function hideError() {
        errorAlert.classList.add("d-none");
        errorMessage.textContent = "";
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideError();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            showError("Please enter both email and password.");
            return;
        }

        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";

        try {
            const response = await authAPI.login(email, password);

            authStorage.saveAuth(response.token, response.user);

            window.location.href = "dashboard.html";
        } catch (error) {
            showError(error.message || "Login failed. Please try again.");
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});
