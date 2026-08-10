const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// FRONTEND FILES
// ==========================================

app.use(express.static(path.join(__dirname)));

// Explicit HTML routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/register.html", (req, res) => {
    res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.get("/transactions.html", (req, res) => {
    res.sendFile(path.join(__dirname, "transactions.html"));
});

app.get("/reports.html", (req, res) => {
    res.sendFile(path.join(__dirname, "reports.html"));
});

app.get("/insights.html", (req, res) => {
    res.sendFile(path.join(__dirname, "insights.html"));
});

// ==========================================
// API ROUTES
// ==========================================

const authRoute = require("./auth");
const transactionRoute = require("./transaction");
const reportRoute = require("./report");
const insightRoute = require("./insightRoute");

app.use("/api/auth", authRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/report", reportRoute);
app.use("/api/insight", insightRoute);

// ==========================================
// LOCAL SERVER
// ==========================================

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;