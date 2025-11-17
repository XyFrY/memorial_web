// Memorial creation page handler - validates and submits memorial data to the database.

// US state codes for the state dropdown.
const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

// Valid name suffixes.
const NAME_SUFFIXES = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];

document.addEventListener("DOMContentLoaded", () => {
    const memorialForm = document.getElementById("memorialForm");
    if (!memorialForm) return;

    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");
    const successAlert = document.getElementById("successAlert");
    const successMessage = document.getElementById("successMessage");

    // Populate the state dropdowns with all US states.
    function populateStateDropdowns() {
        const birthStateSelect = document.getElementById("birthState");
        const deathStateSelect = document.getElementById("deathState");

        US_STATES.forEach(state => {
            const birthOption = document.createElement("option");
            birthOption.value = state;
            birthOption.textContent = state;
            birthStateSelect.appendChild(birthOption);

            const deathOption = document.createElement("option");
            deathOption.value = state;
            deathOption.textContent = state;
            deathStateSelect.appendChild(deathOption);
        });
    }

    // Populate the suffix dropdown with valid name suffixes.
    function populateSuffixDropdown() {
        const suffixSelect = document.getElementById("nameSuffix");

        NAME_SUFFIXES.forEach(suffix => {
            const option = document.createElement("option");
            option.value = suffix;
            option.textContent = suffix;
            suffixSelect.appendChild(option);
        });
    }

    // Display an error message at the top of the form and scroll so the user can see it.
    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove("d-none");
        successAlert.classList.add("d-none");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Display a success message at the top of the form.
    function showSuccess(message) {
        successMessage.textContent = message;
        successAlert.classList.remove("d-none");
        errorAlert.classList.add("d-none");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Hide both error and success alerts.
    function hideAlerts() {
        errorAlert.classList.add("d-none");
        successAlert.classList.add("d-none");
    }

    // Check if the user is logged in before allowing memorial submission.
    function checkAuthentication() {
        if (!authStorage.isAuthenticated()) {
            showError("You need to be logged in to create a memorial. Please log in first.");
            return false;
        }
        return true;
    }

    // Initialize dropdowns when the page loads.
    populateStateDropdowns();
    populateSuffixDropdown();

    memorialForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideAlerts();

        // Make sure the user is logged in before submitting.
        if (!checkAuthentication()) {
            return;
        }

        // Collect all form data.
        const firstName = document.getElementById("firstName").value.trim();
        const middleName = document.getElementById("middleName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const nameSuffix = document.getElementById("nameSuffix").value.trim();
        const birthDate = document.getElementById("birthDate").value;
        const deathDate = document.getElementById("deathDate").value;
        const biography = document.getElementById("biography").value.trim();
        const birthCity = document.getElementById("birthCity").value.trim();
        const birthState = document.getElementById("birthState").value;
        const deathCity = document.getElementById("deathCity").value.trim();
        const deathState = document.getElementById("deathState").value;

        // Validate required fields.
        if (!firstName || !lastName || !birthDate || !deathDate || !biography) {
            showError("Please fill in all required fields.");
            return;
        }

        // Build the memorial data object to send to the API.
        const memorialData = {
            name: {
                first: firstName,
                middle: middleName || undefined,
                last: lastName,
                suffix: nameSuffix || undefined
            },
            birthDate,
            deathDate,
            biography
        };

        // Add birth location if either city or state is provided.
        if (birthCity || birthState) {
            memorialData.birthLocation = {
                city: birthCity || undefined,
                state: birthState || undefined
            };
        }

        // Add death location if either city or state is provided.
        if (deathCity || deathState) {
            memorialData.deathLocation = {
                city: deathCity || undefined,
                state: deathState || undefined
            };
        }

        // Disable the submit button while creating the memorial to prevent duplicate submissions.
        const submitButton = memorialForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Creating memorial...";

        try {
            // Get the auth token and send the memorial data to the API.
            const token = authStorage.getToken();
            const response = await memorialAPI.create(memorialData, token);

            // Show success message and reset the form.
            showSuccess("Memorial created successfully! It will be reviewed by our team before being published.");
            memorialForm.reset();
        } catch (error) {
            // Show error message if something went wrong.
            showError(error.message || "Failed to create memorial. Please try again.");
        } finally {
            // Re-enable the submit button.
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});
