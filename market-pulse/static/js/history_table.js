async function loadHistory() {
    const historyStocks = await fetch("/api/stocks/history?from_date=2025-12-01&to_date=2026-01-03");
    const historyData = await historyStocks.json();
    
    let currentSort = {
    key: null,        // stock_name | profit_pct | status
    direction: "asc"  // asc | desc
    };

    let currentRows = [...historyData]; // keeps filtered/sorted rows
    let paginated_rows = currentRows;
    let currentPage = 1;
    let pageSize = 2;

    /******************************
     * DOM REFERENCES
     ******************************/
    const el = document.getElementById("history-table-body");
    el.innerHTML = "";

    const filterIcon = document.getElementById("calledOnFilterIcon");
    const popup = document.getElementById("calledOnFilterPopup");
    const fromInput = document.getElementById("calledOnFrom");
    const toInput = document.getElementById("calledOnTo");
    const applyBtn = document.getElementById("applyCalledOnFilter");
    const resetBtn = document.getElementById("resetCalledOnFilter");
    const sortIcons = document.querySelectorAll(".sort-icon");

    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageNumbersEl = document.getElementById("pageNumbers");
    const pageSizeSelect = document.getElementById("pageSizeSelect");



    /********************************
     * PAGINATION HELPERS
     ********************************/
    function getTotalPages() {
        return Math.ceil(currentRows.length / pageSize) || 1;
    }

    function getPaginatedRows() {
        const start = (currentPage - 1) * pageSize;
        return currentRows.slice(start, start + pageSize);
    }

    /********************************
     * RENDER PAGE NUMBERS
     ********************************/
    function renderPageNumbers() {
        pageNumbersEl.innerHTML = "";
        const totalPages = getTotalPages();

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.className = i === currentPage ? "active" : "";

            btn.addEventListener("click", () => {
                currentPage = i;
                renderTable(currentRows);
            });

            pageNumbersEl.appendChild(btn);
        }
    }

    /********************************
     * UPDATE PAGINATION CONTROLS
     ********************************/
    function updatePaginationControls() {
        const totalPages = getTotalPages();

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        renderPageNumbers();
    }

    /******************************
     * TABLE RENDER FUNCTION
     ******************************/

    function renderTable(rows) {
        el.innerHTML = "";
        const paginated_rows = getPaginatedRows();
        if (!paginated_rows.length) {
            el.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;">
                        No records found
                    </td>
                </tr>
            `;
            updatePaginationControls();
            return;
        }
        paginated_rows.forEach(s => {
        const row_class = s.pct_profit > 3 ? "row-high-profit" : s.pct_profit < 2 ? "row-loss" : "";

        el.innerHTML += `
            <tr class="${row_class}">
                <td>${s.stock_name ?? "-"}</td>
                <td>${s.updated_at ?? "-"}</td>
                <td>${s.call_price ?? "-"}</td>
                <td>${s.sell_price ?? "-"}</td>
                <td class="${s.pct_profit >= 0 ? 'profit' : 'loss'}">
                    ${s.pct_profit ?? "-"}
                </td>
                <td>${s.stop_loss ?? "-"}</td>
                <td>${s.holding_week ?? "-"}</td> 
                <td>${s.call_status ?? "-"}</td>
            </tr>
        `;
        });
        updatePaginationControls();

    }

// Toggle popup
filterIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    popup.classList.toggle("active");
});

// Close popup when clicking outside
document.addEventListener("click", () => {
    popup.classList.remove("active");
});

// Prevent closing when clicking inside popup
popup.addEventListener("click", (e) => {
    e.stopPropagation();
});

/******************************
 * DATE FILTER LOGIC
 ******************************/

// Apply filter
applyBtn.addEventListener("click", async () => {
    const from = fromInput.value;
    const to = toInput.value;
    const historyStocks = await fetch("/api/stocks/history?from_date=" + from + "&to_date=" + to);
    const filtered =   await historyStocks.json();
    renderTable(filtered);
    popup.classList.remove("active");
});

// Reset filter
resetBtn.addEventListener("click", () => {
    fromInput.value = "";
    toInput.value = "";
    renderTable(historyData);
    popup.classList.remove("active");
});



/******************************
 * SORTING CHANGES
 ******************************/

function sortData(sortKey) {
    // Toggle direction if same column
    if (currentSort.key === sortKey) {
        currentSort.direction =
            currentSort.direction === "asc" ? "desc" : "asc";
    } else {
        currentSort.key = sortKey;
        currentSort.direction = "asc";
    }

    // currentRows.sort((a, b) => {
        currentRows.sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        // Numerical sorting
        if (sortKey === "pct_profit" || sortKey === "holding_week") {
            valA = Number(valA) || 0;
            valB = Number(valB) || 0;
        } else {
            // Alphabetical sorting
            valA = valA?.toString().toLowerCase() || "";
            valB = valB?.toString().toLowerCase() || "";
        }

        if (valA < valB) return currentSort.direction === "asc" ? -1 : 1;
        if (valA > valB) return currentSort.direction === "asc" ? 1 : -1;
        return 0;
    });

    // currentPage = 1; // reset page on sort
    updateSortIcons();
    // renderTable(currentRows);
    renderTable();
}

function updateSortIcons() {
    sortIcons.forEach(icon => {
        icon.classList.remove("active", "desc");

        if (icon.dataset.sort === currentSort.key) {
            icon.classList.add("active");

            if (currentSort.direction === "desc") {
                icon.classList.add("desc");
            }
        }
    });
}

sortIcons.forEach(icon => {
    icon.addEventListener("click", (e) => {
        e.stopPropagation();
        const sortKey = icon.dataset.sort;
        sortData(sortKey);
    });
});

// PAGINATION EVENTS

    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentPage < getTotalPages()) {
            currentPage++;
            renderTable();
        }
    });

    pageSizeSelect.addEventListener("change", (e) => {
        pageSize = Number(e.target.value);
        currentPage = 1;
        renderTable();
    });

/******************************
 * INITIAL RENDER
 ******************************/
renderTable(currentRows);

}
loadHistory();