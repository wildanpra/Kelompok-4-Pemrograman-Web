//file models yang berguna untuk menerjemahkan isi table
const db = require("../config/database");

//menampilkan seluruh data table customers
const findAll = async () => {
  const [rows] = await db.query(
    `SELECT d.id, d.title, d.value, d.stage, d.closed_at, d.created_at,
            l.id      AS lead_id,
            l.title   AS lead_title,
            l.status  AS lead_status,
            c.id      AS customer_id,
            c.name    AS customer_name,
            c.company AS customer_company
     FROM   deals d
     LEFT JOIN leads     l ON d.lead_id = l.id
     LEFT JOIN customers c ON l.customer_id = c.id
     ORDER BY d.created_at DESC`,
  );
  return rows;
};

//menampilkan by id dari table customers
const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT d.id, d.title, d.value, d.stage, d.closed_at, d.created_at,
            l.id      AS lead_id,
            l.title   AS lead_title,
            l.status  AS lead_status,
            c.id      AS customer_id,
            c.name    AS customer_name,
            c.company AS customer_company
     FROM   deals d
     LEFT JOIN leads     l ON d.lead_id = l.id
     LEFT JOIN customers c ON l.customer_id = c.id
     WHERE  d.id = ?`,
    [id]
  );
  return rows[0] ?? null;
};

const createFormLead = async (leadId, title, stage) => {
  const [{insertId}] = await db.query(
    `INSERT INTO deals (lead_id, title, stage) VALUES (?, ?, ?)`,
    [leadId, title, stage ?? null]
  );
  return insertId;
};

const updateStageByLeadId = async (leadId, stage, value = null) =>{
  await db.query(
    `
    UPDATE deals SET stage=?, value=? WHERE lead_id =?
    `,
    [stage ?? null, value, leadId]
  );
};

const removeByLeadId = async (leadId) =>{
  await db.query(`DELETE FROM deals WHERE lead_id = ?`, [leadId])
};

const store = async ({ lead_id, title, value, stage, closed_at }) => {
  const [{insertId}] = await db.query(
    `INSERT INTO deals (lead_id, title, value, stage, closed_at) VALUES (?, ?, ?, ?, ?)`,
    [lead_id, title, value ?? null, stage ?? null, closed_at ?? null]
  );
  return insertId;
};

module.exports = { findAll, findById, createFormLead, updateStageByLeadId, removeByLeadId, store };
