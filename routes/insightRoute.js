const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/:userId", (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT Type, Category, Amount, Transaction_Date
        FROM transactions
        WHERE User_ID = ?
        ORDER BY Transaction_Date DESC
    `;

    db.query(sql, [userId], (err, rows) => {
        if (err) {
            console.error("INSIGHT ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        let income = 0;
        let expense = 0;

        rows.forEach(row => {
            const amount = Number(row.Amount);

            if (row.Type.toLowerCase() === "income") {
                income += amount;
            }

            if (row.Type.toLowerCase() === "expense") {
                expense += amount;
            }
        });

        const balance = income - expense;

        const insights = [];

        if (expense > income) {
            insights.push({
                type: "warning",
                title: "High Spending",
                message: "Your expenses are higher than your income."
            });
        } else {
            insights.push({
                type: "positive",
                title: "Good Financial Position",
                message: "Your income is currently higher than your expenses."
            });
        }

        if (income > 0) {
            const percentage = (expense / income) * 100;

            insights.push({
                type: "info",
                title: "Expense Ratio",
                message: `You are spending ${percentage.toFixed(1)}% of your income.`
            });
        }

        res.json({
            success: true,
            data: {
                income,
                expense,
                balance,
                insights
            }
        });
    });
});

module.exports = router;
