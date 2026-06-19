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

const store = async ({customer_id, type, description, activity_date, created_by}) => {
  const query = `
    INSERT INTO activities (customer_id, type, description, activity_date, created_by)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [
    customer_id,
    type,
    description ?? null,
    activity_date,
    created_by ?? null
  ]);
  return result.insertId;
};

const update = async (id, {customer_id, type, description, activity_date}) => {
  const query = `
    UPDATE activities
    SET customer_id = ?, type = ?, description = ?, activity_date = ?
    WHERE id = ?
  `;
  const [{affectedRows}] = await db.query(query, [
    customer_id,
    type,
    description ?? null,
    activity_date,
    id
  ]);
  return affectedRows;
};

const destroy = async (id) => {
  const [{affectedRows}] = await db.query(
    `DELETE FROM activities WHERE id = ?`,
    [id]
  );
  return affectedRows;
};

module.exports = { findAll, findById, store, update, destroy };
