const express = require("express");
const router = express.Router();
const db = require("./db");

// ==========================================
// GET AI INSIGHT DATA
// GET /api/insight/:userId
// ==========================================

router.get("/:userId", (req, res) => {

    const userId = req.params.userId;

    console.log("GET insight for:", userId);

    const sql = `
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
            ) AS Income,

            COALESCE(
                SUM(
                    CASE
                        WHEN Type = 'Expense'
                        THEN Amount
                        ELSE 0
                    END
                ),
                0
            ) AS Expense

        FROM transactions

        WHERE User_ID = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {

            console.error(
                "INSIGHT MYSQL ERROR:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        console.log(
            "Insight data:",
            result[0]
        );

        return res.json({
            success: true,
            data: result[0]
        });

    });

});

module.exports = router;