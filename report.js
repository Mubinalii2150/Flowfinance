const express = require("express");
const router = express.Router();
const db = require("./db");

// ==========================================
// Helper: build a date filter clause
// ==========================================

function getDateCondition(filter) {

    switch (filter) {

        case "today":
            return "AND DATE(Transaction_Date) = CURDATE()";

        case "week":
            return "AND YEARWEEK(Transaction_Date, 1) = YEARWEEK(CURDATE(), 1)";

        case "month":
            return "AND MONTH(Transaction_Date) = MONTH(CURDATE()) AND YEAR(Transaction_Date) = YEAR(CURDATE())";

        case "year":
            return "AND YEAR(Transaction_Date) = YEAR(CURDATE())";

        default:
            // no filter -> all-time
            return "";
    }
}

// ==========================================
// GET SUMMARY (Income / Expense totals)
// GET /api/report/:userId?filter=today|week|month|year
// ==========================================

router.get("/:userId", (req, res) => {

    const userId = req.params.userId;
    const filter = req.query.filter;
    const dateCondition = getDateCondition(filter);

    const sql = `
        SELECT
            COALESCE(SUM(CASE WHEN Type = 'Income' THEN Amount ELSE 0 END), 0) AS Income,
            COALESCE(SUM(CASE WHEN Type = 'Expense' THEN Amount ELSE 0 END), 0) AS Expense
        FROM transactions
        WHERE User_ID = ?
        ${dateCondition}
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.error("REPORT SUMMARY ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        res.json({
            success: true,
            data: result[0]
        });
    });
});

// ==========================================
// GET EXPENSE BY CATEGORY
// GET /api/report/category/:userId?filter=...
// ==========================================

router.get("/category/:userId", (req, res) => {

    const userId = req.params.userId;
    const filter = req.query.filter;
    const dateCondition = getDateCondition(filter);

    const sql = `
        SELECT
            Category,
            COALESCE(SUM(Amount), 0) AS Total
        FROM transactions
        WHERE User_ID = ?
          AND Type = 'Expense'
          ${dateCondition}
        GROUP BY Category
        ORDER BY Total DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.error("REPORT CATEGORY ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        res.json({
            success: true,
            data: result
        });
    });
});

// ==========================================
// GET TRANSACTIONS FOR REPORT PERIOD
// GET /api/report/transactions/:userId?filter=...
// ==========================================

router.get("/transactions/:userId", (req, res) => {

    const userId = req.params.userId;
    const filter = req.query.filter;
    const dateCondition = getDateCondition(filter);

    const sql = `
        SELECT
            Transaction_ID,
            Type,
            Category,
            Amount,
            Description,
            Transaction_Date
        FROM transactions
        WHERE User_ID = ?
        ${dateCondition}
        ORDER BY Transaction_Date DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.error("REPORT TRANSACTIONS ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        res.json({
            success: true,
            data: result
        });
    });
});

module.exports = router;