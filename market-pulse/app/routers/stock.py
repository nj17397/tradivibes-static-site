from fastapi import APIRouter, Depends, Query
from datetime import date
from typing import List

from app.dependencies import get_db
from app.services.stock_service import get_today_picks, get_stock_history
from app.models.stock import StockPickOut, StockHistoryOut

router = APIRouter(prefix="/api/stocks", tags=["Stocks"])


@router.get("/today", response_model=List[StockPickOut])
def today_picks(limit: int = 3, db=Depends(get_db)):
    return get_today_picks(db, limit)


@router.get("/history", response_model=List[StockHistoryOut])
def history(
    from_date: date = Query(...),
    to_date: date = Query(...),
    db=Depends(get_db)
):
    return get_stock_history(db, from_date, to_date)