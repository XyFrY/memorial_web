// Memorial view page - displays a single memorial's details

document.addEventListener("DOMContentLoaded", async function() {
    // Get memorial ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const memorialId = urlParams.get('id');

    if (!memorialId) {
        showError("No memorial ID provided. Please select a memorial to view.");
        return;
    }

    // Load the memorial data
    await loadMemorial(memorialId);
});

async function loadMemorial(memorialId) {
    const spinner = document.getElementById("loadingSpinner");
    const content = document.getElementById("memorialContent");

    try {
        // Show loading spinner
        spinner.classList.remove("d-none");
        content.style.opacity = "0.5";

        // Fetch memorial data (with token if available for unapproved memorials)
        const token = authStorage.getToken();
        const response = await memorialAPI.getById(memorialId, token);
        const memorial = response.memorial;

        // Populate the page with memorial data
        populateMemorial(memorial);

        // Update page title
        document.title = `${getFullName(memorial)} - Memorial`;

        // Hide loading spinner
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
    // Name
    document.getElementById("memorialName").textContent = getFullName(memorial);

    // Years
    const birthYear = new Date(memorial.birthDate).getFullYear();
    const deathYear = new Date(memorial.deathDate).getFullYear();
    document.getElementById("memorialYears").textContent = `${birthYear} - ${deathYear}`;

    // Dates
    document.getElementById("birthDate").textContent = formatDate(memorial.birthDate);
    document.getElementById("deathDate").textContent = formatDate(memorial.deathDate);

    // Birth Location
    const birthLocationItem = document.getElementById("birthLocationItem");
    const birthLocationText = document.getElementById("birthLocation");
    if (memorial.birthLocation && (memorial.birthLocation.city || memorial.birthLocation.state)) {
        birthLocationText.textContent = formatLocation(memorial.birthLocation);
        birthLocationItem.style.display = "flex";
    } else {
        birthLocationItem.style.display = "none";
    }

    // Death Location
    const deathLocationItem = document.getElementById("deathLocationItem");
    const deathLocationText = document.getElementById("deathLocation");
    if (memorial.deathLocation && (memorial.deathLocation.city || memorial.deathLocation.state)) {
        deathLocationText.textContent = formatLocation(memorial.deathLocation);
        deathLocationItem.style.display = "flex";
    } else {
        deathLocationItem.style.display = "none";
    }

    // Biography
    document.getElementById("biography").textContent = memorial.biography;

    // Image
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

    // Hide memorial content if there's an error
    const content = document.getElementById("memorialContent");
    content.style.display = "none";
}
