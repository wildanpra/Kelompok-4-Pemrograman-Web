const bcrypt = require("bcryptjs");
const UsersModels = require("../models/UsersModel");
const { validateId } = require("../validation/UsersValidation");

const ALLOWED_ROLES = ["admin", "staff", "sales"];

const sanitizeUserPayload = ({ name, email, role }) => ({ name, email, role });

const validateUserStore = ({ name, email, password, role }) => {
  if (!name || !String(name).trim()) return "Nama wajib diisi";
  if (!email || !String(email).trim()) return "Email wajib diisi";
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Format email tidak valid";
  if (!password || String(password).length < 8) return "Password minimal 8 karakter";
  if (role && !ALLOWED_ROLES.includes(role)) return "Role tidak valid";
  return null;
};

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
      const { name, email, password, role = "staff" } = req.body;
      const validationError = validateUserStore({ name, email, password, role });

      if (validationError) {
        return res.status(400).json({
          status: "error",
          message: validationError,
        });
      }

      const existingUser = await UsersModels.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "Email sudah terdaftar",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await UsersModels.store({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        password: hashedPassword,
        role,
      });

      res.status(201).json({
        status: "success",
        message: "User berhasil ditambahkan",
        data: { id: userId, ...sanitizeUserPayload({ name, email, role }) }
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal menambahkan user"
      });
    }
  }
}

module.exports = new UsersController();
