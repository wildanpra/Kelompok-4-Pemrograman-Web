const ACTIVITY_TYPES = ['call', 'meeting', 'email', 'note', 'other'];

const validateId = (id) => {
  if (!id || isNaN(id)) return "ID harus berupa angka";
  return null;
};

const validateStore = (customer_id, type, activity_date) => {
    const errors = [];
    if(!customer_id) errors.push('customer_id wajib diisi');
    if (!type || !type.trim() ) errors.push("type wajib diisi");
    if (type && !ACTIVITY_TYPES.includes(type.toLowerCase())) {
        errors.push(`type harus salah satu dari: ${ACTIVITY_TYPES.join(', ')}`);
    }
    if (!activity_date) errors.push("activity_date wajib diisi");

    return errors.length ? errors : null;
}

const validateUpdate = validateStore;

module.exports = { validateId, validateStore, validateUpdate, ACTIVITY_TYPES };
