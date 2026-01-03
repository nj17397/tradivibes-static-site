async function loadToday() {
    const res = await fetch("/api/stocks/today");
    const data = await res.json();

    const el = document.getElementById("stock-cards");
    el.innerHTML = "";

    data.forEach(s => {
        el.innerHTML += `
        <div class="border p-4 rounded">
            <h3>${s.stock_name}</h3>
            <p>${s.summary}</p>
            <strong>${s.expected_upside}</strong>
        </div>`;
    });
}

async function searchHistory() {
    const from = fromDate.value;
    const to = toDate.value;

    const res = await fetch(`/api/stocks/history?from_date=${from}&to_date=${to}`);
    const data = await res.json();

    const tbody = document.getElementById("history-table");
    tbody.innerHTML = "";

    data.forEach(r => {
        tbody.innerHTML += `
        <tr>
            <td>${r.stock_name}</td>
            <td>${r.pct_change.toFixed(2)}%</td>
        </tr>`;
    });
}

loadToday();