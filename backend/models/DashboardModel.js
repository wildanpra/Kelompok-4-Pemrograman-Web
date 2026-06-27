// models/dashboardModel.js

const db = require('../config/database');

const getSummary = async () => {
  // Total masing-masing tabel
  const [[customers]] = await db.query('SELECT COUNT(*) AS total FROM customers');
  const [[leads]]     = await db.query('SELECT COUNT(*) AS total FROM leads');
  const [[deals]]     = await db.query('SELECT COUNT(*) AS total FROM deals');

  // Leads dikelompokkan per status
  const [leadsByStatus] = await db.query(
    `SELECT status, COUNT(*) AS total
     FROM   leads
     GROUP BY status`
  );

  // Deals dikelompokkan per stage
  const [dealsByStage] = await db.query(
    `SELECT stage, COUNT(*) AS total
     FROM   deals
     GROUP BY stage`
  );

  return {
    customers      : customers.total,
    leads          : leads.total,
    deals          : deals.total,
    leads_by_status: leadsByStatus,
    deals_by_stage : dealsByStage,
  };
};

const getSummaryForAssignedUser = async (userId) => {
  const [[customers]] = await db.query(
    `SELECT COUNT(DISTINCT c.id) AS total
     FROM customers c
     INNER JOIN leads l ON l.customer_id = c.id
     WHERE l.assigned_to = ?`,
    [userId]
  );
  const [[leads]] = await db.query(
    `SELECT COUNT(*) AS total FROM leads WHERE assigned_to = ?`,
    [userId]
  );
  const [[deals]] = await db.query(
    `SELECT COUNT(*) AS total
     FROM deals d
     INNER JOIN leads l ON l.id = d.lead_id
     WHERE l.assigned_to = ?`,
    [userId]
  );

  const [leadsByStatus] = await db.query(
    `SELECT status, COUNT(*) AS total
     FROM leads
     WHERE assigned_to = ?
     GROUP BY status`,
    [userId]
  );

  const [dealsByStage] = await db.query(
    `SELECT d.stage, COUNT(*) AS total
     FROM deals d
     INNER JOIN leads l ON l.id = d.lead_id
     WHERE l.assigned_to = ?
     GROUP BY d.stage`,
    [userId]
  );

  return {
    customers      : customers.total,
    leads          : leads.total,
    deals          : deals.total,
    leads_by_status: leadsByStatus,
    deals_by_stage : dealsByStage,
  };
};

module.exports = { getSummary, getSummaryForAssignedUser };
