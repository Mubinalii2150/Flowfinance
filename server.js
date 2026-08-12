const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// Routes
const authRoute = require("./routes/authRoute");
const transactionRoute = require("./routes/transactionRoute");
const reportRoute = require("./routes/reportRoute");
const insightRoute = require("./routes/insightRoute");

console.log("authRoute:", authRoute);
console.log("transactionRoute:", transactionRoute);
console.log("reportRoute:", reportRoute);
console.log("insightRoute:", insightRoute);
 
console.log("AUTH:", typeof authRoute);
console.log("TRANSACTION:", typeof transactionRoute);
console.log("REPORT:", typeof reportRoute);
console.log("INSIGHT:", typeof insightRoute);

app.use("/api/auth", authRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/report", reportRoute);
app.use("/api/insight", insightRoute);

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "FlowFinance API is working"
    });
});

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
