//CustomerController.ts

import { Customer } from '../models/Customer';
import customers from '../data/customer';

class CustomerController {

  // Ambil semua customer
  getAll(): Customer[] {
    return customers;
  }

  // Tampilkan ringkasan ke console
  summary(): void {
    const total       = customers.length;
    console.log(' Ringkasan Customer ');
    console.log(`Total       : ${total}`);
  }

}

export default CustomerController;
