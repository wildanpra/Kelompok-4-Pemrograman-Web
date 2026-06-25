const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  validateRegister,
  validateLogin,
} = require("../validation/authValidator.js");
const errorHandler = require("../middleware/errorHandler");

class AuthController {
  // REGISTER
  async register(req, res) {
    try {
      const data = req.body;

      const error = validateRegister(data);
      if (error) {
        return errorHandler(res, error, 400, error);
      }

      // Gunakan await karena User.findByEmail sekarang async
      const existingUser = await User.findByEmail(data.email);
      if (existingUser && existingUser.length > 0) {
        return errorHandler(
          res,
          "Email sudah ada",
          400,
          "Email sudah terdaftar",
        );
      }

      const hashed = await bcrypt.hash(data.password, 10);

      const user = {
        name: data.name,
        email: data.email,
        password: hashed,
        role: data.role || "staff", // Pastikan sesuai ENUM database: admin, staff, sales
      };

      await User.create(user);

      return res.status(201).json({
        success: true,
        message: "Register berhasil",
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Terjadi kesalahan pada server");
    }
  }

  // LOGIN
  async login(req, res) {
    try {
      const data = req.body;

      const error = validateLogin(data);
      if (error) {
        return errorHandler(res, error, 400, error);
      }

      const result = await User.findByEmail(data.email);
      if (!result || result.length === 0) {
        return errorHandler(res, "Not Found", 404, "User tidak ditemukan");
      }

      const user = result[0];

      const match = await bcrypt.compare(data.password, user.password);
      if (!match) {
        return errorHandler(res, "Password salah", 401, "Login gagal");
      }

      const token = jwt.sign(
        { id: user.id, role: user.role }, // Gunakan user.id (sesuai desc table Anda)
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      return res.json({
        success: true,
        message: "Login berhasil",
        token,
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Terjadi kesalahan pada server");
    }
  }
}

module.exports = new AuthController();
