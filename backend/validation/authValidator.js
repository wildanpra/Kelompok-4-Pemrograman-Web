function validateRegister(data) {
  if (!data.email) return "Email Wajib diisi";
  if (!data.password) return "Password Wajib diisi";
  return null;
}

function validateLogin(data) {
  if (!data.email) return "Email Wajib diisi";
  if (!data.password) return "Password Wajib diisi";
  return null;
}

module.exports = {
  validateRegister,
  validateLogin,
};

