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

const findAssignedToUser = async (userId) => {
    const [rows] = await db.query(`
        SELECT DISTINCT c.id, c.name, c.email, c.phone, c.company, c.status
        FROM customers c
        INNER JOIN leads l ON l.customer_id = c.id
        WHERE l.assigned_to = ?
        ORDER BY c.id DESC
    `, [userId]);
    return rows;
}

const hasAssignedLead = async (customerId, userId) => {
    const [rows] = await db.query(
        `SELECT 1 FROM leads WHERE customer_id = ? AND assigned_to = ? LIMIT 1`,
        [customerId, userId]
    );
    return rows.length > 0;
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
const store = async({name, email, phone, company, status, created_by}) =>{
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
            status = ?
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
    findAssignedToUser,
    hasAssignedLead,
    findById,
    store,
    update,
    destroy
}