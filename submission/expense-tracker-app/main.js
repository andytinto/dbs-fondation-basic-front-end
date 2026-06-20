// Data State
let listTransaksi = [];
let idTransaksiEdit = null;
let kataKunciCari = '';

// Elemen DOM
const formInput = document.getElementById('transactionForm');
const inputKeterangan = document.getElementById('transactionFormTitleInput');
const inputNominal = document.getElementById('transactionFormAmountInput');
const inputTanggal = document.getElementById('transactionFormDateInput');
const selectTipe = document.getElementById('transactionFormTypeSelect');
const tombolSubmit = document.getElementById('transactionFormSubmitButton');

const formCari = document.getElementById('searchTransactionForm');
const inputCari = document.getElementById('searchTransactionFormTitleInput');

const wadahPemasukan = document.getElementById('incomeList');
const wadahPengeluaran = document.getElementById('expenseList');

const teksSaldo = document.querySelector('.tracker-summary__balance-amount');
const teksPemasukan = document.querySelector('.tracker-summary__stat-amount--income');
const teksPengeluaran = document.querySelector('.tracker-summary__stat-amount--expense');

// Inisialisasi awal saat halaman dimuat
window.addEventListener('DOMContentLoaded', function() {
  const dataLokal = localStorage.getItem('transactions');
  if (dataLokal) {
    listTransaksi = JSON.parse(dataLokal);
  }

  // Set tanggal default ke hari ini
  const hariIni = new Date().toISOString().split('T')[0];
  inputTanggal.value = hariIni;

  // Render pertama kali
  triggerUpdate();
});

// Mengirim custom event untuk memicu pembaruan UI
function triggerUpdate() {
  const event = new CustomEvent('render-app');
  document.dispatchEvent(event);
}

// Listener custom event untuk render ulang dan simpan data
document.addEventListener('render-app', function() {
  // Simpan data terbaru ke localStorage
  localStorage.setItem('transactions', JSON.stringify(listTransaksi));

  // Update Tampilan Dashboard
  updateDashboard();

  // Update Daftar Transaksi
  updateDaftar();
});

// Menghitung & memperbarui dashboard keuangan
function updateDashboard() {
  let totalMasuk = 0;
  let totalKeluar = 0;

  listTransaksi.forEach(function(transaksi) {
    if (transaksi.type === 'income') {
      totalMasuk += transaksi.amount;
    } else if (transaksi.type === 'expense') {
      totalKeluar += transaksi.amount;
    }
  });

  const saldo = totalMasuk - totalKeluar;

  teksSaldo.textContent = `Rp${saldo.toLocaleString('id-ID')}`;
  teksPemasukan.textContent = `Rp${totalMasuk.toLocaleString('id-ID')}`;
  teksPengeluaran.textContent = `Rp${totalKeluar.toLocaleString('id-ID')}`;
}

// Memperbarui daftar transaksi masuk & keluar di layar
function updateDaftar() {
  wadahPemasukan.innerHTML = '';
  wadahPengeluaran.innerHTML = '';

  // Filter list berdasarkan kata kunci pencarian
  const dataFiltered = listTransaksi.filter(function(transaksi) {
    return transaksi.title.toLowerCase().includes(kataKunciCari);
  });

  dataFiltered.forEach(function(transaksi) {
    const elemenKartu = buatElemenTransaksi(transaksi);

    if (transaksi.type === 'income') {
      wadahPemasukan.appendChild(elemenKartu);
    } else {
      wadahPengeluaran.appendChild(elemenKartu);
    }
  });
}

// Membuat elemen HTML kartu transaksi sesuai template submission
function buatElemenTransaksi(transaksi) {
  const item = document.createElement('div');
  item.setAttribute('data-testid', 'transactionItem');
  item.className = 'tracker-transaction-item';

  // Ikon visual tambahan
  const divIkon = document.createElement('div');
  divIkon.className = 'tracker-transaction-item__icon ' + 
    (transaksi.type === 'income' ? 'tracker-transaction-item__icon--income' : 'tracker-transaction-item__icon--expense');
  divIkon.textContent = transaksi.type === 'income' ? '📈' : '📉';
  item.appendChild(divIkon);

  // Bagian Detail Transaksi
  const detail = document.createElement('div');
  detail.className = 'tracker-transaction-item__detail';

  const judul = document.createElement('h3');
  judul.setAttribute('data-testid', 'transactionItemTitle');
  judul.className = 'tracker-transaction-item__title';
  judul.textContent = transaksi.title;
  detail.appendChild(judul);

  const tgl = document.createElement('p');
  tgl.setAttribute('data-testid', 'transactionItemDate');
  tgl.className = 'tracker-transaction-item__date';
  tgl.textContent = `Tanggal: ${transaksi.date}`;
  detail.appendChild(tgl);

  const tipe = document.createElement('p');
  tipe.setAttribute('data-testid', 'transactionItemType');
  tipe.className = 'visually-hidden'; // Tersembunyi tetapi wajib ada sesuai test runner
  tipe.textContent = `Tipe: ${transaksi.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`;
  detail.appendChild(tipe);

  item.appendChild(detail);

  // Bagian Kanan (Nominal & Aksi)
  const bagianKanan = document.createElement('div');
  bagianKanan.className = 'tracker-transaction-item__right';

  const nominal = document.createElement('p');
  nominal.setAttribute('data-testid', 'transactionItemAmount');
  nominal.className = 'tracker-transaction-item__amount ' + 
    (transaksi.type === 'income' ? 'tracker-transaction-item__amount--income' : 'tracker-transaction-item__amount--expense');
  // Format teks nominal WAJIB persis template test dicoding: Nominal: Rp[angka]
  nominal.textContent = `Nominal: Rp${transaksi.amount}`;
  bagianKanan.appendChild(nominal);

  // Kontainer Tombol Aksi
  const wadahTombol = document.createElement('div');
  wadahTombol.className = 'tracker-transaction-item__actions';

  // Tombol Ubah Tipe
  const btnUbahTipe = document.createElement('button');
  btnUbahTipe.setAttribute('data-testid', 'transactionItemEditTypeButton');
  btnUbahTipe.className = 'tracker-transaction-item__btn';
  btnUbahTipe.textContent = 'Ubah Tipe';
  btnUbahTipe.onclick = function() {
    transaksi.type = transaksi.type === 'income' ? 'expense' : 'income';
    triggerUpdate();
  };
  wadahTombol.appendChild(btnUbahTipe);

  // Tombol Edit Form
  const btnEdit = document.createElement('button');
  btnEdit.className = 'tracker-transaction-item__btn';
  btnEdit.textContent = 'Edit';
  btnEdit.onclick = function() {
    inputKeterangan.value = transaksi.title;
    inputNominal.value = transaksi.amount;
    inputTanggal.value = transaksi.date;
    selectTipe.value = transaksi.type;

    idTransaksiEdit = transaksi.id;
    tombolSubmit.textContent = 'Perbarui';
  };
  wadahTombol.appendChild(btnEdit);

  // Tombol Hapus
  const btnHapus = document.createElement('button');
  btnHapus.setAttribute('data-testid', 'transactionItemDeleteButton');
  btnHapus.className = 'tracker-transaction-item__btn tracker-transaction-item__btn--delete';
  btnHapus.textContent = 'Hapus';
  btnHapus.onclick = function() {
    listTransaksi = listTransaksi.filter(function(t) {
      return t.id !== transaksi.id;
    });
    triggerUpdate();

    if (idTransaksiEdit === transaksi.id) {
      resetForm();
    }
  };
  wadahTombol.appendChild(btnHapus);

  bagianKanan.appendChild(wadahTombol);
  item.appendChild(bagianKanan);

  return item;
}

// Mengembalikan form ke mode tambah
function resetForm() {
  idTransaksiEdit = null;
  tombolSubmit.textContent = 'Simpan';
  formInput.reset();

  const hariIni = new Date().toISOString().split('T')[0];
  inputTanggal.value = hariIni;
}

// Menangani Submit Form Transaksi (Tambah/Edit)
formInput.addEventListener('submit', function(e) {
  e.preventDefault();

  const title = inputKeterangan.value.trim();
  const amount = parseInt(inputNominal.value, 10);
  const date = inputTanggal.value;
  const type = selectTipe.value;

  // Validasi Input
  if (!title) {
    alert('Judul transaksi tidak boleh kosong!');
    return;
  }
  if (isNaN(amount) || amount < 1) {
    alert('Nominal uang tidak valid (minimal Rp1)!');
    return;
  }
  if (!date) {
    alert('Tanggal tidak boleh kosong!');
    return;
  }

  if (idTransaksiEdit !== null) {
    // Mode Edit
    const index = listTransaksi.findIndex(function(t) {
      return t.id === idTransaksiEdit;
    });

    if (index > -1) {
      listTransaksi[index] = {
        ...listTransaksi[index],
        title,
        amount,
        date,
        type
      };
      triggerUpdate();
    }
    resetForm();
  } else {
    // Mode Tambah Baru
    const transaksiBaru = {
      id: +new Date(),
      title,
      amount,
      date,
      type
    };
    listTransaksi.push(transaksiBaru);
    triggerUpdate();
    resetForm();
  }
});

// Pencarian Real-time saat mengetik kata kunci
inputCari.addEventListener('input', function(e) {
  kataKunciCari = e.target.value.trim().toLowerCase();
  updateDaftar();
});

// Menangani submit pada form pencarian
formCari.addEventListener('submit', function(e) {
  e.preventDefault();
  kataKunciCari = inputCari.value.trim().toLowerCase();
  updateDaftar();
});
