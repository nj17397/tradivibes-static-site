from pydantic import BaseModel
from typing import List,Optional
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
    updated_at: date
    call_price: Optional[float]
    sell_price: Optional[float]
    stop_loss: Optional[float]
    pct_profit: Optional[float]
    holding_week: Optional[float]