async function loadHistory() {
    const historyStocks = await fetch("/api/stocks/history?from_date=2025-12-01&to_date=2026-01-03");
    // http://localhost:8000/api/stocks/history?from_date=2025-12-01&to_date=2026-01-03
    const historyData = await historyStocks.json();
    
    /******************************
     * DOM REFERENCES
     ******************************/
    const el = document.getElementById("history-table-body");
    el.innerHTML = "";
    const fromDateInput = document.getElementById("fromDate");
    const toDateInput = document.getElementById("toDate");
    const resetBtn = document.getElementById("resetDateFilterBtn");
    resetBtn.addEventListener("click", resetFilter);
    const applyDateFilterBtn = document.getElementById("applyDateFilterBtn");
    applyDateFilterBtn.addEventListener("click", applyDateFilter);



    /******************************
     * TABLE RENDER FUNCTION
     ******************************/

    function renderTable(rows) {
        el.innerHTML = "";

        if (!rows.length) {
        el.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No records found
                </td>
            </tr>
        `;
        return;
    }
    rows.forEach(s => {
    el.innerHTML += `
        <tr>
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

}

/******************************
 * DATE FILTER LOGIC
 ******************************/
function applyDateFilter() {
    const from = fromDateInput.value;
    const to = toDateInput.value;

    const filtered = historyData.filter(s => {
        const calledDate = new Date(s.updated_at);

        if (from && calledDate < new Date(from)) return false;
        if (to && calledDate > new Date(to)) return false;

        return true;
    });

    renderTable(filtered);
}


function resetFilter() {
    fromDateInput.value = "";
    toDateInput.value = "";
    renderTable(historyData);
}

/******************************
 * AUTO FILTER ON DATE CHANGE
 ******************************/
fromDateInput.addEventListener("change", applyDateFilter);
toDateInput.addEventListener("change", applyDateFilter);

/******************************
 * INITIAL RENDER
 ******************************/
renderTable(historyData);

}
loadHistory();