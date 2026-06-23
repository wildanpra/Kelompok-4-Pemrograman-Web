//fungsi dideklarasikan beserta dengan type datanya
function tambah(a: number, b: number): number {
  //number bagian luar disebut return value
  return a + b;
}

function kirimNotifikasi(user: string, email?: string): void {
  //void merupakan return value
  console.log(`Mengirim ke ${user} ${email ? "via" + email : ""}`);
}

//fungsi dengan parameter default
function buatLead(nama: string, status: string = "New"): object {
  return { nama, status };
}

//tampilkan semua function
console.log(tambah(5, 10));
kirimNotifikasi("Budi");
console.log(buatLead("Perusahaan A"));
