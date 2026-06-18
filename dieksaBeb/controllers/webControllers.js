const CustomerModel = require('../models/customerModel');

class CustomerController {
    async index(req, res) {
        try {
            const customers = await CustomerModel.findAll();
            res.json({
                message: "Data Customer berhasil diambil",
                status: "error",
                data: customers
            })
        } catch (error) {
            res.status(500).json({
                message: "Data customer gagal diambil",
                status: "error",
                error: error.message
            });
        }
    }
    async show(req, res) {
        try {
            const customers = await CustomerModel.findById();
            if(!customer){
                return res.status(404).json({
                    message: "Data Customer tidak ditemukan",
                    status: "error"
                });
            }
            res.json({
                message: "Data Customer berhasil diambil",
                status: "success",
                data: customers
            });
        } catch (error) {
            res.status(500).json({
                message: "Data Customer gagal diambil",
                status: "error",
                error: error.message
            });
        }
    }
}

module.exports = new CustomerController();