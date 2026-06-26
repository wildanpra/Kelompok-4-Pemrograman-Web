//file models yang berguna untuk menerjemahkan isi table
const db = require("../config/database");

//menampilkan seluruh data table lead
const findAll = async () => {
  const [rows] = await db.query(
    `SELECT l.id, l.customer_id, l.title, l.source, l.notes, l.status, l.assigned_to, l.created_at,
            c.name AS customer_name,
            u.name AS assigned_to_name,
            d.id AS deal_id,
            d.stage AS deal_stage,
            d.value AS deal_value
     FROM leads l
     LEFT JOIN customers c ON l.customer_id = c.id
     LEFT JOIN users u ON l.assigned_to = u.id
     LEFT JOIN deals d ON l.id = d.lead_id
     ORDER BY l.created_at DESC`,
  );
  return rows;
};

//menampilkan by id dari table customers
const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT l.id, l.title, l.source, l.notes, l.status, l.assigned_to, l.created_at,
            c.id      AS customer_id,
            c.name    AS customer_name,
            c.company AS customer_company,
            d.id      AS deal_id,
            d.stage   AS deal_stage,
            d.value   AS deal_value
     FROM   leads l
     LEFT JOIN customers c ON l.customer_id = c.id
     LEFT JOIN deals     d ON l.id = d.lead_id
     WHERE  l.id = ?`,
    [id]
  );
  return rows[0] ?? null;
};

const store = async ({customer_id, title, source, notes, status, assigned_to}) => {
    const query = `
    INSERT INTO leads (customer_id, title, source, notes, status, assigned_to)
    VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
        customer_id,
        title,
        source ?? null,
        notes ?? null,
        status ?? 'New',
        assigned_to ?? null,
    ]);
    return result.insertId;
};

const update = async (id, {customer_id, title, source, notes, status, assigned_to}) => {
  const [{affectedRows}] = await db.query(`
  UPDATE leads
  SET customer_id = ?, title = ?, source = ?, notes = ?, status = ?, assigned_to = ?
  WHERE id = ?`,
  [
        customer_id,
        title,
        source ?? null,
        notes ?? null,
        status ?? 'New',
        assigned_to ?? null,
        id,
    ]);
return affectedRows;
};

const destroy = async(id) =>{
  const [{affectedRows}] = await db.query(`
    DELETE FROM leads
    WHERE id = ?
  `,
  [id]
);
return affectedRows;
};

module.exports = { findAll, findById, store, update, destroy };
