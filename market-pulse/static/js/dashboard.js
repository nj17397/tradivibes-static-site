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

                <p class="news">${s.summary}</p>

                <div class="upside">Upside Potential: ${s.upside_potential}</div>

                <div class="upside">Call Price: ${s.call_price}</div>
                <div class="upside">Target Price: ${s.target_price}</div>
                <div class="upside">Stop Loss: ${s.stop_loss}</div>
                <div class="upside">Confidence: ${s.confidence_percentage}</div>
                <div class="upside">Time horizon: ${s.time_horizon}</div>


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


//   stock_name: str
//     ticker_symbol: str
//     call_price : Decimal 
//     target_price : Decimal
//     stop_loss : Decimal
//     upside_potential: str
//     summary: str
//     confidence_percentage : str
//     pros: List[str]
//     risks: List[str]

loadToday();