//file models yang berguna untuk menerjemahkan isi table
const db = require("../config/database");

const ACTIVITY_SELECT = `SELECT a.id, a.customer_id, a.type, a.description, a.activity_date, a.created_by,
            c.name AS customer_name,
            u.name AS created_by_name
     FROM activities a
     LEFT JOIN customers c ON a.customer_id = c.id
     LEFT JOIN users u ON a.created_by = u.id`;

//menampilkan seluruh data table activities
const findAll = async () => {
  const [rows] = await db.query(
    `${ACTIVITY_SELECT}
     ORDER BY a.activity_date DESC`,
  );
  return rows;
};

const findByCreatedBy = async (userId) => {
  const [rows] = await db.query(
    `${ACTIVITY_SELECT}
     WHERE a.created_by = ?
     ORDER BY a.activity_date DESC`,
    [userId]
  );
  return rows;
};

const findByAssignedLeadUser = async (userId) => {
  const [rows] = await db.query(
    `${ACTIVITY_SELECT}
     INNER JOIN leads l ON l.customer_id = a.customer_id
     WHERE l.assigned_to = ?
     ORDER BY a.activity_date DESC`,
    [userId]
  );
  return rows;
};

//menampilkan by id dari table activities
const findById = async (id) => {
  const [rows] = await db.query(`${ACTIVITY_SELECT} WHERE a.id = ?`, [id]);
  return rows[0] ?? null;
};

const canAccessForAssignedLead = async (activityId, userId) => {
  const [rows] = await db.query(
    `SELECT 1
     FROM activities a
     INNER JOIN leads l ON l.customer_id = a.customer_id
     WHERE a.id = ? AND l.assigned_to = ?
     LIMIT 1`,
    [activityId, userId]
  );
  return rows.length > 0;
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

module.exports = { findAll, findByCreatedBy, findByAssignedLeadUser, findById, canAccessForAssignedLead, store, update, destroy };
