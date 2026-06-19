//file models yang berguna untuk menerjemahkan isi table
const db = require("../config/database");

//menampilkan seluruh data table customers
const findAll = async () => {
  const [rows] = await db.query(
    `Select id, customer_id, type, description, activity_date, created_by FROM activities ORDER BY created_by DESC`,
  );
  return rows;
};

//menampilkan by id dari table customers
const findById = async (id) => {
  const [rows] = await db.query(`Select * FROM activities WHERE id = ?`, [id]);
  return rows[0] ?? null;
};

module.exports = { findAll, findById };
