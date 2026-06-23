const validateId = (id) => {
    if(!id || isNaN(id)) return "ID harus berupa angka";
    return null;
}

const validateStore = (name, email, phone, company, status = {}) => {
    const errors = [];
    if (!name || !name.trim() ) errors.push("Nama Pelanggan wajib diisi");
    if (name && name.length > 100 ) errors.push("Nama Pelanggan maksimal 100 karakter");
    if (email && email.length >100 ) errors.push("Email maksimal 100 karakter");
    if (phone && phone.length > 20 ) errors.push("Nomor Telepon maksimal 20 karakter");

    return errors.length ? errors : null;
}

const validateUpdate = validateStore;
module.exports = {
    validateId, validateStore, validateUpdate
};