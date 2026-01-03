from pydantic import BaseModel
from typing import List
from datetime import date


class StockPickOut(BaseModel):
    stock_name: str
    ticker_symbol: str
    upside_potential: str
    latest_market_news: str
    pros: List[str]
    risks: List[str]


class StockHistoryOut(BaseModel):
    stock_name: str
    created_at: date
    call_price: float
    current_price: float
    pct_change: float
    analysis_pdf_url: str | None