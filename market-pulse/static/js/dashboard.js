async function loadToday() {
    const res = await fetch("/api/stocks/today");
    const data = await res.json();

    const el = document.getElementById("stock-cards");
    el.innerHTML = "";

    data.forEach(s => {
        el.innerHTML += `
            <div class="card">
                <div class="card-header">
                    <h3 class="stock-name">${s.stock_name}</h3>
                    <span class="ticker">NSE : ${s.ticker_symbol}</span>
                </div>

                <p class="news">${s.latest_market_news}</p>

                <div class="upside">Upside Potential: ${s.upside_potential}</div>

                <div class="section-title">Pros</div>
                <ul>
                    ${s.pros.map(p => `<li>${p}</li>`).join("")}
                </ul>

                <div class="section-title">Risks</div>
                <ul>
                    ${s.risks.map(r => `<li class="risk">${r}</li>`).join("")}
                </ul>
            </div>
        `;
    });
}

function toggleTheme() {
    document.body.classList.toggle("dark");
}

loadToday();