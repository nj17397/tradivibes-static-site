from app.repositories.stock_repo import fetch_today_picks, fetch_history


def get_today_picks(db, limit):
    return fetch_today_picks(db, limit)


def get_stock_history(db, from_date, to_date):
    return fetch_history(db, from_date, to_date)