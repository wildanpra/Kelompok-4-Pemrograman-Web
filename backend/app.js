const express = require("express");
const router = require("./routes/api");
const db = require("./config/database");

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

app.listen(3000, () => {
    console.log("Server berjalan di port 3000");
});
