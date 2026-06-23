const activitiesModel = require("../models/ActivitiesModel");
const { validateId, validateStore, validateUpdate } = require("../validation/activitiesValidation");

class ActivitiesController {
  async index(req, res) {
    try {
      const data = await activitiesModel.findAll();
      res.json({ success: true, total: data.length, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  //menampilkan by id dari table customers
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
