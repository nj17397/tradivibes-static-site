from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routers import ui, stock, health

app = FastAPI(title="MarketPulse")

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(ui.router)
app.include_router(stock.router)
app.include_router(health.router)