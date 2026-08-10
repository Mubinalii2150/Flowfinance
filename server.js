const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// STATIC FRONTEND
// ==========================================

const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));

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
// FRONTEND ROUTES
// ==========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(path.join(publicPath, "login.html"));
});

app.get("/register.html", (req, res) => {
    res.sendFile(path.join(publicPath, "register.html"));
});

app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(publicPath, "dashboard.html"));
});

app.get("/transactions.html", (req, res) => {
    res.sendFile(path.join(publicPath, "transactions.html"));
});

app.get("/reports.html", (req, res) => {
    res.sendFile(path.join(publicPath, "reports.html"));
});

app.get("/insights.html", (req, res) => {
    res.sendFile(path.join(publicPath, "insights.html"));
});

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