const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mubinali2150@",
    database: "flowfinance"
});

connection.connect((err) => {

    if (err) {
        console.log(err);
        return;
    }

    console.log("Database Connected");

});

module.exports = connection;