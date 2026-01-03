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
               created_at,
               call_price,
               current_price,
               ROUND(((current_price - call_price) / call_price) * 100, 2) AS pct_change,
               analysis_pdf_url
        FROM stock_call_history
        WHERE created_at BETWEEN :from_date AND :to_date
        ORDER BY created_at DESC
    """)
    return db.execute(
        query,
        {"from_date": from_date, "to_date": to_date}
    ).mappings().all()