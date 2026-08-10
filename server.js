const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoute = require("./auth");
const transactionRoute = require("./transaction");
const reportRoute = require("./report");
const insightRoute = require("./insightRoute");

const app = express();

// ==========================
// MIDDLEWARE
// ==========================

app.use(cors());
app.use(express.json());

// ==========================
// FRONTEND FILES
// ==========================

app.use(express.static(__dirname));

// ==========================
// API ROUTES
// ==========================

app.use("/api/auth", authRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/report", reportRoute);
app.use("/api/insight", insightRoute);

// ==========================
// HOME
// ==========================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ==========================
// SERVER
// ==========================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`FlowFinance Server Running on http://localhost:${PORT}`);
});