const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// STATIC FRONTEND
// ==========================================

app.use(express.static(__dirname));

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
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ==========================================
// START SERVER - LOCAL ONLY
// ==========================================

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// ==========================================
// VERCEL
// ==========================================

module.exports = app;