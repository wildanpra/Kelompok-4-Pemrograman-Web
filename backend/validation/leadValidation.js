const LEAD_STATUS = ['New', 'Contacted', 'Qualified', 'Won', 'Lost'];
const validateId = (id) => {
  if (!id || isNaN(id)) return "ID harus berupa angka";
  return null;
};

const validateStore = (customer_id, title, status) => {
    const errors = [];
    if(!customer_id) errors.push('customer_id wajib diisi')
    if (!title || !title.trim() ) errors.push("title wajib diisi");
    if (title && title.length > 150 ) errors.push("title maksimal 150 karakter");
    if (status && !LEAD_STATUS.includes(status)) {
        errors.push(`Status harus: ${LEAD_STATUS.join(', ')}`);
    }

    return errors.length ? errors : null;
}

const validateUpdate = validateStore;
module.exports = {
    validateId, validateStore, validateUpdate, LEAD_STATUS
};
