CREATE TABLE flowfinance.transactions (
    Transaction_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Type ENUM('Income', 'Expense') NOT NULL,
    Category VARCHAR(100) NOT NULL,
    Amount DECIMAL(12,2) NOT NULL,
    Description VARCHAR(255),
    Transaction_Date DATETIME NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transactions_user
        FOREIGN KEY (User_ID)
        REFERENCES flowfinance.users(User_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);