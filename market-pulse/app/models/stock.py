from pydantic import BaseModel
from typing import List,Optional
from datetime import date
from decimal import Decimal


class StockPickOut(BaseModel):
    stock_name: str
    ticker_symbol: str
    call_price : Decimal 
    target_price : Decimal
    stop_loss : Decimal
    upside_potential: str
    summary: str
    confidence_percentage : str
    pros: List[str]
    risks: List[str]
    time_horizon : str


class StockHistoryOut(BaseModel):
    stock_name: str
    call_opened_at: date
    call_price: Optional[float]
    target_price: Optional[float]
    stop_loss: Optional[float]
    upside_potential: Optional[str]      # Made Optional just in case
    time_horizon: Optional[str]
    holding_week: Optional[float]
    # FIX: Allow None values for call_status
    call_status: Optional[str]           
    call_closed_at: Optional[date]



    