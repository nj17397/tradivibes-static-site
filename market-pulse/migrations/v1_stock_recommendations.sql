CREATE TABLE stock_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stock_name VARCHAR(100),
    ticker VARCHAR(50),
    expected_upside VARCHAR(20),
    summary TEXT,
    pros JSON,
    cons JSON,
    created_at DATE DEFAULT (CURRENT_DATE)
);

ALTER TABLE trading.stock_upside_analysis
ADD COLUMN call_price DECIMAL(10,2) AFTER ticker_symbol,
ADD COLUMN current_price DECIMAL(10,2) AFTER call_price;

ALTER TABLE trading.stock_upside_analysis
ADD COLUMN call_status VARCHAR(20) AFTER current_price;

ALTER TABLE trading.stock_upside_analysis
ADD COLUMN call_closed_at Date AFTER call_status;

ALTER TABLE trading.stock_upside_analysis
ADD COLUMN stop_loss DECIMAL(10,2) AFTER call_price;

ALTER TABLE trading.stock_upside_analysis
ADD COLUMN sell_price DECIMAL(10,2) AFTER call_price;