const db = require ('../config/database');

// membuat fungsi untuk menampilkan data seluruh user tanpa membocorkan password/hash
const findAll = async () => {
    try{
        const query = "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC";
        const [rows] = await db.query(query);
        return rows;
    }catch(error){
        throw error;
    }
}

const findById = async (id) => {
    try{
        const query = "SELECT id, name, email, role, created_at FROM users WHERE id = ?";
        const [rows] = await db.query(query, [id]);
        return rows[0] ?? null;
    }catch(error){
        throw error;
    }
}

const findByEmail = async (email) => {
    try {
        const query = "SELECT id, name, email, role FROM users WHERE email = ?";
        const [rows] = await db.query(query, [email]);
        return rows[0] ?? null;
    } catch(error) {
        throw error;
    }
}

const store = async ({ name, email, password, role }) => {
    try {
        const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(query, [name, email, password, role ?? 'staff']);
        return result.insertId;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    findAll,
    findById,
    findByEmail,
    store
}