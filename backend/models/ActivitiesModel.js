//file models yang berguna untuk menerjemahkan isi table
const db = require("../config/database");

//menampilkan seluruh data table customers
const findAll = async () => {
  const [rows] = await db.query(
    `SELECT a.id, a.customer_id, a.type, a.description, a.activity_date, a.created_by,
            c.name AS customer_name,
            u.name AS created_by_name
     FROM activities a
     LEFT JOIN customers c ON a.customer_id = c.id
     LEFT JOIN users u ON a.created_by = u.id
     ORDER BY a.activity_date DESC`,
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
