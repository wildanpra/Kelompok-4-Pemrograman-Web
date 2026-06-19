require("dotenv").config();
const express = require("express");
const router = require("./routes/api");
const db = require("./config/database");
const errorHandler = require("./middleware/errorHandler");


const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Menggunakan router API
app.use(router);

app.get("/test-db", async (req, res) => {
    try {
        await db.query("SELECT 1");
        res.status(200).json({
            message: "Koneksi database berhasil!",
            status: "success"
        });
    } catch (error) {
        res.status(500).json({
            message: "Koneksi database gagal!",
            error: error.message,
            status: "error"
        });
    }
});

//Middleware Error
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
