// Interface Customer
interface Customer {
  readonly id: number;
  name: string;
  isActive: boolean;
}

// 1. Fungsi Filter: Mengambil customer yang aktif saja
const filterActive = (
  arr: Customer[],
  fn: (c: Customer) => boolean,
): Customer[] => {
  return arr.filter(fn);
};

// 2. Fungsi Map: Mengambil nama customer saja
const getNames = (arr: Customer[], fn: (c: Customer) => string): string[] => {
  return arr.map(fn);
};

// Contoh Penggunaan
const data: Customer[] = [
  { id: 1, name: "Budi", isActive: true },
  { id: 2, name: "Susi", isActive: false },
];

// Menggunakan filter
const activeCustomers = filterActive(data, (c) => c.isActive);

// Menggunakan map
const customerNames = getNames(data, (c) => c.name);
