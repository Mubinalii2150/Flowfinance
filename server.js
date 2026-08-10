const express = require("express");
const cors = require("cors");

const authRoute = require("./auth");
const transactionRoute = require("./transaction");
const reportRoute = require("./report");
const insightRoute = require("./insightRoute");

const app = express();

// ==============================
// MIDDLEWARE
// ==============================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// API ROUTES
// ==============================

app.use("/api/auth", authRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/report", reportRoute);
app.use("/api/insight", insightRoute);

// ==============================
// HOME ROUTE
// ==============================

app.get("/", (req, res) => {
    res.send("FlowFinance Server Running ✅");
});

// ==============================
// START SERVER
// ==============================

const PORT = 5000;

app.listen(PORT, () => {
    console.log("=================================");
    console.log("FlowFinance Server Started");
    console.log(`Server: http://localhost:${PORT}`);
    console.log("=================================");
});