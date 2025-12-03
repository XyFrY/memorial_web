
document.addEventListener("DOMContentLoaded", async () => {
    const memorialsContainer = document.getElementById("memorialsContainer");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function getFullName(name) {
        let fullName = name.first;
        if (name.middle) {
            fullName += ` ${name.middle}`;
        }
        fullName += ` ${name.last}`;
        if (name.suffix) {
            fullName += ` ${name.suffix}`;
        }
        return fullName;
    }

    function formatLocation(location) {
        if (!location) return "";
        if (location.city && location.state) {
            return `${location.city}, ${location.state}`;
        }
        if (location.city) return location.city;
        if (location.state) return location.state;
        return "";
    }

    function calculateAge(birthDate, deathDate) {
        const birth = new Date(birthDate);
        const death = new Date(deathDate);
        let age = death.getFullYear() - birth.getFullYear();
        const monthDiff = death.getMonth() - birth.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && death.getDate() < birth.getDate())
        ) {
            age--;
        }
        return age;
    }

    function truncateText(text, maxLength = 150) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + "...";
    }

    function createMemorialCard(memorial) {
        const fullName = getFullName(memorial.name);
        const birthLocation = formatLocation(memorial.birthLocation);
        const deathLocation = formatLocation(memorial.deathLocation);
        const age = calculateAge(memorial.birthDate, memorial.deathDate);
        const truncatedBio = truncateText(memorial.biography);

        const col = document.createElement("div");
        col.className = "col";

        const imageUrl = memorial.imageUrl || 'frontend/images/placeholderimg.jpg';

        col.innerHTML = `
            <a href="memorial.html?id=${memorial._id}" class="text-decoration-none">
                <div class="card shadow-sm h-100 memorial-card">
                    <img src="${imageUrl}" class="card-img-top" alt="${fullName}" style="height: 300px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-dark">${fullName}</h5>
                        <p class="card-text text-muted mb-2">
                            ${formatDate(memorial.birthDate)} - ${formatDate(memorial.deathDate)}
                            <br>
                            <small>Age: ${age} years</small>
                        </p>
                        ${
                            birthLocation
                                ? `<p class="card-text mb-1"><small><strong>Born:</strong> ${birthLocation}</small></p>`
                                : ""
                        }
                        ${
                            deathLocation
                                ? `<p class="card-text mb-2"><small><strong>Died:</strong> ${deathLocation}</small></p>`
                                : ""
                        }
                        <p class="card-text flex-grow-1 text-dark">${truncatedBio}</p>
                        <div class="mt-auto">
                            <small class="text-muted">Published ${formatDate(memorial.publishedAt)}</small>
                        </div>
                    </div>
                </div>
            </a>
        `;

        return col;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorAlert.classList.remove("d-none");
    }

    function hideError() {
        errorAlert.classList.add("d-none");
    }

    function showLoading() {
        loadingSpinner.classList.remove("d-none");
    }

    function hideLoading() {
        loadingSpinner.classList.add("d-none");
    }

    async function loadMemorials() {
        try {
            showLoading();
            hideError();

            const data = await memorialAPI.getAll();

            hideLoading();

            if (!data.memorials || data.memorials.length === 0) {
                memorialsContainer.innerHTML = `
                    <div class="col-12 d-flex justify-content-center">
                        <div class="card shadow-sm p-5 text-center" style="max-width: 600px; width: 100%;">
                            <div class="card-body">
                                <h3 class="fw-bold mb-3">No Memorials Yet</h3>
                                <p class="lead text-muted mb-4">Be the first to create a memorial and honor a loved one.</p>
                                <a href="create-memorial.html" class="btn btn-primary btn-lg">Create a Memorial</a>
                            </div>
                        </div>
                    </div>
                `;
                return;
            }

            memorialsContainer.innerHTML = "";
            data.memorials.forEach((memorial) => {
                const card = createMemorialCard(memorial);
                memorialsContainer.appendChild(card);
            });
        } catch (error) {
            hideLoading();
            console.error("Failed to load memorials:", error);
            showError(
                error.message ||
                    "Failed to load memorials. Please try again later."
            );
        }
    }

    loadMemorials();
});
