// ==========================================
// PENGATUR SLIDE MASTER 
// ==========================================
const slides = ["login-section", "fireworks-section", "galaxy-section", "typewriter-section", "memories-section"];
let currentSlide = 0;
let fireworksStarted = false; 
let galaxyStarted = false;
let fallingHeartsStarted = false;

// KEMBALI MENGGUNAKAN NAVIGASI BAWAH
const navControls = document.getElementById("nav-controls");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");

function updateNav() {
    if (currentSlide === 0) {
        navControls.classList.add("hidden"); 
    } else {
        navControls.classList.remove("hidden");
        
        // Atur tombol Back (Hanya hilang di slide pertama)
        if (currentSlide === 0) {
            btnPrev.style.display = "none";
        } else {
            btnPrev.style.display = "flex";
        }
        
        // Atur tombol Next (DIHILANGKAN PAKSA PADA SLIDE SURAT & MEMORIES)
        if (currentSlide === 1 || currentSlide === 3 || currentSlide === 4) {
            btnNext.style.display = "none"; 
        } else {
            btnNext.style.display = "flex";
        }
    }
}

function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    document.getElementById(slides[currentSlide]).classList.add("hidden");
    currentSlide = index;
    document.getElementById(slides[currentSlide]).classList.remove("hidden");
    
    if (currentSlide === 0) {
        document.getElementById("door-left").classList.remove("open-left");
        document.getElementById("door-right").classList.remove("open-right");
        document.querySelector('.login-box').style.opacity = "1";
        document.getElementById("password-input").value = ""; 
    } else {
        document.getElementById("door-left").classList.add("open-left");
        document.getElementById("door-right").classList.add("open-right");
    }

    if (currentSlide === 1) document.getElementById("tap-hint").style.display = "block";
    
    if (currentSlide === 1 && !fireworksStarted) { startFireworks(); fireworksStarted = true; }
    if (currentSlide === 2 && !galaxyStarted) { startGalaxyAnimation(); galaxyStarted = true; }
    if (currentSlide === 3) { startTypewriter(); } 
    
    // Animasi jatuh-jatuh untuk tema surat & memories
    if ((currentSlide === 3 || currentSlide === 4) && !fallingHeartsStarted) { 
        createFallingHearts(); 
        fallingHeartsStarted = true; 
    }
    
    updateNav();
}

btnPrev.addEventListener("click", () => goToSlide(currentSlide - 1));
btnNext.addEventListener("click", () => goToSlide(currentSlide + 1));

// --- 1. LOGIN ---
const correctPassword = "dianlove"; 
document.getElementById("login-btn").addEventListener("click", checkPassword);
document.getElementById("password-input").addEventListener("keypress", (e) => { if (e.key === "Enter") checkPassword(); });

function checkPassword() {
    if (document.getElementById("password-input").value === correctPassword) {
        document.querySelector('.login-box').style.opacity = "0"; 
        document.getElementById("bg-music").play();
        document.getElementById("door-left").classList.add("open-left");
        document.getElementById("door-right").classList.add("open-right");
        setTimeout(() => { goToSlide(1); }, 1000); 
    } else { document.getElementById("error-msg").classList.remove("hidden"); }
}

function createLoginSparkles() {
    const loginSection = document.getElementById("login-section");
    const symbols = ["✨", "💛", "💕", "⭐"];
    setInterval(() => {
        if (loginSection.classList.contains("hidden")) return;
        const sp = document.createElement("div"); sp.className = "login-sparkle";
        sp.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        sp.style.left = Math.random() * 100 + "vw"; sp.style.animationDuration = (Math.random() * 4 + 5) + "s";
        loginSection.appendChild(sp); setTimeout(() => sp.remove(), 9000);
    }, 400);
}
createLoginSparkles();


// --- 2. KEMBANG API ---
const fwCanvas = document.getElementById("fireworks-canvas"); const fwCtx = fwCanvas.getContext("2d", { alpha: false }); 
const fwSection = document.getElementById("fireworks-section"); let fwRockets = [], fwParticles = [], fwStars = [], fwAnimationId;
const wishes = ["HAPPY BIRTHDAY\nDIAN! 🎉", "WISH YOU ALL\nTHE BEST", "SUKACITA & CINTA", "SUKSES SELALU ✨", "SEMOGA IMPIANMU\nTERCAPAI 🌟", "I LOVE YOU! 💕"];
let wishIndex = 0, lastTapTime = 0; const rainbowColors = ['#ff4081', '#00e5ff', '#76ff03', '#ffff00', '#ea80fc', '#ff6a00', '#00ffaa'];

const toGalaxyBtn = document.createElement("button"); toGalaxyBtn.innerHTML = "Lihat Kado Utamanya 🎁"; toGalaxyBtn.className = "pulse-btn"; 
toGalaxyBtn.style.position = "absolute"; toGalaxyBtn.style.bottom = "12%"; toGalaxyBtn.style.left = "50%"; toGalaxyBtn.style.transform = "translateX(-50%)"; toGalaxyBtn.style.display = "none"; toGalaxyBtn.style.zIndex = "100";
fwSection.appendChild(toGalaxyBtn); toGalaxyBtn.addEventListener("click", (e) => { e.stopPropagation(); goToSlide(2); });

fwSection.addEventListener("click", function(e) {
    if (Date.now() - lastTapTime < 50) return; lastTapTime = Date.now(); document.getElementById("tap-hint").style.display = "none";
    fwRockets.push(new FwRocket(e.clientX, e.clientY, wishes[wishIndex % wishes.length])); wishIndex++; if (wishIndex >= 5) toGalaxyBtn.style.display = "block";
});
for (let i=0; i<150; i++) fwStars.push({ x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, s: Math.random()*2+1.5, alpha: Math.random(), speed: Math.random()*1.5+0.5 });

class FwRocket {
    constructor(tx, ty, text) { this.tx = tx; this.ty = ty; this.x = window.innerWidth/2; this.y = window.innerHeight; this.text = text; this.color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)]; this.speed = 25; this.exploded = false; const angle = Math.atan2(this.ty - this.y, this.tx - this.x); this.vx = Math.cos(angle)*this.speed; this.vy = Math.sin(angle)*this.speed; this.lastX = this.x; this.lastY = this.y; }
    update() {
        this.lastX = this.x; this.lastY = this.y; this.x += this.vx; this.y += this.vy; 
        fwCtx.beginPath(); fwCtx.moveTo(this.lastX, this.lastY); fwCtx.lineTo(this.x, this.y); fwCtx.strokeStyle = this.color; fwCtx.lineWidth = 4; fwCtx.lineCap = "round"; fwCtx.globalAlpha = 1; fwCtx.stroke();
        if (this.y <= this.ty && !this.exploded) { this.exploded = true; for(let i=0; i<80; i++) { fwParticles.push(new FwParticle(this.x, this.y, rainbowColors[Math.floor(Math.random() * rainbowColors.length)])); } showWishText(this.text, this.color, this.x, this.y); }
    }
}
class FwParticle {
    constructor(x, y, color) { this.x = x; this.y = y; this.color = color; const angle = Math.random()*Math.PI*2; const speed = Math.random()*12+2; this.vx = Math.cos(angle)*speed; this.vy = Math.sin(angle)*speed; this.alpha = 1; this.friction = 0.95; this.gravity = 0.08; this.lastX = this.x; this.lastY = this.y; this.decay = Math.random() * 0.015 + 0.01; }
    update() { this.lastX = this.x; this.lastY = this.y; this.vx *= this.friction; this.vy *= this.friction; this.vy += this.gravity; this.x += this.vx; this.y += this.vy; this.alpha -= this.decay; fwCtx.beginPath(); fwCtx.moveTo(this.lastX, this.lastY); fwCtx.lineTo(this.x, this.y); fwCtx.strokeStyle = this.color; fwCtx.lineWidth = 2; fwCtx.lineCap = "round"; fwCtx.globalAlpha = this.alpha; fwCtx.stroke(); }
}
function showWishText(text, color, x, y) { const h1 = document.createElement("h1"); h1.className = "glow-text"; h1.innerHTML = text.replace(/\n/g, '<br>'); h1.style.left = (x + (Math.random()-0.5)*40)+"px"; h1.style.top = (y + (Math.random()-0.5)*40)+"px"; h1.style.textShadow = `0 0 10px ${color}, 0 0 25px ${color}`; document.getElementById("dynamic-text").appendChild(h1); setTimeout(() => h1.remove(), 2500); }
function startFireworks() {
    const dpr = window.devicePixelRatio || 1; fwCanvas.width = window.innerWidth * dpr; fwCanvas.height = window.innerHeight * dpr; fwCanvas.style.width = window.innerWidth + 'px'; fwCanvas.style.height = window.innerHeight + 'px'; fwCtx.scale(dpr, dpr);
    function animate() { fwAnimationId = requestAnimationFrame(animate); fwCtx.globalCompositeOperation = 'destination-out'; fwCtx.fillStyle = 'rgba(0, 0, 0, 0.15)'; fwCtx.fillRect(0, 0, window.innerWidth, window.innerHeight); fwCtx.globalCompositeOperation = 'source-over'; fwCtx.fillStyle = 'white'; fwStars.forEach(s => { fwCtx.globalAlpha = s.alpha; fwCtx.fillRect(s.x, s.y, s.s, s.s); s.y -= s.speed; if (s.y < 0) { s.y = window.innerHeight; s.x = Math.random() * window.innerWidth; } s.alpha += (Math.random()-0.5)*0.1; if(s.alpha < 0.1) s.alpha=0.1; if(s.alpha > 1) s.alpha=1; }); fwCtx.globalAlpha = 1; for (let i = fwRockets.length-1; i>=0; i--) { if (fwRockets[i].exploded) fwRockets.splice(i, 1); else fwRockets[i].update(); } for (let i = fwParticles.length-1; i>=0; i--) { if (fwParticles[i].alpha <= 0) fwParticles.splice(i, 1); else fwParticles[i].update(); } if (fwParticles.length > 500) fwParticles.splice(0, fwParticles.length - 500); } animate();
}

// --- 3. GALAKSI 3D ---
const gxCanvas = document.getElementById("galaxy-canvas"); const gxCtx = gxCanvas.getContext("2d", { alpha: false }); let gxAnimationId, gxParticles = [], bgStars = [], orbitElements = [], gxTime = 0; let galaxyStartTime = 0; let introPhase = true;
const orbitData = [ { emoji: "🧸", label: "Tempat Nyaman", title: "Tempat Nyaman", text: "Berada di dekatmu adalah tempat paling aman di seluruh galaksi." }, { emoji: "💖", label: "Dua Jiwa", title: "Dua Jiwa Satu Hati", text: "Semesta setuju menyatukan hati kita dalam satu orbit yang sama." }, { emoji: "✨", label: "Senyum Manismu", title: "Senyum Manismu", text: "Senyummu itu bagaikan rasi bintang terang, mengusir mendung." }, { emoji: "💌", label: "Pesan Rahasia", title: "Pesan Rahasia", text: "Mungkin aku tidak bilang setiap detik, tapi ingatlah I LOVE YOU." }, { emoji: "🌹", label: "Cintaku Padamu", title: "Cintaku Padamu", text: "Seperti galaksi yang terus meluas, begitu juga perasaanku ke kamu." }, { emoji: "🎀", label: "Selamanya", title: "Selamanya", text: "Terima kasih sudah lahir ke dunia. Aku ingin merayakan hari ini selamanya." } ];
function initGalaxy() { const dpr = window.devicePixelRatio || 1; const w = window.innerWidth; const h = window.innerHeight; gxCanvas.width = w * dpr; gxCanvas.height = h * dpr; gxCanvas.style.width = w + "px"; gxCanvas.style.height = h + "px"; gxCtx.scale(dpr, dpr); gxParticles = []; bgStars = []; for(let i=0; i<300; i++) bgStars.push({ x: (Math.random()-0.5)*w*2, y: (Math.random()-0.5)*h*2, z: Math.random()*2000 }); for(let i=0; i<1500; i++) { let targetR = Math.random()*(Math.min(w, h)*0.7); gxParticles.push({ angle: Math.random()*Math.PI*20, targetRadius: targetR, radius: targetR + 1000 + Math.random()*1000, speed: Math.random()*0.003+0.001, size: Math.random()*2+0.5, color: `hsl(${Math.random()*60+260}, 100%, 70%)` }); } if(orbitElements.length === 0) createOrbitingElements(); }
function createOrbitingElements() { const container = document.getElementById("orbit-container"); orbitData.forEach((data, i) => { const item = document.createElement("div"); item.className = "orbit-item"; item.innerHTML = `<div class="orbit-icon-sphere">${data.emoji}</div><div class="orbit-label">${data.label}</div>`; item.addEventListener("click", () => { document.getElementById("popup-emoji").innerText = data.emoji; document.getElementById("popup-title").innerText = data.title; document.getElementById("popup-text").innerText = data.text; document.getElementById("popup-modal").classList.remove("hidden"); }); container.appendChild(item); orbitElements.push({ el: item, offset: i * (Math.PI * 2 / orbitData.length) }); }); }
function startGalaxyAnimation() { if(gxAnimationId) cancelAnimationFrame(gxAnimationId); initGalaxy(); galaxyStartTime = Date.now(); introPhase = true; document.querySelector('.center-heart').classList.remove('show'); document.getElementById('orbit-container').classList.remove('show'); animateGalaxy(); window.addEventListener('resize', initGalaxy); }
function animateGalaxy() { const w = window.innerWidth; const h = window.innerHeight; gxAnimationId = requestAnimationFrame(animateGalaxy); gxTime += 0.05; const cx = w/2, cy = h/2; let elapsed = Date.now() - galaxyStartTime; let introProgress = Math.min(1, elapsed / 4000); gxCtx.globalAlpha = 1; gxCtx.fillStyle = 'rgba(5, 2, 10, 0.4)'; gxCtx.fillRect(0, 0, w, h); gxCtx.fillStyle = 'white'; bgStars.forEach(s => { let starSpeed = 2 + (1 - introProgress) * 15; s.z -= starSpeed; if(s.z <= 0) { s.z = 2000; s.x = (Math.random()-0.5)*w*2; s.y = (Math.random()-0.5)*h*2; } const scale = 500 / s.z; gxCtx.globalAlpha = Math.min(1, scale * 0.5); gxCtx.fillRect(cx + s.x*scale, cy + s.y*scale, scale*1.5, scale*1.5); }); if (introProgress > 0.4) { gxCtx.globalAlpha = (introProgress - 0.4) * 1.6; const grd = gxCtx.createRadialGradient(cx, cy, 0, cx, cy, 180); grd.addColorStop(0, 'rgba(255,255,255,0.9)'); grd.addColorStop(0.08, 'rgba(0,0,0,1)'); grd.addColorStop(0.2, 'rgba(148,0,211,0.6)'); grd.addColorStop(0.5, 'rgba(255,20,147,0.2)'); grd.addColorStop(1, 'transparent'); gxCtx.fillStyle = grd; gxCtx.fillRect(cx-180, cy-180, 360, 360); } gxParticles.forEach(p => { let swirlSpeed = p.speed + (1 - introProgress) * 0.1; p.angle += swirlSpeed; p.radius += (p.targetRadius - p.radius) * 0.05; const px = cx + Math.cos(p.angle) * p.radius; const py = cy + Math.sin(p.angle) * p.radius * 0.25; gxCtx.globalAlpha = 0.8; gxCtx.fillStyle = p.color; gxCtx.fillRect(px, py, p.size, p.size); }); if (introProgress >= 1 && introPhase) { introPhase = false; document.querySelector('.center-heart').classList.add('show'); document.getElementById('orbit-container').classList.add('show'); } if (!introPhase) { const orbitSpeed = gxTime * 0.05; const radiusX = Math.min(w * 0.4, 400); const radiusY = Math.min(h * 0.15, 150); orbitElements.forEach(item => { const angle = orbitSpeed + item.offset; const x = Math.cos(angle) * radiusX; const y = Math.sin(angle) * radiusY; const scale = (Math.sin(angle) + 2.5) / 3.5; const zIndex = Math.round(scale * 100); item.el.style.transform = `translate(-50%, -50%) translate(${cx + x}px, ${cy + y}px) scale(${scale})`; item.el.style.zIndex = zIndex; }); } }
document.getElementById("close-popup").addEventListener("click", () => document.getElementById("popup-modal").classList.add("hidden"));

// --- 4. SURAT TERKETIK ---
let typingActive = false; let typingTimeout;
function startTypewriter() { const textElement = document.getElementById("typewriter-text"); const btnToMemories = document.getElementById("btn-to-memories"); textElement.innerHTML = ""; btnToMemories.classList.add("hidden"); const pesanSurat = "Happy Birthday, Dian! 🎉\n\nTeruntuk Dian sayang...\n\nDi hari ulang tahunmu yang spesial ini, aku cuma mau bilang terima kasih banyak udah hadir dan bertahan di hidupku. Kamu selalu jadi alasan terbaik buat aku tersenyum setiap harinya.\n\nSemoga semua yang kamu impikan dan cita-citakan bisa segera tercapai. Jangan lupa untuk selalu bahagia ya! Kita akan terus sama-sama bikin kenangan indah. I Love You to the moon and back! 💕"; let indexHuruf = 0; typingActive = true; function ngetik() { if (!typingActive || currentSlide !== 3) return; if (indexHuruf < pesanSurat.length) { if (pesanSurat.charAt(indexHuruf) === '\n') { textElement.innerHTML += "<br>"; } else { textElement.innerHTML += pesanSurat.charAt(indexHuruf); } indexHuruf++; typingTimeout = setTimeout(ngetik, 40); } else { btnToMemories.classList.remove("hidden"); } } clearTimeout(typingTimeout); ngetik(); }
document.getElementById("btn-to-memories").addEventListener("click", () => { goToSlide(4); });

// --- 5. MEMORIES ---
const memoryData = [
    { img: "img/foto1.jpeg", title: "Hari Pertama", text: "Senyummu selalu berhasil membuat hariku lebih cerah." },
    { img: "img/foto2.jpeg", title: "Bersamamu", text: "Setiap detik bersamamu adalah kenangan manis." },
    { img: "img/foto3.jpeg", title: "Selalu Sama", text: "Terima kasih sudah mau berbagi cerita dan tawa." },
    { img: "img/foto4.jpeg", title: "Nyaman", text: "Di pelukanmu aku menemukan tempatku pulang." },
    { img: "img/foto5.jpeg", title: "Cinta Kamu", text: "Semoga kita terus mengukir kenangan indah lainnya. I love you!" }
];

function openMemory(index) {
    const data = memoryData[index];
    document.getElementById("memory-img").src = data.img;
    document.getElementById("memory-title").innerText = data.title;
    document.getElementById("memory-text").innerText = data.text;
    document.getElementById("memory-modal").classList.remove("hidden");
}
document.getElementById("close-memory").addEventListener("click", () => { document.getElementById("memory-modal").classList.add("hidden"); });

// DEKORASI JATUH (Hati & Bunga)
function createFallingHearts() {
    setInterval(() => {
        if (currentSlide !== 3 && currentSlide !== 4) return;
        const heart = document.createElement("div"); heart.classList.add("heart"); 
        heart.innerHTML = ["❤️", "🌸", "✨"][Math.floor(Math.random()*3)];
        heart.style.left = Math.random()*100+"vw"; 
        heart.style.animationDuration = Math.random()*3+4+"s";
        document.body.appendChild(heart); 
        setTimeout(() => heart.remove(), 7000);
    }, 500);
}

// MUSIK
const musicBtn = document.getElementById("music-toggle");
musicBtn.addEventListener("click", () => { const bgMusic = document.getElementById("bg-music"); if (bgMusic.paused) { bgMusic.play(); musicBtn.innerHTML = '<i class="fas fa-music"></i>'; } else { bgMusic.pause(); musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'; } });
