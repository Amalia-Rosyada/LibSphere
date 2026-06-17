// --- 1. SIDEBAR & NAVIGATION SYSTEM ---
let sidebarOpen = true;

// Set default state awal berdasarkan ukuran layar saat web dimuat
if (window.innerWidth < 768) {
    sidebarOpen = false; 
}

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');

function closeSidebar() {
    sidebarOpen = false;
    const sidebar = document.querySelector('aside');
    if (!sidebar) return;

    if (window.innerWidth < 768) {
        sidebar.classList.remove('active-mobile');
    } else {
        sidebar.classList.add('collapsed-desktop');
    }

    // Sembunyikan lapisan overlay di HP dengan animasi smooth
    if (sidebarOverlay) {
        sidebarOverlay.classList.remove('active-overlay');
        sidebarOverlay.classList.add('hidden-overlay');
    }
}

function openSidebar() {
    sidebarOpen = true;
    const sidebar = document.querySelector('aside');
    if (!sidebar) return;

    if (window.innerWidth < 768) {
        sidebar.classList.add('active-mobile');
    } else {
        sidebar.classList.remove('collapsed-desktop');
    }

    // Tampilkan lapisan overlay di HP dengan animasi smooth
    if (sidebarOverlay) {
        sidebarOverlay.classList.remove('hidden-overlay');
        sidebarOverlay.classList.add('active-overlay');
    }
}

function toggleSidebar() {
    if (sidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// Event Listener untuk Tombol Hamburger khusus HP
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleSidebar);
}

// Event Listener untuk Tombol Toggle Sidebar di Atas (Dekat Search Bar)
if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', toggleSidebar);
}

// Event Listener agar sidebar menutup saat area hitam (overlay) di HP diklik
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Otomatis tutup di HP setelah menu navigasi diklik
document.querySelectorAll('.sidebar-link').forEach(btn => {
    btn.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            closeSidebar();
        }
    });
});

// --- 2. AUTHENTICATION SYSTEM ---
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('staff-name').value.trim();
    
    if (!name) { 
        document.getElementById('login-error').classList.remove('hidden'); 
        return; 
    }
    
    staffName = name;
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');
    
    loginScreen.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
    loginScreen.style.opacity = "0";
    loginScreen.style.transform = "scale(0.98)";
    
    setTimeout(() => {
        loginScreen.classList.add('hidden');
        loginScreen.style.opacity = "";
        loginScreen.style.transform = "";
        
        dashboard.classList.remove('hidden');
        
        document.getElementById('staff-display').textContent = staffName;
        document.getElementById('avatar-initial').textContent = staffName.charAt(0).toUpperCase();

        if (document.getElementById('welcome-name')) {
            document.getElementById('welcome-name').textContent = staffName;
        }
        
        const activePage = document.querySelector('.page-content:not(.hidden)');
        if (activePage) {
            activePage.style.animation = 'none';
            activePage.offsetHeight;
            activePage.style.animation = '';
        }
        // Hitung statistik awal saat masuk dashboard
        updateDashboardStats();
    }, 400);
});

document.getElementById('profile-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('profile-menu').classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
        document.getElementById('profile-menu').classList.add('hidden');
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').classList.add('hidden');
    document.getElementById('staff-name').focus();
    document.getElementById('profile-menu').classList.add('hidden');
    staffName = '';
    closeSidebar(); // Sinkronisasi penutupan sidebar yang lembut saat logout
});

// --- 3. SIDEBAR NAVIGATION ---
document.querySelectorAll('.sidebar-link').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-link').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
        document.getElementById(btn.dataset.page).classList.remove('hidden');
    });
});

// --- 4. BARCODE SCAN MODAL CONTROLS ---
const modalControl = (open = true) => {
    const modal = document.getElementById('scan-modal');
    if(open) {
        modal.classList.remove('hidden');
        document.getElementById('scan-input').focus();
    } else {
        modal.classList.add('hidden');
        document.getElementById('scan-input').value = '';
    }
    document.getElementById('scan-content').classList.remove('hidden');
    document.getElementById('scan-success').classList.add('hidden');
};

document.getElementById('close-scan-modal').addEventListener('click', () => modalControl(false));
document.getElementById('scan-another-btn').addEventListener('click', () => modalControl(true));
document.getElementById('close-scan-success-btn').addEventListener('click', () => modalControl(false));

document.getElementById('scan-book-btn').addEventListener('click', () => {
    currentScanType = 'book';
    modalControl(true);
});

document.getElementById('scan-member-btn').addEventListener('click', () => {
    currentScanType = 'member';
    modalControl(true);
});

// --- FUNGSI UNTUK MEMPERBARUI ANGKA DI DASHBOARD ---
function updateDashboardStats() {
    const tbodyBooks = document.getElementById('books-tbody');
    const tbodyMembers = document.getElementById('members-tbody');
    const tbodyBorrows = document.getElementById('borrows-tbody');

    const totalBooks = tbodyBooks ? tbodyBooks.children.length : 0;
    const totalMembers = tbodyMembers ? tbodyMembers.children.length : 0;

    let totalBorrowed = 0;
    let totalReturned = 0;

    if (tbodyBorrows) {
        const rows = tbodyBorrows.children;
        for (let i = 0; i < rows.length; i++) {
            const statusCell = rows[i].querySelector('.status-cell');
            if (statusCell) {
                const statusText = statusCell.textContent.toLowerCase();
                
                if (statusText.includes('kembali')) {
                    totalReturned++;
                } else {
                    totalBorrowed++;
                }
            }
        }
    }

    const bookCard = document.getElementById('stat-total-books') || document.getElementById('stat-books');
    const memberCard = document.getElementById('stat-total-members') || document.getElementById('stat-members');
    const borrowCard = document.getElementById('stat-total-borrows') || document.getElementById('stat-borrowed');
    const returnCard = document.getElementById('stat-total-returned') || document.getElementById('stat-returned');

    if (bookCard) bookCard.textContent = totalBooks;
    if (memberCard) memberCard.textContent = totalMembers;
    if (borrowCard) borrowCard.textContent = totalBorrowed;   
    if (returnCard) returnCard.textContent = totalReturned;   
}

// Fungsi pembantu untuk memperbarui dropdown secara lokal
function refreshDropdownsManually() {
    const memberSelect = document.getElementById('borrow-member');
    const bookSelect = document.getElementById('borrow-book');
    
    if (memberSelect && bookSelect) {
        const members = allData.filter(d => d.type === 'member');
        const books = allData.filter(d => d.type === 'book');
        
        memberSelect.innerHTML = '<option value="">-- Pilih --</option>' + 
            members.map(m => `<option value="${esc(m.member_name)}">${esc(m.member_name)}</option>`).join('');
            
        bookSelect.innerHTML = '<option value="">-- Pilih --</option>' + 
            books.map(b => `<option value="${esc(b.title)}">${esc(b.title)}</option>`).join('');
    }
}

// Confirm barcode scan logic
document.getElementById('confirm-scan-btn').addEventListener('click', async () => {
    const code = document.getElementById('scan-input').value.trim();
    if (!code) { 
        showToast('Masukkan kode scanning'); 
        return; 
    }

    if (currentScanType === 'book') {
        const parts = code.split('|');
        const title = parts[0].trim();
        const author = parts[1]?.trim() || 'Tidak diketahui';
        const publisher = parts[2]?.trim() || 'Tidak diketahui';
        if (!title) return;
        
        let success = true;
        if (window.dataSdk && window.dataSdk.create) {
            const r = await window.dataSdk.create({ type: 'book', title, author, publisher });
            success = r.isOk;
        }

        if (success) {
            allData.push({ type: 'book', title, author, publisher });
            
            const tbody = document.getElementById('books-tbody');
            const rowCount = tbody.children.length + 1;
            const tr = document.createElement('tr');
            tr.className = 'border-b dark:border-slate-700 last:border-0';
            tr.innerHTML = `
                <td class="px-5 py-3">${rowCount}</td>
                <td class="px-5 py-3 font-medium">${esc(title)}</td>
                <td class="px-5 py-3 text-slate-500 dark:text-gray-400">${esc(author)}</td>
                <td class="px-5 py-3 text-slate-500 dark:text-gray-400">${esc(publisher)}</td>
                <td class="px-5 py-3"><button class="text-red-500 hover:text-red-700 text-xs underline del-btn">Hapus</button></td>
            `;
            
            tr.querySelector('.del-btn').addEventListener('click', () => {
                allData = allData.filter(d => !(d.type === 'book' && d.title === title));
                tr.remove();
                refreshDropdownsManually();
                updateDashboardStats(); 
            });
            tbody.appendChild(tr);

            if(document.getElementById('books-empty')) document.getElementById('books-empty').classList.add('hidden');
            
            refreshDropdownsManually();
            updateDashboardStats(); 
            showScanSuccess(`Buku: ${title}`);
        } else {
            showToast('Gagal menyimpan buku ke database.');
        }

    } else if (currentScanType === 'member') {
        const parts = code.split('|');
        const member_name = parts[0].trim();
        const member_class = parts[1]?.trim() || 'Umum';
        const member_nis = parts[2]?.trim() || '-';
        if (!member_name) return;
        
        let success = true;
        if (window.dataSdk && window.dataSdk.create) {
            const r = await window.dataSdk.create({ type: 'member', member_name, member_class, member_nis });
            success = r.isOk;
        }

        if (success) {
            allData.push({ type: 'member', member_name, member_class, member_nis });

            const tbody = document.getElementById('members-tbody');
            if (tbody) {
                const rowCount = tbody.children.length + 1;
                const tr = document.createElement('tr');
                tr.className = 'border-b dark:border-slate-700 last:border-0';
                tr.innerHTML = `
                    <td class="px-5 py-3">${rowCount}</td>
                    <td class="px-5 py-3 font-medium">${esc(member_name)}</td>
                    <td class="px-5 py-3 text-slate-500 dark:text-gray-400">${esc(member_class)}</td>
                    <td class="px-5 py-3 text-slate-500 dark:text-gray-400">${esc(member_nis)}</td>
                    <td class="px-5 py-3"><button class="text-red-500 hover:text-red-700 text-xs underline del-btn">Hapus</button></td>
                `;
                tr.querySelector('.del-btn').addEventListener('click', () => {
                    allData = allData.filter(d => !(d.type === 'member' && d.member_name === member_name));
                    tr.remove();
                    refreshDropdownsManually();
                    updateDashboardStats(); 
                });
                tbody.appendChild(tr);
            }

            if(document.getElementById('members-empty')) document.getElementById('members-empty').classList.add('hidden');
            
            refreshDropdownsManually();
            updateDashboardStats(); 
            showScanSuccess(`Anggota: ${member_name}`);
        } else {
            showToast('Gagal menyimpan anggota.');
        }
    }
});

function showScanSuccess(text) {
    document.getElementById('scan-content').classList.add('hidden');
    document.getElementById('scan-success').classList.remove('hidden');
    document.getElementById('scan-result').textContent = text;
}

// --- 5. DATA RENDERING & STATS ---
const handler = {
    onDataChanged(data) {
        allData = data;
        updateStats();
        renderBooks();
        renderMembers();
        renderBorrows();
        updateDropdowns();
        updateDashboardStats();
        
        if (staffName && document.getElementById('dashboard').classList.contains('hidden')) {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
        }
    }
};

function updateStats() {
    const books = allData.filter(d => d.type === 'book');
    const members = allData.filter(d => d.type === 'member');
    const borrows = allData.filter(d => d.type === 'borrow');
    
    const statBooks = document.getElementById('stat-books');
    const statMembers = document.getElementById('stat-members');
    const statBorrowed = document.getElementById('stat-borrowed');
    const statReturned = document.getElementById('stat-returned');

    if(statBooks) statBooks.textContent = books.length;
    if(statMembers) statMembers.textContent = members.length;
    if(statBorrowed) statBorrowed.textContent = borrows.filter(b => b.status === 'dipinjam').length;
    if(statReturned) statReturned.textContent = borrows.filter(b => b.status === 'dikembalikan').length;
}

function updateDropdowns() {
    refreshDropdownsManually();
}

function renderBooks() {
    const items = allData.filter(d => d.type === 'book');
    const tbody = document.getElementById('books-tbody');
    if(!tbody) return;
    document.getElementById('books-empty').classList.toggle('hidden', items.length > 0);
    tbody.innerHTML = '';
    items.forEach((item, i) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b last:border-0';
        tr.innerHTML = `<td class="px-5 py-3">${i+1}</td><td class="px-5 py-3 font-medium">${esc(item.title)}</td><td class="px-5 py-3">${esc(item.author)}</td><td class="px-5 py-3">${esc(item.publisher)}</td><td class="px-5 py-3"><button class="text-red-500 hover:text-red-700 text-xs del-btn">Hapus</button></td>`;
        tr.querySelector('.del-btn').addEventListener('click', () => deleteRecord(item));
        tbody.appendChild(tr);
    });
}

function renderMembers() {
    const items = allData.filter(d => d.type === 'member');
    const tbody = document.getElementById('members-tbody');
    if(!tbody) return;
    document.getElementById('members-empty').classList.toggle('hidden', items.length > 0);
    tbody.innerHTML = '';
    items.forEach((item, i) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b last:border-0';
        tr.innerHTML = `<td class="px-5 py-3">${i+1}</td><td class="px-5 py-3 font-medium">${esc(item.member_name)}</td><td class="px-5 py-3">${esc(item.member_class)}</td><td class="px-5 py-3">${esc(item.member_nis)}</td><td class="px-5 py-3"><button class="text-red-500 hover:text-red-700 text-xs del-btn">Hapus</button></td>`;
        tr.querySelector('.del-btn').addEventListener('click', () => deleteRecord(item));
        tbody.appendChild(tr);
    });
}

function renderBorrows() {
    const items = allData.filter(d => d.type === 'borrow');
    const tbody = document.getElementById('borrows-tbody');
    if(!tbody) return;
    document.getElementById('borrows-empty').classList.toggle('hidden', items.length > 0);
    tbody.innerHTML = '';
    items.forEach((item, i) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b last:border-0';
        const statusBadge = item.status === 'dipinjam'
            ? '<span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Dipinjam</span>'
            : '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Dikembalikan</span>';
        tr.innerHTML = `<td class="px-5 py-3">${i+1}</td><td class="px-5 py-3">${esc(item.borrower_name)}</td><td class="px-5 py-3">${esc(item.book_title)}</td><td class="px-5 py-3">${esc(item.borrow_date)}</td><td class="px-5 py-3">${statusBadge}</td><td class="px-5 py-3 flex gap-2">${item.status === 'dipinjam' ? '<button class="text-blue-600 text-xs underline return-btn">Kembalikan</button>' : ''}<button class="text-red-500 text-xs del-btn">Hapus</button></td>`;
        tr.querySelector('.del-btn').addEventListener('click', () => deleteRecord(item));
        const retBtn = tr.querySelector('.return-btn');
        if (retBtn) retBtn.addEventListener('click', () => returnBook(item));
        tbody.appendChild(tr);
    });
}

function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

async function deleteRecord(item) {
    if (window.dataSdk && window.dataSdk.delete) {
        await window.dataSdk.delete(item);
    }
    allData = allData.filter(d => d !== item);
    refreshDropdownsManually();
    updateDashboardStats();
}

async function returnBook(item) {
    if (window.dataSdk && window.dataSdk.update) {
        await window.dataSdk.update({ ...item, status: 'dikembalikan' });
    }
    item.status = 'dikembalikan';
    renderBorrows();
    updateDashboardStats();
}

function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// --- 6. MANUAL FORM SUBMISSIONS ---
document.getElementById('book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim() || 'Tidak diketahui';
    const publisher = document.getElementById('book-publisher').value.trim() || 'Tidak diketahui';
    
    if (!title) return;
    
    let success = true;
    if (window.dataSdk && window.dataSdk.create) {
        const r = await window.dataSdk.create({ type: 'book', title, author, publisher });
        success = r.isOk;
    }
    
    if (success) {
        allData.push({ type: 'book', title, author, publisher });
        const tbody = document.getElementById('books-tbody');
        const rowCount = tbody.children.length + 1;
        const tr = document.createElement('tr');
        tr.className = 'border-b dark:border-slate-700 last:border-0';
        tr.innerHTML = `
            <td class="px-5 py-3">${rowCount}</td>
            <td class="px-5 py-3 font-medium">${esc(title)}</td>
            <td class="px-5 py-3 text-slate-500 dark:text-gray-400">${esc(author)}</td>
            <td class="px-5 py-3 text-slate-500 dark:text-gray-400">${esc(publisher)}</td>
            <td class="px-5 py-3"><button class="text-red-500 hover:text-red-700 text-xs underline del-btn">Hapus</button></td>
        `;
        tr.querySelector('.del-btn').addEventListener('click', () => {
            allData = allData.filter(d => !(d.type === 'book' && d.title === title));
            tr.remove();
            refreshDropdownsManually();
            updateDashboardStats(); 
        });
        tbody.appendChild(tr);
        if(document.getElementById('books-empty')) document.getElementById('books-empty').classList.add('hidden');
        e.target.reset();
        refreshDropdownsManually();
        updateDashboardStats(); 
        showToast('Buku berhasil ditambahkan!');
    }
});

document.getElementById('member-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const member_name = document.getElementById('member-name').value.trim();
    const member_class = document.getElementById('member-class').value.trim() || '-';
    const member_nis = document.getElementById('member-nis').value.trim() || '-';
    
    if (!member_name) return;
    
    let success = true;
    if (window.dataSdk && window.dataSdk.create) {
        const r = await window.dataSdk.create({ type: 'member', member_name, member_class, member_nis });
        success = r.isOk;
    }
    
    if (success) {
        allData.push({ type: 'member', member_name, member_class, member_nis });
        const tbody = document.getElementById('members-tbody');
        const rowCount = tbody.children.length + 1;
        const tr = document.createElement('tr');
        tr.className = 'border-b dark:border-slate-700 last:border-0';
        tr.innerHTML = `
            <td class="px-5 py-3">${rowCount}</td>
            <td class="px-5 py-3 font-medium">${esc(member_name)}</td>
            <td class="px-5 py-3 text-slate-500 dark:text-gray-400">${esc(member_class)}</td>
            <td class="px-5 py-3 text-slate-500 dark:text-gray-400">${esc(member_nis)}</td>
            <td class="px-5 py-3"><button class="text-red-500 hover:text-red-700 text-xs underline del-btn">Hapus</button></td>
        `;
        tr.querySelector('.del-btn').addEventListener('click', () => {
            allData = allData.filter(d => !(d.type === 'member' && d.member_name === member_name));
            tr.remove();
            refreshDropdownsManually();
            updateDashboardStats(); 
        });
        tbody.appendChild(tr);
        if(document.getElementById('members-empty')) document.getElementById('members-empty').classList.add('hidden');
        e.target.reset();
        refreshDropdownsManually();
        updateDashboardStats(); 
        showToast('Anggota berhasil ditambahkan!');
    }
});

document.getElementById('borrow-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const borrower_name = document.getElementById('borrow-member').value;
    const book_title = document.getElementById('borrow-book').value;
    const borrow_date = document.getElementById('borrow-date').value;
    
    if (!borrower_name || !book_title || !borrow_date) return;
    
    let success = true;
    if (window.dataSdk && window.dataSdk.create) {
        const r = await window.dataSdk.create({ type: 'borrow', borrower_name, book_title, borrow_date, status: 'dipinjam' });
        success = r.isOk;
    }
    
    if (success) {
        const tbody = document.getElementById('borrows-tbody');
        const rowCount = tbody.children.length + 1;
        const tr = document.createElement('tr');
        tr.className = 'border-b dark:border-slate-700 last:border-0';
        tr.innerHTML = `
            <td class="px-5 py-3">${rowCount}</td>
            <td class="px-5 py-3">${esc(borrower_name)}</td>
            <td class="px-5 py-3">${esc(book_title)}</td>
            <td class="px-5 py-3 date-cell">${esc(borrow_date)}</td>
            <td class="px-5 py-3 status-cell"><span class="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs px-2 py-1 rounded">Dipinjam</span></td>
            <td class="px-5 py-3">
                <div class="flex flex-wrap items-center gap-2 action-container">
                    <button class="text-blue-600 dark:text-blue-400 text-xs underline return-btn">Kembalikan</button>
                    
                    <select class="renew-days border rounded px-1 py-0.5 text-xs bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                        <option value="1">1 hari</option>
                        <option value="2">2 hari</option>
                        <option value="3">3 hari</option>
                        <option value="4">4 hari</option>
                        <option value="5">5 hari</option>
                        <option value="6">6 hari</option>
                        <option value="7">7 hari</option>
                    </select>
                    
                    <button class="text-amber-600 dark:text-amber-400 text-xs underline renew-btn">Perpanjang</button>
                    <button class="text-red-500 text-xs underline del-btn">Hapus</button>
                </div>
            </td>
        `;
        tr.querySelector('.del-btn').addEventListener('click', () => {
            tr.remove();
            updateDashboardStats(); 
        });
        tr.querySelector('.return-btn').addEventListener('click', (btnE) => {
            tr.querySelector('.status-cell').innerHTML = '<span class="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded">Dikembalikan</span>';
            tr.querySelector('.return-btn').remove();
            tr.querySelector('.renew-days').remove();
            btnE.target.remove();
            updateDashboardStats(); 
        });
        
        tr.querySelector('.renew-btn').addEventListener('click', () => {
            const daysToAdd = parseInt(tr.querySelector('.renew-days').value, 10);
            const dateCell = tr.querySelector('.date-cell');
            const currentFormattedDate = dateCell.textContent;
            const baseDate = new Date(currentFormattedDate);
            
            if (!isNaN(baseDate.getTime())) {
                baseDate.setDate(baseDate.getDate() + daysToAdd);
                const yyyy = baseDate.getFullYear();
                const mm = String(baseDate.getMonth() + 1).padStart(2, '0');
                const dd = String(baseDate.getDate()).padStart(2, '0');
                dateCell.textContent = `${yyyy}-${mm}-${dd}`;
                tr.querySelector('.status-cell').innerHTML = `<span class="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 text-xs px-2 py-1 rounded">Diperpanjang (+${daysToAdd}d)</span>`;
                showToast(`Masa pinjam berhasil diperpanjang ${daysToAdd} hari!`);
            } else {
                showToast('Format tanggal asal tidak valid untuk diubah.');
            }
        });
        
        tbody.appendChild(tr);
        if(document.getElementById('borrows-empty')) document.getElementById('borrows-empty').classList.add('hidden');
        e.target.reset();
        updateDashboardStats(); 
        showToast('Transaksi berhasil disimpan!');
    }
});

// --- 7. THEME & APP INITIALIZATION ---
document.getElementById('theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
});

function initTheme() {
    const saved = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved ? saved === 'dark' : systemPrefersDark) {
        document.documentElement.classList.add('dark');
    }
}

// Init
(async () => {
    initTheme();

    if (window.dataSdk && window.dataSdk.init) {
        await window.dataSdk.init(handler);
    }

    if (window.lucide) {
        lucide.createIcons();
    }

    refreshDropdownsManually();
    updateDashboardStats();
})();