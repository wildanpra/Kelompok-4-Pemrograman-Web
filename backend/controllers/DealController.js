const DealModel = require("../models/DealModel");
const { validateId } = require("../validation/dealValidation");

const isAdmin = (user) => user?.role === 'admin';
const canAccessDeal = (user, deal) => {
  if (!deal) return false;
  if (isAdmin(user)) return true;
  return Number(deal.assigned_to) === Number(user?.id);
};

class DealController {
  async index(req, res) {
    try {
      const data = isAdmin(req.user)
        ? await DealModel.findAll()
        : await DealModel.findByAssignedUser(req.user.id);
      res.json({ success: true, total: data.length, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
  //menampilkan by id dari table deal
  async show(req, res) {
    try {
      const { id } = req.params;
      const error = validateId(id);
      if (error)
        return res.status(400).json({ success: false, message: error });

      const data = await DealModel.findById(id);
      if (!data)
        return res
          .status(404)
          .json({ success: false, message: "Deal tidak ditemukan" });

      if (!canAccessDeal(req.user, data)) {
        return res.status(403).json({ success: false, message: "Anda tidak memiliki akses ke deal ini" });
      }

      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
  async store(req, res) {
    try {
      if (!isAdmin(req.user)) {
        return res.status(403).json({ success: false, message: "Hanya admin yang dapat membuat deal manual" });
      }

      const { lead_id, title, value, stage, closed_at } = req.body;
      const dealId = await DealModel.store({ lead_id, title, value, stage, closed_at });
      res.status(201).json({
        success: true,
        message: "Deal berhasil ditambahkan",
        data: { id: dealId }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
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
const object = new DealController();

module.exports = object;
