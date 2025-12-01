document.addEventListener("DOMContentLoaded", async function() {
    // Check authentication
    const user = authStorage.getUser();
    const token = authStorage.getToken();

    if (!user || !token) {
        // Redirect to login if not authenticated
        window.location.href = "login.html";
        return;
    }

    // Check if user is admin
    const isAdmin = user.isAdmin || false;

    // Update dashboard title based on role
    const titleElement = document.getElementById("dashboard-title");
    titleElement.textContent = isAdmin ? "Admin Dashboard" : "My Dashboard";

    // Show admin stats if admin
    if (isAdmin) {
        document.getElementById("admin-stats").style.display = "block";
    }

    // Get UI elements
    const buttons = {
        requests: document.getElementById("request-btn"),
        published: document.getElementById("published-btn"),
    };

    const tables = {
        requests: document.getElementById("request-table"),
        published: document.getElementById("published-table"),
    };

    // Function to switch between tables
    function showTable(name) {
        // Hide all tables
        Object.values(tables).forEach(table => table.style.display = "none");

        // Remove active class from all buttons
        Object.values(buttons).forEach(btn => {
            btn.classList.remove("btn-primary");
            btn.classList.add("btn-outline-primary");
        });

        // Show selected table and highlight button
        tables[name].style.display = "block";
        buttons[name].classList.remove("btn-outline-primary");
        buttons[name].classList.add("btn-primary");
    }

    // Add event listeners to buttons
    buttons.requests.addEventListener("click", () => showTable("requests"));
    buttons.published.addEventListener("click", () => showTable("published"));

    // Show requests table by default
    showTable("requests");

    // Fetch and populate tables with real data
    await loadDashboardData(isAdmin, token);
});

async function loadDashboardData(isAdmin, token) {
    const spinner = document.getElementById("loadingSpinner");
    const content = document.getElementById("dashboardContent");

    try {
        // Show loading spinner
        spinner.classList.remove("d-none");
        content.style.opacity = "0.5";

        let memorials = [];

        // Fetch memorials based on role
        if (isAdmin) {
            // Admin sees all memorials
            const response = await memorialAPI.getAll(token, true);
            memorials = response.memorials || [];
        } else {
            // Regular user sees only their own memorials
            const response = await memorialAPI.getSelf(token);
            memorials = response.memorials || [];
        }

        // Categorize memorials
        const pending = memorials.filter(m => !m.approved);
        const published = memorials.filter(m => m.approved);

        // Update stats if admin
        if (isAdmin) {
            updateStats(pending.length, published.length);
        }

        // Populate tables
        populateRequestsTable(pending, isAdmin, token);
        populatePublishedTable(published, isAdmin, token);

        // Hide loading spinner
        spinner.classList.add("d-none");
        content.style.opacity = "1";

    } catch (error) {
        console.error("Failed to load dashboard data:", error);
        spinner.classList.add("d-none");
        content.style.opacity = "1";
        showError("Failed to load memorial data. Please try again.");
    }
}

function updateStats(pendingCount, publishedCount) {
    const statsTable = document.querySelector("#admin-stats tbody tr");
    if (statsTable) {
        statsTable.innerHTML = `
            <td>${pendingCount}</td>
            <td>${publishedCount}</td>
        `;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
}

function getFullName(memorial) {
    const name = memorial.name;
    let fullName = `${name.first} `;
    if (name.middle) fullName += `${name.middle} `;
    fullName += name.last;
    if (name.suffix) fullName += ` ${name.suffix}`;
    return fullName;
}

function populateRequestsTable(memorials, isAdmin, token) {
    const tbody = document.getElementById("request-tbody");

    if (memorials.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No pending requests</td></tr>';
        return;
    }

    tbody.innerHTML = memorials.map(memorial => `
        <tr class="align-middle">
            <td>${memorial._id.slice(-5)}</td>
            <td>${getFullName(memorial)}</td>
            <td>${memorial.createdBy}</td>
            <td>${formatDate(memorial.createdAt)}</td>
            <td><span class="badge bg-warning text-dark">Pending</span></td>
            <td>
                ${isAdmin
                    ? `<button class="btn btn-sm btn-success me-2" onclick="approveMemorial('${memorial._id}')">Approve</button>
                       <button class="btn btn-sm btn-danger" onclick="rejectMemorial('${memorial._id}')">Reject</button>`
                    : `<button class="btn btn-sm btn-outline-secondary me-2" onclick="editMemorial('${memorial._id}')">Edit</button>
                       <button class="btn btn-sm btn-outline-danger" onclick="deleteMemorial('${memorial._id}')">Remove</button>`
                }
            </td>
        </tr>
    `).join('');
}

function populatePublishedTable(memorials, isAdmin, token) {
    const tbody = document.getElementById("published-tbody");

    if (memorials.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No published memorials</td></tr>';
        return;
    }

    tbody.innerHTML = memorials.map(memorial => `
        <tr class="align-middle">
            <td>${memorial._id.slice(-5)}</td>
            <td>${getFullName(memorial)}</td>
            <td>${memorial.createdBy}</td>
            <td>${formatDate(memorial.publishedAt || memorial.createdAt)}</td>
            <td><span class="badge bg-success">Published</span></td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteMemorial('${memorial._id}', ${isAdmin})">Remove</button>
            </td>
        </tr>
    `).join('');
}

function showError(message) {
    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = message;
    errorAlert.classList.remove("d-none");

    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorAlert.classList.add("d-none");
    }, 5000);
}

// Global functions for button actions
window.approveMemorial = async function(memorialId) {
    const token = authStorage.getToken();
    try {
        await memorialAPI.updateApproval(memorialId, true, token);
        location.reload(); // Reload to refresh data
    } catch (error) {
        showError("Failed to approve memorial");
    }
};

window.rejectMemorial = async function(memorialId) {
    const token = authStorage.getToken();
    const user = authStorage.getUser();
    if (!confirm("Are you sure you want to reject this memorial?")) return;

    try {
        await memorialAPI.deleteAdmin(memorialId, token);
        location.reload(); // Reload to refresh data
    } catch (error) {
        showError("Failed to reject memorial");
    }
};

window.editMemorial = function(memorialId) {
    window.location.href = `create-memorial.html?edit=${memorialId}`;
};

window.deleteMemorial = async function(memorialId, isAdmin = false) {
    if (!confirm("Are you sure you want to delete this memorial?")) return;

    const token = authStorage.getToken();
    try {
        if (isAdmin) {
            await memorialAPI.deleteAdmin(memorialId, token);
        } else {
            await memorialAPI.deleteSelf(memorialId, token);
        }
        location.reload(); // Reload to refresh data
    } catch (error) {
        showError("Failed to delete memorial");
    }
};
