const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve HTML, CSS, JS files
app.use(express.static(__dirname));


// Your API routes
// app.use("/api/auth", authRoute);
// app.use("/api/transaction", transactionRoute);
// app.use("/api/report", reportRoute);
// app.use("/api/insight", insightRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});