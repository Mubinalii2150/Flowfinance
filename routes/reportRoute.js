const express = require("express");
const router = express.Router();

const db = require("../database/db");

// ======================================================
// REPORT SUMMARY
// GET /api/report/:userId?filter=today|week|month|year
// ======================================================

router.get("/:userId", (req, res) => {

    const userId = req.params.userId;
    const filter = req.query.filter || "month";

    let dateCondition = "";
    let params = [userId];

    // --------------------------------------------------
    // FILTER
    // --------------------------------------------------

    switch (filter) {

        case "today":

            dateCondition = `
                AND DATE(Transaction_Date) = CURDATE()
            `;

            break;


        case "week":

            dateCondition = `
                AND YEARWEEK(Transaction_Date, 1)
                    = YEARWEEK(CURDATE(), 1)
            `;

            break;


        case "month":

            dateCondition = `
                AND YEAR(Transaction_Date) = YEAR(CURDATE())
                AND MONTH(Transaction_Date) = MONTH(CURDATE())
            `;

            break;


        case "year":

            dateCondition = `
                AND YEAR(Transaction_Date) = YEAR(CURDATE())
            `;

            break;


        default:

            return res.status(400).json({
                success: false,
                message: "Invalid filter"
            });

    }


    // ==================================================
    // SUMMARY QUERY
    // ==================================================

    const summarySQL = `
        SELECT

            COALESCE(
                SUM(
                    CASE
                        WHEN Type = 'Income'
                        THEN Amount
                        ELSE 0
                    END
                ),
                0
            ) AS totalIncome,

            COALESCE(
                SUM(
                    CASE
                        WHEN Type = 'Expense'
                        THEN Amount
                        ELSE 0
                    END
                ),
                0
            ) AS totalExpense

        FROM transactions

        WHERE User_ID = ?
        ${dateCondition}
    `;


    db.query(summarySQL, params, (err, summaryResult) => {

        if (err) {

            console.error("Report summary error:", err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });

        }


        const totalIncome =
            Number(summaryResult[0].totalIncome || 0);

        const totalExpense =
            Number(summaryResult[0].totalExpense || 0);

        const balance =
            totalIncome - totalExpense;


        // ==================================================
        // TRANSACTIONS
        // ==================================================

        const transactionSQL = `
            SELECT
                Type,
                Category,
                Amount,
                Transaction_Date

            FROM transactions

            WHERE User_ID = ?
            ${dateCondition}

            ORDER BY Transaction_Date DESC, Transaction_ID DESC
        `;


        db.query(transactionSQL, params, (err, transactions) => {

            if (err) {

                console.error("Report transactions error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }


            // ==================================================
            // RESPONSE
            // ==================================================

            res.json({

                success: true,

                data: {

                    totalIncome: totalIncome,

                    totalExpense: totalExpense,

                    balance: balance,

                    transactions: transactions

                }

            });

        });

    });

});


// ======================================================
// CATEGORY REPORT
// GET /api/report/category/:userId?filter=...
// ======================================================

router.get("/category/:userId", (req, res) => {

    const userId = req.params.userId;
    const filter = req.query.filter || "month";

    let dateCondition = "";

    switch (filter) {

        case "today":

            dateCondition = `
                AND DATE(Transaction_Date) = CURDATE()
            `;

            break;


        case "week":

            dateCondition = `
                AND YEARWEEK(Transaction_Date, 1)
                    = YEARWEEK(CURDATE(), 1)
            `;

            break;


        case "month":

            dateCondition = `
                AND YEAR(Transaction_Date) = YEAR(CURDATE())
                AND MONTH(Transaction_Date) = MONTH(CURDATE())
            `;

            break;


        case "year":

            dateCondition = `
                AND YEAR(Transaction_Date) = YEAR(CURDATE())
            `;

            break;


        default:

            return res.status(400).json({
                success: false,
                message: "Invalid filter"
            });

    }


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

            console.error("Category report error:", err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });

        }


        res.json({

            success: true,

            data: result

        });

    });

});


module.exports = router;
