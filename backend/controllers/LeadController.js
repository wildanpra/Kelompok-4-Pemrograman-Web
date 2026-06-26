const db = require("../config/database");
const LeadModel = require("../models/LeadModel");
const DealModel = require("../models/DealModel");
const { validateId, validateStore, validateUpdate } = require("../validation/leadValidation");
const ActivitiesModel = require("../models/ActivitiesModel");


const STAGE_MAP = {
  "new": null,
  "contacted": "Proposal",
  "qualified": "Negotiation",
  "won": "Won",
  "lost": "Lost"
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
          
          const dealStage = STAGE_MAP[(status || 'New').toLowerCase()];

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

          await ActivitiesModel.store({
              customer_id,
              type: 'other',
              description: `Sistem: Lead baru dibuat dengan judul "${title}"`,
              activity_date: new Date(),
              created_by: req.user?.id || null
          });

          await db.commit();

          res.status(201).json({
            success: true,
            message: "Lead berhasil ditambah dan deal otomatis bertambah",
            data: { 
              lead : {id: leadId, title, status: status || 'New'},
              deal : {id: dealId, stage: dealStage}
            },
          });
        } catch (err) {
          try {
              await db.rollback();
          } catch (rollbackErr) {
          }
          res.status(500).json({success: false, message: err.message});
    }
  }
  
  
  async update(req, res, next) {
    try {
      const {id} = req.params;
      const idError = validateId(id);
      if(idError){
        return res.status(400).json({success: false, message: idError});
      }
      
      const { customer_id, title, source, notes, status, assigned_to, deal_value } = req.body;
      const errors =  validateUpdate(customer_id, title, status);
      if(errors) return res.status(400).json({success:false, errors});
      
      const dealStage = STAGE_MAP[(status || 'New').toLowerCase()];

      await db.beginTransaction();

      const affected = await LeadModel.update(id, {
          customer_id,
          title,
          source,
          notes,
          status,
          assigned_to
      });
      if(!affected) {
        try {
            await db.rollback();
        } catch (rollbackErr) {
        }
        return res.status(404).json({success:false, message:'Lead tidak ditemukan'});
      }

      await DealModel.updateStageByLeadId(id, dealStage, deal_value ?? null);

      let activityType = 'other';
      let desc = `Sistem: Lead "${title}" diperbarui.`;

      if (status === 'Contacted') {
        activityType = 'call';
        desc = `Sales: Menghubungi prospek lead "${title}"`;
      } else if (status === 'Qualified') {
        activityType = 'meeting';
        desc = `Sistem: Lead "${title}" lolos kualifikasi & masuk tahap Negosiasi.`;
      } else if (status === 'Won') {
        activityType = 'other';
        desc = `Sistem: Proyek "${title}" BERHASIL (Won)! Kontrak disetujui.`;
      } else if (status === 'Lost') {
        activityType = 'note';
        desc = `Sistem: Proyek "${title}" dinyatakan GAGAL (Lost). Catatan: ${notes || '-'}`;
      }

      await ActivitiesModel.store({
          customer_id,
          type: activityType,
          description: desc,
          activity_date: new Date(),
          created_by: req.user?.id || null
      });
      
      await db.commit();

      res.json({
        success: true,
        message: "Lead diupdate, stage deal ikut berubah",
        data: {lead_status: status, deal_stage: dealStage, deal_value: deal_value ?? null}
      });
    } catch (err) {
        try {
            await db.rollback();
        } catch (rollbackErr) {
        }
        next(err);
    }
  }


  async destroy(req, res, next) {
    try {
      const { id } = req.params;

      const idError = validateId(id);
      if (idError) return res.status(400).json({ success: false, message: idError });

      await db.beginTransaction();

      await DealModel.removeByLeadId(id); // hapus deals dulu (FK constraint)
      const affected = await LeadModel.destroy(id);

      if (!affected) {
        try {
            await db.rollback();
        } catch (rollbackErr) {}
        return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });
      }

      await db.commit();

      res.json({ success: true, message: 'Lead dan deals terkait berhasil dihapus' });
    } catch (err) {
      try {
          await db.rollback();
      } catch (rollbackErr) {}
      next(err);
    }
  }
}
const object = new LeadController();

module.exports = object;
