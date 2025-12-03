
const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const NAME_SUFFIXES = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];

document.addEventListener("DOMContentLoaded", () => {
    const memorialForm = document.getElementById("memorialForm");
    if (!memorialForm) return;

    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");
    const successAlert = document.getElementById("successAlert");
    const successMessage = document.getElementById("successMessage");

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

    function populateSuffixDropdown() {
        const suffixSelect = document.getElementById("nameSuffix");

        NAME_SUFFIXES.forEach(suffix => {
            const option = document.createElement("option");
            option.value = suffix;
            option.textContent = suffix;
            suffixSelect.appendChild(option);
        });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove("d-none");
        successAlert.classList.add("d-none");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successAlert.classList.remove("d-none");
        errorAlert.classList.add("d-none");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function hideAlerts() {
        errorAlert.classList.add("d-none");
        successAlert.classList.add("d-none");
    }

    function checkAuthentication() {
        if (!authStorage.isAuthenticated()) {
            showError("You need to be logged in to create a memorial. Please log in first.");
            return false;
        }
        return true;
    }

    populateStateDropdowns();
    populateSuffixDropdown();

    const imageInput = document.getElementById("memorialImage");
    const imagePreview = document.getElementById("imagePreview");
    const previewImg = document.getElementById("previewImg");

    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showError("Image file is too large. Maximum size is 5MB.");
                imageInput.value = "";
                imagePreview.classList.add("d-none");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                imagePreview.classList.remove("d-none");
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.classList.add("d-none");
        }
    });

    memorialForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideAlerts();

        if (!checkAuthentication()) {
            return;
        }

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
        const imageFile = document.getElementById("memorialImage").files[0];

        if (!firstName || !lastName || !birthDate || !deathDate || !biography) {
            showError("Please fill in all required fields.");
            return;
        }

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

        if (birthCity || birthState) {
            memorialData.birthLocation = {
                city: birthCity || undefined,
                state: birthState || undefined
            };
        }

        if (deathCity || deathState) {
            memorialData.deathLocation = {
                city: deathCity || undefined,
                state: deathState || undefined
            };
        }

        const submitButton = memorialForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Creating memorial...";

        try {
            const token = authStorage.getToken();

            if (imageFile) {
                submitButton.textContent = "Uploading image...";
                const uploadResponse = await uploadAPI.uploadImage(imageFile, token);
                memorialData.imageUrl = uploadResponse.imageUrl;
            }

            submitButton.textContent = "Creating memorial...";
            const response = await memorialAPI.create(memorialData, token);

            showSuccess("Memorial created successfully! It will be reviewed by our team before being published.");
            memorialForm.reset();
        } catch (error) {
            showError(error.message || "Failed to create memorial. Please try again.");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});
