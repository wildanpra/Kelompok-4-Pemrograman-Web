import CustomerController from "./controllers/CustomerController";
const ctrl = new CustomerController();

console.log(`\n Semua Customer `);

ctrl.getAll().forEach(c => console.log(`[${c.id}] ${c.name} - ${c.status}`));
console.log('');
ctrl.summary();
