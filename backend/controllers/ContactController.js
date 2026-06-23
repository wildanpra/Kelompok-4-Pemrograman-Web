const ContactModel = require("../models/ContactModel");
const { validateId, validateStore, validateUpdate } = require('../validation/contactValidation');

class ContactsController {
  async index(req, res) {
    try {
      const contacts = await ContactModel.findAll();
      res.json({
        message: "Data Contacts berhasil diambil",
        status: "success",
        data: contacts
      });
    } catch (err) {
      res.status(500).json({
          message: "Data Contacts gagal diambil",
          status: "error",
          error: error.message
      });
    }
  }

  //menampilkan by id dari table customers
  async show(req, res) {
    try {
      const { id } = req.params;
      const error = validateId(id);
      if (error)
        return res.status(400).json({ success: false, message: error });

      const contacts = await ContactModel.findById(id);
      if (!contacts)
        return res
          .status(404)
          .json({success: false, message: "Contacts tidak ditemukan" });
      res.json({success: true, contacts});
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async store(req, res, next){
      // res.send("Menambahkan data");
      try{
          const {customer_id, name, email, phone, position} = req.body;
          const errors = validateStore(name, email, phone, position);
          if(errors){
              return res.status(400).json({
                  message: errors,
                  status: "error"
              });
          }
          const contacts = await ContactModel.store({
              customer_id, name, email, phone, position
              // created_at: req.user?.id
          });
          res.status(201).json({
              message: "Data Contacts berhasil ditambahkan",
              status: "success",
              data: contacts
          });
      }catch(error){
          next(error);
      }
  }

  async update(req, res, next){
      try{
          const {id} = req.params;
          const idError = validateId(id);
          if(idError){
              return res.status(400).json({
                  message: idError,
                  status: "error"
              });
          }

          const {customer_id, name, email, phone, position} = req.body;
          const errors = validateUpdate(name, email, phone, position);
          if(errors){
              return res.status(400).json({
                  message: errors,
                  status: "error"
              });
          }

          const existing = await ContactModel.findById(id);
          if(!existing){
              return res.status(404).json({
                  message: "Data Contacts tidak ditemukan",
                  status: "error"
              });
          }

          await ContactModel.update(id, {customer_id, name, email, phone, position});

          res.json({
              message: "Data Contacts berhasil diupdate",
              status: "success"
          });
      }catch(error){
          next(error);
      }
  }

  async destroy(req, res, next){
      try{
          const {id} = req.params;
          const idError = validateId(id);
          if(idError){
              return res.status(400).json({
                  message: idError,
                  status: "error"
              });
          }

          const existing = await ContactModel.findById(id);
          if(!existing){
              return res.status(404).json({
                  message: "Data Contacts tidak ditemukan",
                  status: "error"
              });
          }

          await ContactModel.destroy(id);

          res.json({
              message: "Data Contacts berhasil dihapus",
              status: "success"
          });
      }catch(error){
          next(error);
      }
  }
}
const object = new ContactsController();

module.exports = object;
