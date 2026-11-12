// =============================================
// NAVIGASI LAYER (ini harus jalan duluan)
// =============================================
function nextLayer(layerNumber) {
    document.querySelectorAll('.layer').forEach(layer => layer.classList.remove('active'));
    const target = document.getElementById('layer' + layerNumber);
    if (target) target.classList.add('active');
    
    try {
        if (layerNumber !== 5 && typeof confetti === 'function') {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        }
    } catch (e) {
        console.warn('Confetti error:', e);
    }
}

// =============================================
// MINI GAME — Tombol Kabur & Kotak Misteri
// =============================================
let dodgeCount = 0;
function dodgeButton() {
    if (document.body.classList.contains('view-mode') && dodgeCount < 3) {
        const btn = document.getElementById('runawayBtn');
        const container = document.getElementById('layer3');
        const maxX = container.clientWidth - btn.clientWidth;
        const maxY = container.clientHeight - btn.clientHeight;

        btn.style.position = 'absolute';
        btn.style.left = Math.floor(Math.random() * maxX) + 'px';
        btn.style.top = Math.floor(Math.random() * maxY) + 'px';
        dodgeCount++;
        if (dodgeCount === 3) btn.innerHTML = "Yaudah deh, nyerah. Boleh klik! 🙄";
    }
}

let winningBox = Math.floor(Math.random() * 3) + 1;
const zonkList = [
    { icon: "💸", text: "Zonk! Isinya tagihan Paylater 🤣" },
    { icon: "🐸", text: "Zonk! Isinya janji manis palsu 😜" },
    { icon: "🍜", text: "Zonk! Isinya bungkus mie instan kosong 😭" },
    { icon: "🧦", text: "Zonk! Isinya kaos kaki sebelah doang 🦨" },
    { icon: "🧀", text: "Zonk! Isinya gombalan basi wkwk 🧀" }
];

let game2Solved = false;

function passStage1() {
    document.getElementById('gameStage1').style.display = 'none';
    const stage2 = document.getElementById('gameStage2');
    stage2.style.display = 'block';
    
    // acak ulang winning box setiap stage dibuka
    winningBox = Math.floor(Math.random() * 3) + 1;
    showToast("Masuk Ronde 2! Tebak kotak yang benar 🎁");
}

function openBox(index) {
    if (game2Solved) return;

    const cards = document.querySelectorAll('.box-card');
    const card = cards[index - 1];
    const icon = document.getElementById('boxIcon' + index);
    const res = document.getElementById('boxRes' + index);
    const hint = document.getElementById('game2Hint');

    if (index === winningBox) {
        game2Solved = true;
        card.classList.remove('opened-zonk');
        card.classList.add('opened-win');
        icon.innerText = "🗝️✨";
        res.innerHTML = "<span style='color: #2b9348;'>Kunci Hati Ditemukan! 💖</span>";
        res.style.display = 'block';
        hint.innerHTML = "🎉 BINGOO!! Kamu berhasil nemuin kado aslinya! Silakan lanjut ke babak memori.";
        document.getElementById('stage2NextBtn').style.display = 'inline-block';
        
        try {
            if (typeof confetti === 'function') {
                confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
            }
        } catch(e) {}
    } else {
        card.classList.add('opened-zonk');
        const randomZonk = zonkList[Math.floor(Math.random() * zonkList.length)];
        icon.innerText = randomZonk.icon;
        res.innerText = randomZonk.text;
        res.style.display = 'block';
        hint.innerText = "Tetottt! Kotak " + (index === 1 ? 'A' : (index === 2 ? 'B' : 'C')) + " isinya zonk! Coba tebak kotak lain 😜";
    }
}

// =============================================
// GALERI & FOTO
// =============================================
function addGallerySlot() {
    const grid = document.getElementById('galleryGrid');
    const slot = document.createElement('div');
    slot.className = 'photo-slot';
    slot.innerHTML = `<input type="file" accept="image/*" class="uploader edit-only" onchange="previewImage(this)"><img src="" alt="" class="preview-img">`;
    grid.appendChild(slot);
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = input.nextElementSibling;
            img.src = e.target.result;
            img.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// =============================================
// TOAST NOTIFICATION
// =============================================
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// =============================================
// ANIMASI SPESIAL
// =============================================
function fireHearts() {
    try {
        if (typeof confetti === 'function') {
            const defaults = { spread: 360, ticks: 100, gravity: 0.6, decay: 0.94, startVelocity: 30, colors: ['#ff477e', '#ff9a9e', '#ff0a54'] };
            confetti({ ...defaults, particleCount: 50, scalar: 1.5 });
            confetti({ ...defaults, particleCount: 25, scalar: 2 });
        }
    } catch (e) {
        console.warn('Hearts confetti error:', e);
    }
}

function fireworksHeboh() {
    try {
        if (typeof confetti === 'function') {
            var duration = 20 * 1000;
            var animationEnd = Date.now() + duration;
            var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
            var interval = setInterval(function () {
                var timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                var particleCount = 60 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
            }, 250);
        }
    } catch (e) {
        console.warn('Fireworks error:', e);
    }
}

// =============================================
// SUPABASE CONFIG (dipisah biar gak ganggu UI)
// =============================================
const SUPABASE_URL = 'https://iqokqdzsvezrapqtrecg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_h-yn14F5rf8QNATaMejR_g_NVcu4nFb';
let db = null;

function getSupabase() {
    if (db) return db;
    const clientCreator = (window.supabase && window.supabase.createClient) || (typeof supabase !== 'undefined' && supabase.createClient);
    if (clientCreator) {
        db = clientCreator(SUPABASE_URL, SUPABASE_ANON_KEY);
        return db;
    }
    return null;
}

try {
    getSupabase();
    console.log('Supabase initialized!');
} catch (err) {
    console.error('Supabase init error:', err);
}

// =============================================
// UPLOAD FOTO KE SUPABASE STORAGE
// =============================================
async function uploadPhoto(file, folder, index) {
    const client = getSupabase();
    if (!client) throw new Error("Supabase client belum siap");

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${index}.${fileExt}`;

    const { data, error } = await client.storage
        .from('birthday-photos')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Upload error:', error);
        throw error;
    }

    const { data: urlData } = client.storage
        .from('birthday-photos')
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

// =============================================
// SIMPAN & BUAT LINK SHARE
// =============================================
async function saveAndShare() {
    const client = getSupabase();
    if (!client) {
        showToast("Supabase belum terhubung! Cek console browser.");
        return;
    }

    showToast("Sedang meracik kejutanmu... ⏳");

    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    progressContainer.style.display = 'block';
    progressBar.style.width = '10%';

    try {
        // 1. Kumpulkan semua file foto
        const mainFiles = [];
        document.querySelectorAll('.main-photos .uploader').forEach(input => {
            if (input.files && input.files[0]) mainFiles.push(input.files[0]);
        });

        const galleryFiles = [];
        document.querySelectorAll('.gallery-photos .uploader').forEach(input => {
            if (input.files && input.files[0]) galleryFiles.push(input.files[0]);
        });

        const totalFiles = mainFiles.length + galleryFiles.length;
        let uploaded = 0;

        // 2. Upload semua foto
        const mainPhotoUrls = [];
        if (totalFiles > 0) {
            progressText.innerText = `Mengupload foto (0/${totalFiles})...`;
            for (let i = 0; i < mainFiles.length; i++) {
                const url = await uploadPhoto(mainFiles[i], 'main', i);
                mainPhotoUrls.push(url);
                uploaded++;
                progressBar.style.width = (10 + (uploaded / totalFiles) * 60) + '%';
                progressText.innerText = `Mengupload foto (${uploaded}/${totalFiles})...`;
            }
        }

        const galleryPhotoUrls = [];
        for (let i = 0; i < galleryFiles.length; i++) {
            const url = await uploadPhoto(galleryFiles[i], 'gallery', i);
            galleryPhotoUrls.push(url);
            uploaded++;
            progressBar.style.width = (10 + (uploaded / totalFiles) * 60) + '%';
            progressText.innerText = `Mengupload foto (${uploaded}/${totalFiles})...`;
        }

        progressBar.style.width = '80%';
        progressText.innerText = 'Menyimpan data...';

        // 3. Simpan data teks + URL foto ke Supabase Database
        const { data, error } = await client
            .from('birthdays')
            .insert({
                text1: document.getElementById('text1').innerHTML,
                sub1: document.getElementById('sub1').innerHTML,
                text2: document.getElementById('text2').innerHTML,
                sub2: document.getElementById('sub2').innerHTML,
                text3: document.getElementById('text3').innerHTML,
                sub3: document.getElementById('sub3').innerHTML,
                text4: document.getElementById('text4').innerHTML,
                sub4: document.getElementById('sub4').innerHTML,
                text5: document.getElementById('text5').innerHTML,
                sub5: document.getElementById('sub5').innerHTML,
                long_message: document.getElementById('longMessage').innerHTML,
                main_photos: mainPhotoUrls,
                gallery_photos: galleryPhotoUrls
            })
            .select()
            .single();

        if (error) throw error;

        progressBar.style.width = '100%';
        progressText.innerText = 'Selesai! ✅';

        // 4. Generate link
        const shareId = data.id;
        const url = window.location.origin + window.location.pathname + '?id=' + shareId;
        const linkEl = document.getElementById('shareLink');
        linkEl.href = url;
        linkEl.innerText = url;
        document.getElementById('shareLinkContainer').style.display = 'block';
        showToast("Berhasil! Copy link di bawah 🎉");

    } catch (err) {
        console.error('Error:', err);
        progressBar.style.width = '0%';
        progressText.innerText = 'Gagal! Coba lagi.';
        showToast("Gagal menyimpan: " + (err.message || 'Unknown error'));
    }
}

// =============================================
// COPY LINK
// =============================================
function copyLink() {
    const link = document.getElementById('shareLink').innerText;
    navigator.clipboard.writeText(link).then(() => {
        showToast("Link berhasil dicopy! 📋");
    });
}

// =============================================
// CEK MODE (EDIT / VIEW)
// =============================================
function checkUrlMode() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
        document.body.classList.add('view-mode');
        loadDataFromSupabase(id);
    }
}

// =============================================
// LOAD DATA DARI SUPABASE
// =============================================
async function loadDataFromSupabase(id) {
    const client = getSupabase();
    if (!client) {
        showToast("Supabase belum terhubung!");
        return;
    }

    const { data, error } = await client
        .from('birthdays')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        showToast("Ucapan tidak ditemukan 😢");
        return;
    }

    // Load Texts
    document.getElementById('text1').innerHTML = data.text1;
    document.getElementById('sub1').innerHTML = data.sub1;
    document.getElementById('text2').innerHTML = data.text2;
    document.getElementById('sub2').innerHTML = data.sub2;
    document.getElementById('text3').innerHTML = data.text3;
    document.getElementById('sub3').innerHTML = data.sub3;
    document.getElementById('text4').innerHTML = data.text4;
    document.getElementById('sub4').innerHTML = data.sub4;
    document.getElementById('text5').innerHTML = data.text5;
    document.getElementById('sub5').innerHTML = data.sub5;
    document.getElementById('longMessage').innerHTML = data.long_message;

    // Load Main Photos
    const mainGrid = document.getElementById('mainPhotoGrid');
    mainGrid.innerHTML = '';
    (data.main_photos || []).forEach(src => {
        mainGrid.innerHTML += `<div class="photo-slot" style="border:none;"><img src="${src}" class="preview-img" style="display:block;"></div>`;
    });

    // Load Gallery Photos
    const galGrid = document.getElementById('galleryGrid');
    galGrid.innerHTML = '';
    (data.gallery_photos || []).forEach(src => {
        galGrid.innerHTML += `<div class="photo-slot" style="border:none;"><img src="${src}" class="preview-img" style="display:block;"></div>`;
    });
}

// =============================================
// INIT
// =============================================
window.onload = () => {
    for (let i = 0; i < 4; i++) addGallerySlot();
    checkUrlMode();
};
