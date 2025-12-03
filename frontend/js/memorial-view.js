
document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const memorialId = urlParams.get('id');

    if (!memorialId) {
        showError("No memorial ID provided. Please select a memorial to view.");
        return;
    }

    await loadMemorial(memorialId);
});

async function loadMemorial(memorialId) {
    const spinner = document.getElementById("loadingSpinner");
    const content = document.getElementById("memorialContent");

    try {
        spinner.classList.remove("d-none");
        content.style.opacity = "0.5";

        const token = authStorage.getToken();
        const response = await memorialAPI.getById(memorialId, token);
        const memorial = response.memorial;

        populateMemorial(memorial);

        document.title = `${getFullName(memorial)} - Memorial`;

        spinner.classList.add("d-none");
        content.style.opacity = "1";

    } catch (error) {
        console.error("Failed to load memorial:", error);
        spinner.classList.add("d-none");
        content.style.opacity = "1";
        showError(error.message || "Failed to load memorial. Please try again.");
    }
}

function populateMemorial(memorial) {
    document.getElementById("memorialName").textContent = getFullName(memorial);

    const birthYear = new Date(memorial.birthDate).getFullYear();
    const deathYear = new Date(memorial.deathDate).getFullYear();
    document.getElementById("memorialYears").textContent = `${birthYear} - ${deathYear}`;

    document.getElementById("birthDate").textContent = formatDate(memorial.birthDate);
    document.getElementById("deathDate").textContent = formatDate(memorial.deathDate);

    const birthLocationItem = document.getElementById("birthLocationItem");
    const birthLocationText = document.getElementById("birthLocation");
    if (memorial.birthLocation && (memorial.birthLocation.city || memorial.birthLocation.state)) {
        birthLocationText.textContent = formatLocation(memorial.birthLocation);
        birthLocationItem.style.display = "flex";
    } else {
        birthLocationItem.style.display = "none";
    }

    const deathLocationItem = document.getElementById("deathLocationItem");
    const deathLocationText = document.getElementById("deathLocation");
    if (memorial.deathLocation && (memorial.deathLocation.city || memorial.deathLocation.state)) {
        deathLocationText.textContent = formatLocation(memorial.deathLocation);
        deathLocationItem.style.display = "flex";
    } else {
        deathLocationItem.style.display = "none";
    }

    document.getElementById("biography").textContent = memorial.biography;

    const imageElement = document.getElementById("memorialImage");
    if (memorial.imageUrl) {
        imageElement.src = memorial.imageUrl;
        imageElement.alt = `${getFullName(memorial)} - Memorial Photo`;
    } else {
        imageElement.src = "frontend/images/placeholderimg.jpg";
        imageElement.alt = "Memorial Photo Placeholder";
    }
}

function getFullName(memorial) {
    const name = memorial.name;
    let fullName = `${name.first} `;
    if (name.middle) fullName += `${name.middle} `;
    fullName += name.last;
    if (name.suffix) fullName += ` ${name.suffix}`;
    return fullName.trim();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatLocation(location) {
    if (location.city && location.state) {
        return `${location.city}, ${location.state}`;
    } else if (location.city) {
        return location.city;
    } else if (location.state) {
        return location.state;
    }
    return "Not specified";
}

function showError(message) {
    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = message;
    errorAlert.classList.remove("d-none");

    const content = document.getElementById("memorialContent");
    content.style.display = "none";
}
