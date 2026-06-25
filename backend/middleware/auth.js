const jwt = require("jsonwebtoken");
const errorHandler = require("./errorHandler");
function auth(req, res, next) {
  const bearer = req.headers["authorization"];

  if (!bearer) {
    return errorHandler(
      res,
      "Unauthorized",
      401,
      "Tidak ada token / Anda belum login",
    );
  }
  const token = bearer.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    return errorHandler(res, "Unauthorized", 401, "Token tidak valid");
  }
}

module.exports = auth;
