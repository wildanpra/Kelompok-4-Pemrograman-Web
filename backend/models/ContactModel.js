//file models yang berguna untuk menerjemahkan isi table
const db = require("../config/database");

const CONTACT_SELECT = `SELECT co.id, co.customer_id, co.name, co.email, co.phone, co.position, co.created_at,
            cu.name AS customer_name
     FROM contacts co
     LEFT JOIN customers cu ON co.customer_id = cu.id`;

//menampilkan seluruh data table contacts
const findAll = async () => {
  const [rows] = await db.query(
    `${CONTACT_SELECT}
     ORDER BY co.created_at DESC`,
  );
  return rows;
};

const findByAssignedLeadUser = async (userId) => {
  const [rows] = await db.query(
    `${CONTACT_SELECT}
     INNER JOIN leads l ON l.customer_id = co.customer_id
     WHERE l.assigned_to = ?
     ORDER BY co.created_at DESC`,
    [userId]
  );
  return rows;
};

//menampilkan by id dari table contacts
const findById = async (id) => {
  const [rows] = await db.query(`${CONTACT_SELECT} WHERE co.id = ?`, [id]);
  return rows[0] ?? null;
};

const canAccessForAssignedLead = async (contactId, userId) => {
  const [rows] = await db.query(
    `SELECT 1
     FROM contacts co
     INNER JOIN leads l ON l.customer_id = co.customer_id
     WHERE co.id = ? AND l.assigned_to = ?
     LIMIT 1`,
    [contactId, userId]
  );
  return rows.length > 0;
};

//memasukkan create
const store = async ({customer_id, name, email, phone, position}) => {
  const query =
    `INSERT INTO contacts (customer_id, name, email, phone, position) 
    VALUES (?, ?, ?, ?, ?)`;
  const [result] = await db.query(query, [
    customer_id,
    name,
    email ?? null,
    phone ?? null,
    position ?? null
  ]);
      return result.insertId;
};

const update = async (id, {customer_id, name, email, phone, position}) =>{
  const [{affectedRows}] = await db.query(`
          UPDATE contacts 
          SET customer_id = ?,
              name = ?,
              email = ?,
              phone = ?,
              position = ?
          WHERE id = ?
      `,
      [customer_id, name, email ?? null, phone ?? null, position ?? null, id]
      );
      return affectedRows;
};

const destroy = async (id) =>{
  const [{affectedRows}] = await db.query(`
          DELETE FROM contacts WHERE id = ?
      `,
      [id]
      );
      return affectedRows;
};

module.exports = {
  findAll,
  findByAssignedLeadUser,
  findById,
  canAccessForAssignedLead,
  store,
  update,
  destroy
};
 