//file models yang berguna untuk menerjemahkan isi table
const db = require("../config/database");

//menampilkan seluruh data table customers
const findAll = async () => {
  const [rows] = await db.query(
    `SELECT co.id, co.customer_id, co.name, co.email, co.phone, co.position, co.created_at,
            cu.name AS customer_name
     FROM contacts co
     LEFT JOIN customers cu ON co.customer_id = cu.id
     ORDER BY co.created_at DESC`,
  );
  return rows;
};

//menampilkan by id dari table customers
const findById = async (id) => {
  const [rows] = await db.query(`Select * FROM contacts WHERE id = ?`, [id]);
  return rows[0] ?? null;
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
  findById,
  store,
  update,
  destroy
};
 