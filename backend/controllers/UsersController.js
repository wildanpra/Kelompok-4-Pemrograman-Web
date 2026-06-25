const UsersModels = require("../models/UsersModel");
const { validateId } = require("../validation/UsersValidation");

class UsersController {
  async index(req, res) {
    try {
      const users = await UsersModels.findAll();
      res.json({
        message: "Data User berhasil diambil",
        status: "success",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Data User gagal diambil",
        status: "error",
        error: error.message,
      });
    }
  }
  async show(req, res) {
    try {
      const { id } = req.params;
      const validation = validateId(id);
      if (validation) {
        return res.status(400).json({
          message: validation,
          status: "error",
        });
      }
      const users = await UsersModels.findById(id);
      if (!users) {
        return res.status(404).json({
          message: "Data User tidak ditemukan",
          status: "error",
        });
      }
      res.json({
        message: "Data User berhasil diambil",
        status: "success",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Data User gagal diambil",
        status: "error",
        error: error.message,
      });
    }
  }

  async store(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const userId = await UsersModels.store({ name, email, password, role });
      res.status(201).json({
        status: "success",
        message: "User berhasil ditambahkan",
        data: { id: userId, name, email, role }
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal menambahkan user",
        error: error.message
      });
    }
  }
}

module.exports = new UsersController();
