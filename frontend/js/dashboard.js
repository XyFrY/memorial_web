document.addEventListener("DOMContentLoaded", function() {
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
        drafts: document.getElementById("drafts-btn"),
    };

    const tables = {
        requests: document.getElementById("request-table"),
        published: document.getElementById("published-table"),
        drafts: document.getElementById("drafts-table"),
    };

    // Function to switch between tables
    function showTable(name) {
        // Hide all tables
        Object.values(tables).forEach(table => table.style.display = "none");

        // Remove active class from all buttons
        Object.values(buttons).forEach(btn => btn.classList.remove("btn-dark"));

        // Show selected table and highlight button
        tables[name].style.display = "block";
        buttons[name].classList.add("btn-dark");
    }

    // Add event listeners to buttons
    buttons.requests.addEventListener("click", () => showTable("requests"));
    buttons.published.addEventListener("click", () => showTable("published"));
    buttons.drafts.addEventListener("click", () => showTable("drafts"));

    // Show requests table by default
    showTable("requests");

    // Populate tables with sample data based on role
    populateTables(isAdmin);
});

function populateTables(isAdmin) {
    // Sample data for requests
    const requestData = [
        { id: "11111", name: "Johnny Bravo", submittedBy: "friendofjohnny@hotmail.com", submitted: "2d ago", status: "Pending" },
        { id: "22222", name: "Macro Polo", submittedBy: "sailer1254@gmail.com", submitted: "3d ago", status: "Pending" }
    ];

    const publishedData = [
        { id: "33333", name: "Steve", submittedBy: "mine@cox.com", submitted: "5d ago", status: "Published" }
    ];

    const draftsData = [
        { id: "55555", name: "Philip J. Fry", draftedBy: "futureman@cox.com", drafted: "365000 ago" }
    ];

    // Populate requests table
    const requestTbody = document.getElementById("request-tbody");
    requestTbody.innerHTML = requestData.map(item => `
        <tr class="align-middle">
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.submittedBy}</td>
            <td>${item.submitted}</td>
            <td>${item.status}</td>
            <td>
                ${isAdmin
                    ? `<button class="btn btn-sm btn-light rounded-pill px-3 me-2">Review</button>
                       <button class="btn btn-sm btn-danger rounded-pill px-3">Reject</button>`
                    : `<button class="btn btn-sm btn-light rounded-pill px-3 me-2">Edit</button>
                       <button class="btn btn-sm btn-danger rounded-pill px-3">Remove</button>`
                }
            </td>
        </tr>
    `).join('');

    // Populate published table
    const publishedTbody = document.getElementById("published-tbody");
    publishedTbody.innerHTML = publishedData.map(item => `
        <tr class="align-middle">
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.submittedBy}</td>
            <td>${item.submitted}</td>
            <td>${item.status}</td>
            <td>
                <button class="btn btn-sm btn-danger rounded-pill px-3">Remove</button>
            </td>
        </tr>
    `).join('');

    // Populate drafts table
    const draftsTbody = document.getElementById("drafts-tbody");
    draftsTbody.innerHTML = draftsData.map(item => `
        <tr class="align-middle">
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.draftedBy}</td>
            <td>${item.drafted}</td>
            <td>
                ${isAdmin
                    ? `<button class="btn btn-sm btn-danger rounded-pill px-3">Remove</button>`
                    : `<button class="btn btn-sm btn-light rounded-pill px-3 me-2">Edit</button>
                       <button class="btn btn-sm btn-danger rounded-pill px-3">Remove</button>`
                }
            </td>
        </tr>
    `).join('');
}
