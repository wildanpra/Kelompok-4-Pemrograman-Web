const activitiesModel = require("../models/ActivitiesModel");
const CustomerModels = require("../models/CustomerModels");
const { validateId, validateStore, validateUpdate } = require("../validation/activitiesValidation");

const isAdmin = (user) => user?.role === 'admin';
const isStaff = (user) => user?.role === 'staff';
const isSales = (user) => user?.role === 'sales';

class ActivitiesController {
  async index(req, res) {
    try {
      const data = isSales(req.user)
        ? await activitiesModel.findByAssignedLeadUser(req.user.id)
        : await activitiesModel.findAll();
      res.json({ success: true, total: data.length, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  //menampilkan by id dari table activities
  async show(req, res) {
    try {
      const { id } = req.params;
      const error = validateId(id);
      if (error)
        return res.status(400).json({ success: false, message: error });

      const data = await activitiesModel.findById(id);
      if (!data)
        return res
          .status(404)
          .json({ success: false, message: "Activity tidak ditemukan" });

      if (isSales(req.user) && !(await activitiesModel.canAccessForAssignedLead(id, req.user.id))) {
        return res.status(403).json({ success: false, message: "Anda tidak memiliki akses ke activity ini" });
      }

      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async store(req, res, next) {
    try {
      const { customer_id, type, description, activity_date } = req.body;
      const errors = validateStore(customer_id, type, activity_date);
      if (errors) return res.status(400).json({ success: false, errors });

      if (isSales(req.user) && !(await CustomerModels.hasAssignedLead(customer_id, req.user.id))) {
        return res.status(403).json({ success: false, message: "Sales hanya dapat menambah activity untuk customer dari lead miliknya" });
      }

      const activityId = await activitiesModel.store({
        customer_id,
        type,
        description,
        activity_date,
        created_by: req.user?.id
      });

      res.status(201).json({
        success: true,
        message: "Activity berhasil ditambahkan",
        data: { id: activityId, customer_id, type, description, activity_date }
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const idError = validateId(id);
      if (idError) return res.status(400).json({ success: false, message: idError });

      const { customer_id, type, description, activity_date } = req.body;
      const errors = validateUpdate(customer_id, type, activity_date);
      if (errors) return res.status(400).json({ success: false, errors });

      const existing = await activitiesModel.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Activity tidak ditemukan" });
      }

      if (isSales(req.user)) {
        const canAccessExisting = await activitiesModel.canAccessForAssignedLead(id, req.user.id);
        const canAccessTargetCustomer = await CustomerModels.hasAssignedLead(customer_id, req.user.id);
        if (!canAccessExisting || !canAccessTargetCustomer) {
          return res.status(403).json({ success: false, message: "Anda tidak memiliki akses untuk mengubah activity ini" });
        }
      }

      await activitiesModel.update(id, {
        customer_id,
        type,
        description,
        activity_date
      });

      res.json({
        success: true,
        message: "Activity berhasil diupdate"
      });
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      if (!isAdmin(req.user)) {
        return res.status(403).json({ success: false, message: "Hanya admin yang dapat menghapus activity" });
      }

      const { id } = req.params;
      const idError = validateId(id);
      if (idError) return res.status(400).json({ success: false, message: idError });

      const existing = await activitiesModel.findById(id);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Activity tidak ditemukan" });
      }

      await activitiesModel.destroy(id);

      res.json({
        success: true,
        message: "Activity berhasil dihapus"
      });
    } catch (err) {
      next(err);
    }
  }
}

const object = new ActivitiesController();
module.exports = object;
