//file models yang berguna untuk menerjemahkan isi table
const db = require("../config/database");

//menampilkan seluruh data table lead
const findAll = async () => {
  const [rows] = await db.query(
    `Select id, customer_id, title, source, notes, status, assigned_to, created_at FROM leads ORDER BY created_at DESC`,
  );
  return rows;
};

//menampilkan by id dari table customers
const findById = async (id) => {
  const [rows] = await db.query(`Select * FROM leads WHERE id = ?`, [id]);
  return rows[0] ?? null;
};

module.exports = { findAll, findById };
