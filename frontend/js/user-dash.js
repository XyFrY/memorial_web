document.addEventListener("DOMContentLoaded", function(){
    const headers = {
        requests: document.getElementById("request-h"),
        published: document.getElementById("published-h"),
        drafts: document.getElementById("drafts-h"),
    }

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

    function dyTables(name){
        Object.values(tables).forEach(table => table.style.display = "none");

        Object.values(buttons).forEach(btn =>  btn.classList.remove("btn-dark"));

        Object.values(headers).forEach(h => h.style.display = "none");

        headers[name].style.display = "block";
        tables[name].style.display = "block";
        buttons[name].classList.add("btn-dark");
    }

    buttons.requests.addEventListener("click", () => dyTables("requests"));
    buttons.published.addEventListener("click", () => dyTables("published"));
    buttons.drafts.addEventListener("click", () => dyTables("drafts"));

    dyTables("requests");
});