const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoute = require("./auth");
const transactionRoute = require("./transaction");
const reportRoute = require("./report");
const insightRoute = require("./insightRoute");

const app = express();

app.use(cors());
app.use(express.json());

// Serve HTML, CSS and JS files
app.use(express.static(__dirname));

// API routes
app.use("/api/auth", authRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/report", reportRoute);
app.use("/api/insight", insightRoute);

// Home
app.get("/", (req, res) => {
    res.send("FlowFinance Server Running ✅");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});