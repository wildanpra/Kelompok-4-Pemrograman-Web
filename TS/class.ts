interface Customer {
  readonly id: number;
  name: string;
}

class CustomerService {
  // private: hanya kelas ini yang boleh menyimpan data internal
  private customers: Customer[] = [
    { id: 1, name: "Perusahaan A" },
    { id: 2, name: "Perusahaan B" },
  ];

  // public: bisa dipanggil oleh controller atau router
  public getAll(): Customer[] {
    return this.customers;
  }

  // Menambahkan data (data masuk diproteksi dengan tipe Customer)
  public add(customer: Customer): void {
    this.customers.push(customer);
  }
}

// Penggunaan
const service = new CustomerService();
console.log(service.getAll()); // Berhasil: mengembalikan daftar customer
// service.customers;           // ERROR! Properti 'customers' bersifat private.
