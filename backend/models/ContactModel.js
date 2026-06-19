//file models yang berguna untuk menerjemahkan isi table
const db = require("../config/database");

//menampilkan seluruh data table customers
const findAll = async () => {
  const [rows] = await db.query(
    `Select id, customer_id, name, email, phone, position, created_at FROM contacts ORDER BY created_at DESC`,
  );
  return rows;
};

//menampilkan by id dari table customers
const findById = async (id) => {
  const [rows] = await db.query(`Select * FROM contacts WHERE id = ?`, [id]);
  return rows[0] ?? null;
};

module.exports = { findAll, findById };
