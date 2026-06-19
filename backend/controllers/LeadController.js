const db = require("../config/database");
const LeadModel = require("../models/LeadModel");
const DealModel = require("../models/DealModel");
const { validateId, validateStore, validateUpdate } = require("../validation/leadValidation");


const STAGE_MAP = {
  "new": null,
  "contacted": "contacted",
  "qualified": "qualified",
  "lost": "lost"
}

class LeadController {
  async index(req, res) {
    try {
      const data = await LeadModel.findAll();
      res.json({ success: true, total: data.length, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
  //menampilkan by id dari table lead
  async show(req, res) {
    try {
      const { id } = req.params;
      const error = validateId(id);
      if (error)
        return res.status(400).json({ success: false, message: error });

      const data = await LeadModel.findById(id);
      if (!data)
        return res
          .status(404)
          .json({ success: false, message: "Lead tidak ditemukan" });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
  async store(req, res) {
    // res.send("Menambahkan data");
    try {
          const { customer_id, title, source, notes, status, assigned_to } = req.body;
          const errors = validateStore(customer_id, title, status);
          if(errors) return res.status(400).json({success:false, errors});
          
          const dealStage = STAGE_MAP[(status || 'new').toLowerCase()];

          await db.beginTransaction();

          const leadId = await LeadModel.store({
              customer_id,
              title,
              source,
              notes,
              status,
              assigned_to
          });
          const dealId = await DealModel.createFormLead(leadId, title, dealStage);

          await db.commit();

          res.status(201).json({
            success: true,
            message: "Lead berhasil ditambah dan deal otomatis bertambah",
            data: { 
              lead : {id: leadId, title, status: status || 'new'},
              deal : {id: dealId, stage: dealStage}
            },
          });
        } catch (err) {
          try {
              await db.rollback();
          } catch (rollbackErr) {
              // ignore rollback error
          }
          res.status(500).json({success: false, message: err.message});
    }
  }
  update(req, res) {
    const { id } = req.params;
    res.send(`Mengupdate data id ${id}`);
  }
  delete(req, res) {
    const { id } = req.params;
    res.send(`Menghapus data id ${id}`);
  }
}
const object = new LeadController();

module.exports = object;
