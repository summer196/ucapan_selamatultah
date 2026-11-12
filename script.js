const firebaseConfig = {
    apiKey: "GANTI_DENGAN_API_KEY_ANDA",
    authDomain: "GANTI_DENGAN_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://GANTI_DENGAN_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "GANTI_DENGAN_PROJECT_ID"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

window.onload = () => {
    for(let i=0; i<4; i++) addGallerySlot();
    checkUrlMode();
};

function nextLayer(layerNumber) {
    document.querySelectorAll('.layer').forEach(layer => layer.classList.remove('active'));
    document.getElementById('layer' + layerNumber).classList.add('active');
    if(layerNumber !== 5) confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } }); // Confetti kecil tiap next
}

let dodgeCount = 0;
function dodgeButton() {
    // Tombol hanya lari 3 kali di Mode Lihat agar tidak frustasi
    if (document.body.classList.contains('view-mode') && dodgeCount < 3) {
        const btn = document.getElementById('runawayBtn');
        const container = document.getElementById('layer3');
        const maxX = container.clientWidth - btn.clientWidth;
        const maxY = container.clientHeight - btn.clientHeight;
        
        btn.style.position = 'absolute';
        btn.style.left = Math.floor(Math.random() * maxX) + 'px';
        btn.style.top = Math.floor(Math.random() * maxY) + 'px';
        dodgeCount++;
        if(dodgeCount === 3) btn.innerHTML = "Yaudah deh, nyerah. Boleh klik! 🙄";
    }
}

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
        reader.onload = function(e) {
            const img = input.nextElementSibling;
            img.src = e.target.result;
            img.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

function saveAndShare() {
    showToast("Sedang meracik kejutanmu...");
    const data = {
        texts: {
            t1: document.getElementById('text1').innerHTML, s1: document.getElementById('sub1').innerHTML,
            t2: document.getElementById('text2').innerHTML, s2: document.getElementById('sub2').innerHTML,
            t3: document.getElementById('text3').innerHTML, s3: document.getElementById('sub3').innerHTML,
            t4: document.getElementById('text4').innerHTML, s4: document.getElementById('sub4').innerHTML,
            t5: document.getElementById('text5').innerHTML, s5: document.getElementById('sub5').innerHTML,
            msg: document.getElementById('longMessage').innerHTML
        },
        mainPhotos: [], galleryPhotos: []
    };

    document.querySelectorAll('.main-photos .preview-img').forEach(img => { if(img.src && img.src !== window.location.href) data.mainPhotos.push(img.src); });
    document.querySelectorAll('.gallery-photos .preview-img').forEach(img => { if(img.src && img.src !== window.location.href) data.galleryPhotos.push(img.src); });

    const newRef = database.ref('birthdays').push();
    newRef.set(data).then(() => {
        const shareId = newRef.key;
        const url = window.location.origin + window.location.pathname + "?id=" + shareId;
        const linkEl = document.getElementById('shareLink');
        linkEl.href = url; linkEl.innerText = url;
        document.getElementById('shareLinkContainer').style.display = 'block';
        showToast("Berhasil! Copy link di bawah.");
    }).catch(error => showToast("Gagal menyimpan."));
}

function checkUrlMode() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
        document.body.classList.add('view-mode');
        loadDataFromFirebase(id);
    }
}

function loadDataFromFirebase(id) {
    database.ref('birthdays/' + id).once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Load Texts
            document.getElementById('text1').innerHTML = data.texts.t1; document.getElementById('sub1').innerHTML = data.texts.s1;
            document.getElementById('text2').innerHTML = data.texts.t2; document.getElementById('sub2').innerHTML = data.texts.s2;
            document.getElementById('text3').innerHTML = data.texts.t3; document.getElementById('sub3').innerHTML = data.texts.s3;
            document.getElementById('text4').innerHTML = data.texts.t4; document.getElementById('sub4').innerHTML = data.texts.s4;
            document.getElementById('text5').innerHTML = data.texts.t5; document.getElementById('sub5').innerHTML = data.texts.s5;
            document.getElementById('longMessage').innerHTML = data.texts.msg;
            
            // Load Photos
            const mainGrid = document.getElementById('mainPhotoGrid'); mainGrid.innerHTML = '';
            (data.mainPhotos || []).forEach(src => mainGrid.innerHTML += `<div class="photo-slot" style="border:none;"><img src="${src}" class="preview-img" style="display:block;"></div>`);

            const galGrid = document.getElementById('galleryGrid'); galGrid.innerHTML = '';
            (data.galleryPhotos || []).forEach(src => galGrid.innerHTML += `<div class="photo-slot" style="border:none;"><img src="${src}" class="preview-img" style="display:block;"></div>`);
        }
    });
}

// Animasi Khusus
function fireHearts() {
    const defaults = { spread: 360, ticks: 100, gravity: 0, decay: 0.94, startVelocity: 30, shapes: ['heart'], colors: ['#ff477e', '#ff9a9e'] };
    confetti({ ...defaults, particleCount: 50, scalar: 2 });
    confetti({ ...defaults, particleCount: 25, scalar: 3 });
}

function fireworksHeboh() {
    var duration = 20 * 1000; var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        var particleCount = 60 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);
}