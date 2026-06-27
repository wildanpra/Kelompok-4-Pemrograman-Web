const db = require('../config/database');
const CustomerModels = require('../models/CustomerModels');
const ActivitiesModel = require('../models/ActivitiesModel');
const { validateId, validateStore, validateUpdate } = require('../validation/customerValidation');

const isAdmin = (user) => user?.role === 'admin';
const isStaff = (user) => user?.role === 'staff';
const isSales = (user) => user?.role === 'sales';

class CustomerController {
    async index(req, res) {
        try {
            const customers = isSales(req.user)
                ? await CustomerModels.findAssignedToUser(req.user.id)
                : await CustomerModels.findAll();
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
            if (isSales(req.user) && !(await CustomerModels.hasAssignedLead(id, req.user.id))) {
                return res.status(403).json({
                    message: "Anda tidak memiliki akses ke customer ini",
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
            if (isSales(req.user)) {
                return res.status(403).json({
                    message: "Sales tidak memiliki akses untuk menambah customer",
                    status: "error"
                });
            }

            const {name, email, phone, company, status, created_by} = req.body;
            const errors = validateStore(name, email, phone, company, status);
            if(errors){
                return res.status(400).json({
                    message: errors,
                    status: "error"
                });
            }

            await db.beginTransaction();

            const customerId = await CustomerModels.store({
                name,
                email,
                phone,
                company,
                status,
                created_by: req.user?.id || created_by
            });

            // Tambah Activity otomatis secara internal dengan tipe 'Note'
            const today = new Date().toISOString().slice(0, 10);
            await ActivitiesModel.store({
                customer_id: customerId,
                type: 'Note',
                description: `Customer baru '${name}' berhasil didaftarkan.`,
                activity_date: today,
                created_by: req.user?.id || created_by
            });

            await db.commit();

            res.status(201).json({
                message: "Data Customer dan aktivitas awal berhasil ditambahkan",
                status: "success",
                data: {
                    id: customerId,
                    name,
                    email,
                    phone,
                    company,
                    status
                }
            });
        }catch(error){
            try {
                await db.rollback();
            } catch (rollbackErr) {
                // ignore
            }
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

            if (!isAdmin(req.user) && !isStaff(req.user)) {
                return res.status(403).json({
                    message: "Anda tidak memiliki akses untuk mengubah customer",
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