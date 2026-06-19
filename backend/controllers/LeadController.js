const LeadModel = require("../models/LeadModel");
const { validateId } = require("../validation/leadValidation");
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
  store(req, res) {
    res.send("Menambahkan data");
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
