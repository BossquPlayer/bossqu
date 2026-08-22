// =======================
// Variabel utama
// =======================
const audioTab = document.getElementById("playlist-audio");
const videoTab = document.getElementById("playlist-video");
const player = document.getElementById("player");
let daftarLagu = [];
let currentIndex = 0;

// ⚠️ FIX: Baca dari variable global atau fallback
// Kalo kamu set variable di Vercel Settings, biasanya ga langsung muncul di window.
// Solusi terbaik untuk vanilla JS: hardcode URL di sini (sementara) atau baca dari data-attribute di HTML.
// Disini aku kasih fallback ke URL kamu.

// Cara 1 (Recommended untuk Vanilla JS): Hardcode URL di sini (ganti ke URL API kamu)
let API_BASE = "https://bossqu-api.vercel.app/api"; 

// Cara 2 (Advanced): Kalo mau baca dari HTML, buka index.html dan tambahin:
// <body data-api-base="https://bossqu-api.vercel.app/api">
// Lalu uncomment baris di bawah ini:
// const html = document.documentElement;
// API_BASE = html.getAttribute('data-api-base') || API_BASE;

console.log("🚀 API_BASE yang dipakai:", API_BASE);

// =======================
// Load Playlist
// =======================
async function loadPlaylist() {
  if (!API_BASE) {
    console.error("API_BASE tidak didefinisikan!");
    alert("Error: Backend tidak terhubung.");
    return;
  }

  try {
    const res = await fetch(`\${API_BASE}/playlist`);
    
    if (!res.ok) throw new Error(`HTTP Error: \${res.status}`);
    
    const data = await res.json();
    daftarLagu = data;

    const audioDiv = document.getElementById("playlist-audio");
    const videoDiv = document.getElementById("playlist-video");
    
    if (!audioDiv || !videoDiv) {
      console.error("Element playlist tidak ditemukan!");
      return;
    }

    audioDiv.innerHTML = "";
    videoDiv.innerHTML = "";

    if (!data || data.length === 0) {
      audioDiv.innerHTML = "<p>Playlist kosong atau backend belum siap.</p>";
      return;
    }

    data.forEach(file => {
      const fileName = typeof file === 'string' ? file : file.name;
      
      const item = document.createElement("div");
      item.className = "playlist-item";
      item.textContent = fileName;
      item.onclick = () => playFile(fileName);

      if (fileName.endsWith(".mp3") || fileName.endsWith(".wav")) {
        audioDiv.appendChild(item);
      } else if (fileName.endsWith(".mp4") || fileName.endsWith(".webm")) {
        videoDiv.appendChild(item);
      } else {
        audioDiv.appendChild(item); 
      }
    });
  } catch (err) {
    console.error("❌ Error fetch playlist:", err);
    const errorDiv = document.getElementById("playlist-audio") || document.body;
    errorDiv.innerHTML = `<p style="color:red">Gagal muat playlist. Cek Console (F12).<br>
    Pastikan API_BASE benar dan backend jalan.</p>`;
  }
}

function playFile(file) {
  player.src = `${API_BASE}/${file}`;
  
  player.play().catch(e => {
    console.error("Gagal play:", e);
    alert("Gagal memutar file.");
  });

  const infoEl = document.getElementById("infoLagu");
  if (infoEl) infoEl.innerText = file;
  
  // Pastikan fungsi ini ada di script.js atau di file lain
  if (typeof toggleLiveIndicator === 'function') {
    toggleLiveIndicator("active");
  }
}

// =======================
// Init
// =======================
loadPlaylist();
