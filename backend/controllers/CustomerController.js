const CustomerModels = require('../models/CustomerModels');
const { validateId, validateStore, validateUpdate } = require('../validation/customerValidation');



class CustomerController {
    async index(req, res) {
        try {
            const customers = await CustomerModels.findAll();
            res.json({
                message: "Data Customer berhasil diambil",
                status: "success",
                data: customers
            })
        } catch (error) {
            res.status(500).json({
                message: "Data Customer gagal diambil",
                status: "error",
                error: error.message
            });
        }
    }
    async show(req, res){
        try {
            const {id} = req.params;
            const validation = validateId(id);
            if(validation){
                return res.status(400).json({
                    message: validation,
                    status: "error"
                });
            }
            const customer = await CustomerModels.findById(id);
            if(!customer){
                return res.status(404).json({
                    message: "Data Customer tidak ditemukan",
                    status: "error"
                });
            }
            res.json({
                message: "Data Customer berhasil diambil",
                status: "success",
                data: customer
            });
        } catch (error) {
            res.status(500).json({
                message: "Data Customer gagal diambil",
                status: "error",
                error: error.message
            });
        }
    }
        // const data = {
        //     message: "menampilkan data customers",
        //     data: []
        // }
        // res.json(data);
        // res.send("menampilkan data customers");

    async store(req, res, next){
        // res.send("Menambahkan data");
        try{
            const {name, email, phone, company, status} = req.body;
            const errors = validateStore(name, email, phone, company, status);
            if(errors){
                return res.status(400).json({
                    message: errors,
                    status: "error"
                });
            }
            const customer = await CustomerModels.store({
                name,
                email,
                phone,
                company,
                status,
                created_by: req.user?.id
            });
            res.status(201).json({
                message: "Data Customer berhasil ditambahkan",
                status: "success",
                data: customer
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

            const {name, email, phone, company, status} = req.body;
            const errors = validateUpdate(name, email, phone, company, status);
            if(errors){
                return res.status(400).json({
                    message: errors,
                    status: "error"
                });
            }

            const existing = await CustomerModels.findById(id);
            if(!existing){
                return res.status(404).json({
                    message: "Data Customer tidak ditemukan",
                    status: "error"
                });
            }

            await CustomerModels.update(id, {name, email, phone, company, status});

            res.json({
                message: "Data Customer berhasil diupdate",
                status: "success"
            });
        }catch(error){
            next(error);
        }
    }
    async delete(req, res, next){
        try{
            const {id} = req.params;
            const idError = validateId(id);
            if(idError){
                return res.status(400).json({
                    message: idError,
                    status: "error"
                });
            }

            const existing = await CustomerModels.findById(id);
            if(!existing){
                return res.status(404).json({
                    message: "Data Customer tidak ditemukan",
                    status: "error"
                });
            }

            await CustomerModels.destroy(id);

            res.json({
                message: "Data Customer berhasil dihapus",
                status: "success"
            });
        }catch(error){
            next(error);
        }
    }
}

const object = new CustomerController();
module.exports = object;