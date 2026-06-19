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

//menambahkan data customers
const store = async({name, email, phone, company, status, created_by}) =>{ // parameter sesuaikan dengan kolom yang ada di table
    const [{insertId}] = await db.query(
    `INSERT INTO customers (name, email, phone, company, status, created_by )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, email ?? null, phone ?? null, company ?? null, status ?? null, created_by ?? null]
    );
    return insertId;
}

const update = async (id, {name, email, phone, company, status}) => {
    const [{affectedRows}] = await db.query(`
        UPDATE customers 
        SET name = ?,
            email = ?,
            phone = ?,
            company = ?,
            status = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `,
    [name ?? null, email ?? null, phone ?? null, company ?? null, status ?? null, id]
    );
    return affectedRows;
}

const destroy = async (id) => {
    const [{affectedRows}] = await db.query(`
        DELETE FROM customers WHERE id = ?
    `,
    [id]
    );
    return affectedRows;
}

module.exports = {
    findAll,
    findById,
    store,
    update,
    destroy
}