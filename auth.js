const express = require("express");
const router = express.Router();

const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// =======================
// Register Route
// =======================

router.post("/register", async (req, res) => {

    const {
        Name,
        Email,
        Password,
        Phone,
        Business_Name,
        Business_Type
    } = req.body;

    const checkSql = "SELECT * FROM users WHERE Email = ?";

    db.query(checkSql, [Email], async (err, result) => {

        if (err) {
            return res.json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length > 0) {
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }

        try {

            const hashPassword = await bcrypt.hash(Password, 10);

            const sql = `
                INSERT INTO users
                (Name, Email, Phone, Password, Business_Name, Business_Type)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [
                    Name,
                    Email,
                    Phone,
                    hashPassword,
                    Business_Name,
                    Business_Type
                ],
                (err) => {

                    if (err) {
                        console.log(err);

                        return res.json({
                            success: false,
                            message: "Registration Failed"
                        });
                    }

                    res.json({
                        success: true,
                        message: "User Registered Successfully"
                    });

                }
            );

        } catch (error) {

            console.log(error);

            res.json({
                success: false,
                message: "Server Error"
            });

        }

    });

});

// =======================
// Login Route
// =======================

router.post("/login", (req, res) => {

    const { Email, Password } = req.body;

    const sql = "SELECT * FROM users WHERE Email=?";

    db.query(sql, [Email], async (err, result) => {

        if (err) {
            return res.json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.json({
                success: false,
                message: "User Not Found"
            });
        }

        const user = result[0];

        const match = await bcrypt.compare(
            Password,
            user.Password
        );

        if (!match) {
            return res.json({
                success: false,
                message: "Wrong Password"
            });
        }

        const token = jwt.sign(
            {
                User_ID: user.User_ID,
                Email: user.Email
            },
            "flowfinance_secret",
            {
                expiresIn: "1d"
            }
        );

        res.json({
            success: true,
            message: "Login Successful",
            token,
            userId: user.User_ID
        });

    });

});

module.exports = router;