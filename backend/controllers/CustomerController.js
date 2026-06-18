const CustomerModels = require('../models/CustomerModels');
const { validateId } = require('../validation/customerValidation');

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

    store(req, res){
        res.send("Menambahkan data");
    }
    update(req,res){
        const {id} = req.params;
        res.send(`Mengupdate data customer dengan ID ${id}`);
    }
    delete(req,res){
        const {id} = req.params;
        res.send(`Menghapus data customer dengan ID ${id}`);
    }
}

const object = new CustomerController();
module.exports = object;