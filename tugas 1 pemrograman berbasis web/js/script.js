document.addEventListener('DOMContentLoaded', function() {
    // Router sederhana untuk menjalankan skrip yang sesuai dengan halaman yang aktif
    const path = window.location.pathname.split("/").pop();

    if (path === 'index.html' || path === '') {
        handleLoginPage();
    } else if (path === 'dashboard.html') {
        handleDashboardPage();
    } else if (path === 'tracking.html') {
        handleTrackingPage();
    } else if (path === 'stok.html') {
        handleStokPage();
    } else if (path === 'laporan_do.html') {
        handleLaporanDoPage();
    } else if (path === 'laporan_rekap.html') {
        handleLaporanRekapPage();
    } else if (path === 'histori.html') {
        handleHistoriPage();
    }
});

//Halaman Login (index.html)
function handleLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const user = dataPengguna.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                alert('Email atau password yang Anda masukkan salah');
            }
        });
    }
    const daftarBtn = document.getElementById('daftarBtn');
    const lupaBtn = document.getElementById('lupaBtn');
    if(daftarBtn) daftarBtn.addEventListener('click', () => alert('Fitur "Daftar" belum tersedia.'));
    if(lupaBtn) lupaBtn.addEventListener('click', () => alert('Fitur "Lupa Password" belum tersedia.'));
}

//Halaman Dashboard (dashboard.html)
function handleDashboardPage() {
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        const jam = new Date().getHours();
        let sapaan = '';
        if (jam >= 4 && jam < 12) sapaan = 'Selamat Pagi';
        else if (jam >= 12 && jam < 15) sapaan = 'Selamat Siang';
        else if (jam >= 15 && jam < 19) sapaan = 'Selamat Sore';
        else sapaan = 'Selamat Malam';
        greetingElement.textContent = sapaan;
    }
}

//Halaman Lacak Pengiriman (tracking.html)
function handleTrackingPage() {
    const trackingForm = document.getElementById('trackingForm');
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const nomorDO = document.getElementById('nomorDO').value;
            const hasilDiv = document.getElementById('hasil-tracking');
            const data = dataTracking[nomorDO];
            if (data) {
                let perjalananHTML = '';
                data.perjalanan.forEach(p => {
                    perjalananHTML += `<li><strong>${p.waktu}</strong>: ${p.keterangan}</li>`;
                });
                hasilDiv.innerHTML = `<div class="content-box"><h3>Hasil untuk DO: ${nomorDO}</h3><p><strong>Nama Penerima:</strong> ${data.nama}</p><p><strong>Status:</strong> ${data.status}</p><p><strong>Ekspedisi:</strong> ${data.ekspedisi}</p><hr style="margin: 20px 0; border: 1px solid #eee;"><h4>Riwayat Perjalanan:</h4><ul style="padding-left: 20px; margin-top: 10px;">${perjalananHTML}</ul></div>`;
            } else {
                hasilDiv.innerHTML = `<div class="content-box"><p>Error: Nomor Delivery Order "${nomorDO}" tidak ditemukan.</p></div>`;
            }
        });
    }
}

//Halaman Stok (stok.html).Mencakup render kartu buku, update stok, dan tambah barang baru
function handleStokPage() {
    const stokListContainer = document.getElementById('stok-list-container');
    function renderStokList() {
        stokListContainer.innerHTML = ''; 
        dataBahanAjar.forEach(item => {
            const card = `<div class="book-card"><div class="book-card-image"><img src="${item.cover}" alt="Sampul ${item.namaBarang}"></div><div class="book-card-details"><h3>${item.namaBarang}</h3><p><strong>Kode:</strong> ${item.kodeBarang}</p><p><strong>Edisi:</strong> ${item.edisi}</p><p class="stok">Stok: ${item.stok}</p></div></div>`;
            stokListContainer.innerHTML += card;
        });
    }
    if (stokListContainer) renderStokList();
    
    //Update Stok
    const updateStokForm = document.getElementById('updateStokForm');
    if (updateStokForm) {
        updateStokForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const kodeBarangToUpdate = document.getElementById('updateKodeBarang').value;
            const jumlahTambahan = parseInt(document.getElementById('jumlahTambahan').value, 10);
            const itemToUpdate = dataBahanAjar.find(item => item.kodeBarang === kodeBarangToUpdate);
            if (itemToUpdate) {
                itemToUpdate.stok += jumlahTambahan;
                alert(`Berhasil! Stok untuk "${itemToUpdate.namaBarang}" telah diperbarui menjadi ${itemToUpdate.stok}.`);
                renderStokList();
            } else {
                alert(`Error: Kode Barang "${kodeBarangToUpdate}" tidak ditemukan.`);
            }
            updateStokForm.reset();
        });
    }
    
    //Tambah Barang Baru
    const addStokForm = document.getElementById('addStokForm');
    if (addStokForm) {
        addStokForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newItem = {
                kodeLokasi: 'BARU',
                kodeBarang: document.getElementById('addKodeBarang').value,
                namaBarang: document.getElementById('addNamaBarang').value,
                jenisBarang: document.getElementById('addJenisBarang').value,
                edisi: document.getElementById('addEdisi').value,
                stok: parseInt(document.getElementById('addStok').value, 10),
                cover: 'img/placeholder.jpg'
            };
            dataBahanAjar.push(newItem);
            alert(`Barang baru "${newItem.namaBarang}" berhasil ditambahkan!`);
            renderStokList();
            addStokForm.reset();
        });
    }
}

//Halaman Laporan Progress DO (laporan_do.html)
function handleLaporanDoPage() {
    const statsContainer = document.getElementById('do-stats-cards');
    const tableBody = document.getElementById('do-table-body');
    const allDOs = Object.values(dataTracking);
    const totalPengiriman = allDOs.length;
    const dalamPerjalanan = allDOs.filter(d => d.status === 'Dalam Perjalanan').length;
    const telahTerkirim = allDOs.filter(d => d.status !== 'Dalam Perjalanan').length;
    statsContainer.innerHTML = `<div class="stat-card color-1"><h3>Total Pengiriman</h3><p>${totalPengiriman}</p></div><div class="stat-card color-2"><h3>Dalam Perjalanan</h3><p>${dalamPerjalanan}</p></div><div class="stat-card color-3"><h3>Telah Terkirim</h3><p>${telahTerkirim}</p></div>`;
    tableBody.innerHTML = '';
    allDOs.forEach(item => {
        const statusClass = item.status === 'Dalam Perjalanan' ? 'status-transit' : 'status-delivered';
        const statusText = item.status === 'Dikirim' ? 'Telah Terkirim' : item.status;
        const row = `<tr><td>${item.nomorDO}</td><td>${item.nama}</td><td>${item.tanggalKirim}</td><td>${item.ekspedisi}</td><td><span class="status-label ${statusClass}">${statusText}</span></td></tr>`;
        tableBody.innerHTML += row;
    });
}

//Halaman Laporan Rekap Bahan Ajar (laporan_rekap.html)
function handleLaporanRekapPage() {
    const statsContainer = document.getElementById('rekap-stats-cards');
    const tableBody = document.getElementById('rekap-table-body');
    const lowStockThreshold = 200;
    const totalJudul = dataBahanAjar.length;
    const totalStok = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
    const stokRendah = dataBahanAjar.filter(item => item.stok < lowStockThreshold).length;
    statsContainer.innerHTML = `<div class="stat-card color-1"><h3>Total Judul Buku</h3><p>${totalJudul}</p></div><div class="stat-card color-2"><h3>Total Stok</h3><p>${totalStok.toLocaleString('id-ID')}</p></div><div class="stat-card color-4"><h3>Judul Stok Rendah</h3><p>${stokRendah}</p></div>`;
    tableBody.innerHTML = '';
    dataBahanAjar.forEach(item => {
        const stokClass = item.stok < lowStockThreshold ? 'stok-level-low' : 'stok-level-healthy';
        const row = `<tr><td>${item.kodeBarang}</td><td>${item.namaBarang}</td><td>${item.edisi}</td><td class="${stokClass}">${item.stok}</td></tr>`;
        tableBody.innerHTML += row;
    });
}

//Halaman Histori Transaksi (histori.html)
function handleHistoriPage() {
    const tableBody = document.getElementById('histori-table-body');
    if (!tableBody) return;

    const allTransactions = Object.values(dataTracking);
    tableBody.innerHTML = '';

    if (allTransactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Tidak ada data transaksi.</td></tr>';
        return;
    }

    allTransactions.forEach(item => {
        const statusClass = item.status === 'Dalam Perjalanan' ? 'status-transit' : 'status-delivered';
        const statusText = item.status === 'Dikirim' ? 'Telah Terkirim' : item.status;
        const row = `
            <tr>
                <td>${item.nomorDO}</td>
                <td>${item.nama}</td>
                <td>${item.tanggalKirim}</td>
                <td>${item.paket}</td>
                <td>${item.total}</td>
                <td><span class="status-label ${statusClass}">${statusText}</span></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}