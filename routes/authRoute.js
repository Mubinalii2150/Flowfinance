const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../database/db");

const router = express.Router();

router.post("/register", async (req, res) => {
    const {
        Name,
        Email,
        Password,
        Phone,
        Business_Name,
        Business_Type
    } = req.body;

    if (!Name || !Email || !Password) {
        return res.status(400).json({
            success: false,
            message: "Name, Email and Password are required."
        });
    }

    const checkSql = "SELECT * FROM users WHERE Email = ?";

    db.query(checkSql, [Email], async (err, result) => {
        if (err) {
            console.error("REGISTER CHECK ERROR:", err);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length > 0) {
            return res.status(400).json({
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
                (err, result) => {
                    if (err) {
                        console.error("REGISTER INSERT ERROR:", err);
                        return res.status(500).json({
                            success: false,
                            message: "Registration Failed"
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: "User Registered Successfully",
                        userId: result.insertId
                    });
                }
            );

        } catch (error) {
            console.error("REGISTER ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Server Error"
            });
        }
    });
});

router.post("/login", (req, res) => {
    const { Email, Password } = req.body;

    console.log("LOGIN REQUEST:", Email);

    if (!Email || !Password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password are required."
        });
    }

    const sql = "SELECT * FROM users WHERE Email = ?";

    db.query(sql, [Email], async (err, result) => {
        if (err) {
            console.error("LOGIN MYSQL ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "User Not Found"
            });
        }

        const user = result[0];

        try {
            const match = await bcrypt.compare(
                Password,
                user.Password
            );

            if (!match) {
                return res.status(401).json({
                    success: false,
                    message: "Wrong Password"
                });
            }

            const token = jwt.sign(
                {
                    User_ID: user.User_ID,
                    Email: user.Email
                },
                process.env.JWT_SECRET || "flowfinance_secret",
                {
                    expiresIn: "1d"
                }
            );

            return res.json({
                success: true,
                message: "Login Successful",
                token: token,
                userId: user.User_ID
            });

        } catch (error) {
            console.error("LOGIN ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Login failed."
            });
        }
    });
});

module.exports = router;
