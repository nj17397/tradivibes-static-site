from sqlalchemy import text
from sqlalchemy import text
import json


def fetch_today_picks(db, limit: int):
    query = text("""
        SELECT stock_name,
               ticker_symbol,
               upside_potential,
               latest_market_news,
               pros,
               risks
        FROM trading.stock_upside_analysis
        ORDER BY id DESC
        LIMIT :limit
    """)

    result = db.execute(query, {"limit": limit})

    rows = result.mappings().all()

    response = []

    for row in rows:
        response.append({
            "stock_name": row["stock_name"],
            "ticker_symbol": row["ticker_symbol"],
            "upside_potential": row["upside_potential"],
            "latest_market_news": row["latest_market_news"],
            "pros": json.loads(row["pros"]) if isinstance(row["pros"], str) else row["pros"],
            "risks": json.loads(row["risks"]) if isinstance(row["risks"], str) else row["risks"],
        })

    return response


def fetch_history(db, from_date, to_date):
    query = text("""
        SELECT stock_name,
               call_price,
               sell_price,
               stop_loss,
               DATE(updated_at) as updated_at,
               CASE
                  WHEN call_price IS NULL
                  OR sell_price IS NULL
                  OR call_price = 0
                  THEN NULL
                  ELSE ROUND(((sell_price - call_price) / call_price) * 100, 2)
                END AS pct_profit,
               CASE
                  WHEN call_closed_at IS NULL THEN NULL
                  ELSE ROUND(DATEDIFF(call_closed_at, DATE(updated_at)) / 7, 2)
               END AS holding_week,
                 call_status
        FROM trading.stock_upside_analysis
        WHERE date(updated_at) BETWEEN :from_date AND :to_date
        ORDER BY updated_at DESC
    """)
    return db.execute(
        query,
        {"from_date": from_date, "to_date": to_date}
    ).mappings().all()