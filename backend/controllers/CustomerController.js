class CustomerController {
    index(req, res) {
        const data = {
            message: "menampilkan data customers",
            data: []
        }
        res.json(data);
        // res.send("menampilkan data customers");
    }
    store(req, res){
        res.send("mMenambahkan data");
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