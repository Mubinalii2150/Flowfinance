const express = require("express");
const router = express.Router();
const db = require("./db");

// =======================================
// Report Summary
// =======================================

router.get("/:userId", (req, res) => {

    const userId = req.params.userId;
    const filter = req.query.filter || "month";

    let condition = "";

    switch (filter) {

        case "today":
            condition = "AND DATE(Transaction_Date)=CURDATE()";
            break;

        case "week":
            condition = "AND YEARWEEK(Transaction_Date,1)=YEARWEEK(CURDATE(),1)";
            break;

        case "month":
            condition = `
                AND MONTH(Transaction_Date)=MONTH(CURDATE())
                AND YEAR(Transaction_Date)=YEAR(CURDATE())
            `;
            break;

        case "year":
            condition = `
                AND YEAR(Transaction_Date)=YEAR(CURDATE())
            `;
            break;

        default:
            condition = "";
    }

    const sql = `
        SELECT

        SUM(
            CASE
            WHEN Type='Income'
            THEN Amount
            ELSE 0
            END
        ) AS Income,

        SUM(
            CASE
            WHEN Type='Expense'
            THEN Amount
            ELSE 0
            END
        ) AS Expense

        FROM transactions

        WHERE User_ID=?

        ${condition}
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {

            console.log(err);

            return res.json({

                success: false

            });

        }

        res.json({

            success: true,

            data: result[0]

        });

    });

});


// =======================================
// Category Report
// =======================================

router.get("/category/:userId", (req, res) => {

    const userId = req.params.userId;

    const filter = req.query.filter || "month";

    let condition = "";

    switch (filter) {

        case "today":
            condition = "AND DATE(Transaction_Date)=CURDATE()";
            break;

        case "week":
            condition = "AND YEARWEEK(Transaction_Date,1)=YEARWEEK(CURDATE(),1)";
            break;

        case "month":
            condition = `
                AND MONTH(Transaction_Date)=MONTH(CURDATE())
                AND YEAR(Transaction_Date)=YEAR(CURDATE())
            `;
            break;

        case "year":
            condition = `
                AND YEAR(Transaction_Date)=YEAR(CURDATE())
            `;
            break;

        default:
            condition = "";
    }

    const sql = `

        SELECT

        Category,

        SUM(Amount) AS Total

        FROM transactions

        WHERE

        User_ID=?

        AND Type='Expense'

        ${condition}

        GROUP BY Category

    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {

            console.log(err);

            return res.json({

                success: false

            });

        }

        res.json({

            success: true,

            data: result

        });

    });

});


// =======================================
// PDF Report Data
// =======================================

router.get("/transactions/:userId", (req, res) => {

    const userId = req.params.userId;

    const filter = req.query.filter || "month";

    let condition = "";

    switch (filter) {

        case "today":
            condition = "AND DATE(Transaction_Date)=CURDATE()";
            break;

        case "week":
            condition = "AND YEARWEEK(Transaction_Date,1)=YEARWEEK(CURDATE(),1)";
            break;

        case "month":
            condition = `
                AND MONTH(Transaction_Date)=MONTH(CURDATE())
                AND YEAR(Transaction_Date)=YEAR(CURDATE())
            `;
            break;

        case "year":
            condition = `
                AND YEAR(Transaction_Date)=YEAR(CURDATE())
            `;
            break;

        default:
            condition = "";
    }

    const sql = `

        SELECT *

        FROM transactions

        WHERE User_ID=?

        ${condition}

        ORDER BY Transaction_Date DESC

    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {

            console.log(err);

            return res.json({

                success: false

            });

        }

        res.json({

            success: true,

            data: result

        });

    });

});

module.exports = router;