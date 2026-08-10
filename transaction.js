const express = require("express");
const router = express.Router();
const db = require("./db");

// ==========================================
// GET USER TRANSACTIONS
// GET /api/transaction/:userId
// ==========================================

router.get("/:userId", (req, res) => {

    const userId = req.params.userId;

    console.log("GET transactions for:", userId);

    const sql = `
        SELECT
            Transaction_ID,
            User_ID,
            Type,
            Category,
            Amount,
            Description,
            Transaction_Date
        FROM transactions
        WHERE User_ID = ?
        ORDER BY Transaction_Date DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {

            console.error("GET MYSQL ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        console.log("Transactions found:", result.length);

        return res.json({
            success: true,
            data: result
        });
    });
});


// ==========================================
// ADD TRANSACTION
// POST /api/transaction
// ==========================================

router.post("/", (req, res) => {

    console.log("POST BODY:", req.body);

    const {
        User_ID,
        Type,
        Category,
        Amount,
        Description,
        Transaction_Date
    } = req.body;


    // ======================================
    // VALIDATION
    // ======================================

    if (
        !User_ID ||
        !Type ||
        !Category ||
        Amount === undefined ||
        Amount === "" ||
        !Transaction_Date
    ) {

        return res.status(400).json({
            success: false,
            message: "Please fill all required fields."
        });
    }


    const amount = Number(Amount);


    if (!Number.isFinite(amount) || amount <= 0) {

        return res.status(400).json({
            success: false,
            message: "Amount must be greater than 0."
        });
    }


    // ======================================
    // INSERT QUERY
    // ======================================

    const sql = `
        INSERT INTO transactions
        (
            User_ID,
            Type,
            Category,
            Amount,
            Description,
            Transaction_Date
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            Number(User_ID),
            Type,
            Category,
            amount,
            Description || "",
            Transaction_Date
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "INSERT MYSQL ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Transaction could not be added.",
                    error: err.message
                });
            }


            console.log(
                "INSERT SUCCESS:",
                result.insertId
            );


            return res.status(201).json({
                success: true,
                message: "Transaction added successfully.",
                id: result.insertId
            });

        }
    );
});


// ==========================================
// DELETE TRANSACTION
// DELETE /api/transaction/:id
// ==========================================

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    console.log("DELETE transaction:", id);


    const sql = `
        DELETE FROM transactions
        WHERE Transaction_ID = ?
    `;


    db.query(sql, [id], (err, result) => {

        if (err) {

            console.error(
                "DELETE ERROR:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Delete failed.",
                error: err.message
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Transaction not found."
            });
        }


        console.log(
            "DELETE SUCCESS:",
            id
        );


        return res.json({
            success: true,
            message: "Transaction deleted successfully."
        });

    });
});


module.exports = router;