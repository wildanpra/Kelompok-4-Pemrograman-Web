const errorHandler = require("./errorHandler");

function authorize(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return errorHandler(res, "Forbidden", 403, "Tidak punya akses");
    }
    next();
  };
}

module.exports = authorize;
