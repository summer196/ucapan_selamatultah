// =============================================
// NAVIGASI LAYER (ini harus jalan duluan)
// =============================================
function nextLayer(layerNumber) {
    playMusic();
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
// BACKGROUND MUSIC CONTROLLER
// =============================================
let musicStarted = false;

function playMusic() {
    const audio = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    const text = document.getElementById('musicText');
    if (!audio) return;

    audio.play().then(() => {
        musicStarted = true;
        if (toggle) toggle.classList.add('playing');
        if (text) text.innerText = 'Musik: ON 🎵';
    }).catch(err => {
        console.log('Autoplay waiting for user interaction:', err);
    });
}

function pauseMusic() {
    const audio = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    const text = document.getElementById('musicText');
    if (!audio) return;

    audio.pause();
    if (toggle) toggle.classList.remove('playing');
    if (text) text.innerText = 'Musik: OFF 🔇';
}

function toggleMusic() {
    const audio = document.getElementById('bgMusic');
    if (!audio) return;
    if (audio.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
}

// Auto-start on first user interaction anywhere on the page
document.addEventListener('click', function startOnFirstInteraction() {
    if (!musicStarted) {
        playMusic();
    }
}, { once: true });

// =============================================
// MINI GAME — Tombol Kabur (10x) & Kotak Misteri (10 Kotak)
// =============================================
let dodgeCount = 0;
const dodgeMessages = [
    "Wleee gak kena! 😜",
    "Eits kabur lagi! 💨",
    "Masa nangkep tombol aja gabisa? 😂",
    "Hampir dapet tuh, coba lagi! 🏃‍♂️",
    "Kecepetan tangan kamu kurang nih! ⚡",
    "Wkwkwk capek ya? Masih separuh jalan! 🤪",
    "Ayo semangat, dikit lagi! 🔥",
    "Yakin bisa nangkep? 😏",
    "Satu kali lagi nih beneran! 😤",
    "Ampunnn ampun capek lari, boleh diklik sekarang! 🥺🎁"
];

function dodgeButton() {
    if (document.body.classList.contains('view-mode') && dodgeCount < 10) {
        const btn = document.getElementById('runawayBtn');
        const container = document.getElementById('layer3');
        const maxX = Math.max(10, container.clientWidth - btn.clientWidth - 30);
        const maxY = Math.max(10, container.clientHeight - btn.clientHeight - 30);

        btn.style.position = 'absolute';
        btn.style.left = Math.floor(Math.random() * maxX) + 'px';
        btn.style.top = Math.floor(Math.random() * maxY) + 'px';
        
        btn.innerHTML = dodgeMessages[dodgeCount] || "🎁 Tangkap Aku!";
        dodgeCount++;

        if (dodgeCount >= 10) {
            btn.innerHTML = "Ampunnn capek! Boleh diklik sekarang 🥺🎁";
            btn.style.background = "linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)";
        }
    }
}

let winningBox = Math.floor(Math.random() * 10) + 1;
const zonkList = [
    { icon: "💸", text: "Tagihan ShopeePay 🤣" },
    { icon: "🐸", text: "Janji manis palsu 😜" },
    { icon: "🍜", text: "Bungkus mie kosong 😭" },
    { icon: "🧦", text: "Kaos kaki bolong 🦨" },
    { icon: "🧀", text: "Gombalan basi wkwk 🧀" },
    { icon: "🍽️", text: "Voucher cuci piring 🍽️" },
    { icon: "💨", text: "Angin doang wkwk 💨" },
    { icon: "📸", text: "Foto aib pas mangap 😜" },
    { icon: "🐻", text: "Kupon peluk tapi bayar 5000 🐻" },
    { icon: "💔", text: "Harapan palsu 🗿" },
    { icon: "🪳", text: "Kecoa terbang kabur 🪳" },
    { icon: "🥱", text: "Rasa ngantuk tak tertahan 😴" }
];

let game2Solved = false;

function passStage1() {
    if (document.body.classList.contains('view-mode') && dodgeCount < 10) {
        dodgeButton();
        return;
    }
    document.getElementById('gameStage1').style.display = 'none';
    const stage2 = document.getElementById('gameStage2');
    stage2.style.display = 'block';
    
    // acak ulang winning box di antara 1 - 10
    winningBox = Math.floor(Math.random() * 10) + 1;
    showToast("Masuk Ronde 2! Tebak 1 dari 10 kotak 🎁");
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
        res.innerHTML = "<span style='color: #2b9348; font-weight: bold;'>Kunci Hati! 💖</span>";
        res.style.display = 'block';
        hint.innerHTML = "🎉 BINGOO!! Di antara 10 kotak, kamu nemuin Kunci Hati yang asli! Silakan lanjut ke memori kita.";
        document.getElementById('stage2NextBtn').style.display = 'inline-block';
        
        try {
            if (typeof confetti === 'function') {
                confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });
            }
        } catch(e) {}
    } else {
        card.classList.add('opened-zonk');
        const randomZonk = zonkList[(index - 1) % zonkList.length];
        icon.innerText = randomZonk.icon;
        res.innerText = randomZonk.text;
        res.style.display = 'block';
        hint.innerText = "Tetottt! Kotak " + index + " isinya zonk! Coba tebak kotak lain 😜";
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
// UPLOAD FOTO KE SUPABASE STORAGE (DENGAN FALLBACK BASE64)
// =============================================
async function uploadPhoto(file, folder, index) {
    const client = getSupabase();
    
    // Coba upload ke Supabase Storage terlebih dahulu
    if (client) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Date.now()}_${index}.${fileExt}`;

            const { data, error } = await client.storage
                .from('birthday-photos')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (!error) {
                const { data: urlData } = client.storage
                    .from('birthday-photos')
                    .getPublicUrl(fileName);
                if (urlData && urlData.publicUrl) {
                    return urlData.publicUrl;
                }
            } else {
                console.warn('Supabase storage upload gagal, beralih ke fallback base64:', error.message);
            }
        } catch (storageErr) {
            console.warn('Storage exception, beralih ke fallback base64:', storageErr);
        }
    }

    // Fallback otomatis ke Base64 (Data URL) jika bucket belum dibuat atau storage bermasalah
    // Ini menjamin foto tetap tersimpan & tidak pernah gagal!
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
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
        
        // Hapus atribut contenteditable agar 100% terkunci permanen
        document.querySelectorAll('[contenteditable]').forEach(el => {
            el.removeAttribute('contenteditable');
        });

        // Hapus semua uploader foto agar tidak bisa disentuh
        document.querySelectorAll('input.uploader').forEach(input => {
            input.remove();
        });

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

    // Pastikan lagi setelah render teks, semua contenteditable benar-benar hilang
    document.querySelectorAll('[contenteditable]').forEach(el => {
        el.removeAttribute('contenteditable');
    });

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
// AMBIENT FALLING HEARTS & CONFETTI ENGINE
// =============================================
function initAmbientParticles() {
    const canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const hearts = ['💖', '💕', '❤️', '🌸', '✨'];
    const confettiColors = ['#ff477e', '#ff9a9e', '#ffd166', '#06d6a0', '#118ab2', '#ff70a6', '#ffffff'];

    const particleCount = 45;
    const particles = [];

    function createParticle(randomY = false) {
        const isHeart = Math.random() > 0.45;
        return {
            x: Math.random() * width,
            y: randomY ? Math.random() * height : -30,
            size: isHeart ? (16 + Math.random() * 14) : (6 + Math.random() * 8),
            speedY: 1.0 + Math.random() * 2.0,
            angle: Math.random() * Math.PI * 2,
            angularSpeed: (Math.random() - 0.5) * 0.05,
            isHeart: isHeart,
            symbol: hearts[Math.floor(Math.random() * hearts.length)],
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            opacity: 0.65 + Math.random() * 0.35,
            oscillationSpeed: 0.02 + Math.random() * 0.03,
            oscillationDistance: 15 + Math.random() * 25,
            baseX: Math.random() * width,
            time: Math.random() * 100
        };
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(true));
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.time += p.oscillationSpeed;
            p.y += p.speedY;
            p.x = p.baseX + Math.sin(p.time) * p.oscillationDistance;
            p.angle += p.angularSpeed;

            ctx.save();
            ctx.globalAlpha = p.opacity;

            if (p.isHeart) {
                ctx.font = `${p.size}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.symbol, p.x, p.y);
            } else {
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillStyle = p.color;
                const scaleY = Math.cos(p.time * 2);
                ctx.fillRect(-p.size / 2, (-p.size * scaleY) / 2, p.size, p.size * scaleY);
            }

            ctx.restore();

            if (p.y > height + 40 || p.x < -40 || p.x > width + 40) {
                particles[i] = createParticle(false);
                particles[i].baseX = Math.random() * width;
            }
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

// =============================================
// INIT
// =============================================
window.onload = () => {
    for (let i = 0; i < 4; i++) addGallerySlot();
    checkUrlMode();
    initAmbientParticles();
};
