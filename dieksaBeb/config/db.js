const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crm_latihan"
});

db.connect((err) => {
    if (err) {
        console.log("error connect database", err);
    } else {
        console.log ("connected");
    }
});

module.exports = db.promise();