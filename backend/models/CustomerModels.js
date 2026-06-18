const db = require('../config/database');

const findAll = async () => {
    try{
        const query = "SELECT id, name, email, phone, company, status FROM customers ORDER BY created_at DESC";
        const [rows] = await db.query(query);
        return rows;
    }catch(error){
        throw error;
    }
}

const findById = async (id) => {
    try{
        const query = "SELECT * FROM customers WHERE id = ?";
        const [rows] = await db.query(query, [id]);
        return rows[0] ?? null;
    }catch(error){
        throw error;
    }
}

module.exports = {
    findAll,
    findById
}