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