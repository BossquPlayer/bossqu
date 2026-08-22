// =======================
// Variabel Utama
// =======================
const audioTab = document.getElementById("playlist-audio");
const videoTab = document.getElementById("playlist-video");
const player = document.getElementById("player");
let daftarLagu = [];
let currentIndex = 0;

// ⚠️ SETELAH BACA INI, GANTI URL DI BAWAH DENGAN YANG BENER!
// 1. Buka browser, ketik: https://bossqu-api.vercel.app/api/playlist
// 2. Kalo muncul JSON (list file) → URL ini bener.
// 3. Kalo error 404/500 → URL ini SALAH atau backend mati.
//    Cari URL backend kamu yang baru (Render/Railway/Vercel API)
let API_BASE = "https://bossqu-api.vercel.app/api"; 

console.log("🚀 Bossqu Player Initialized");
console.log("📡 API_BASE Target:", API_BASE);

// =======================
// Load Playlist
// =======================
async function loadPlaylist() {
  if (!API_BASE || API_BASE.includes("undefined")) {
    console.error("❌ ERROR: API_BASE tidak didefinisikan!");
    showError("API_BASE tidak didefinisikan. Cek script.js!");
    return;
  }

  // ⚠️ INI PENTING: Pastikan pake backtick (`) untuk template string
  const url = `\${API_BASE}/playlist`;
  console.log("📡 Mencoba fetch ke URL:", url);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Jangan tambah Authorization dulu, kecuali backend kamu butuh
      },
      mode: 'cors' // Penting untuk cross-origin request
    });

    if (!res.ok) {
      console.error(`❌ HTTP Error: ${res.status} ${res.statusText}`);
      console.error("Detail response:", await res.text());
      throw new Error(`HTTP \${res.status}`);
    }

    const data = await res.json();
    console.log("✅ Data playlist berhasil dimuat:", data);
    daftarLagu = data;

    const audioDiv = document.getElementById("playlist-audio");
    const videoDiv = document.getElementById("playlist-video");

    if (!audioDiv || !videoDiv) {
      console.error("❌ Element playlist tidak ditemukan di HTML!");
      return;
    }

    audioDiv.innerHTML = "";
    videoDiv.innerHTML = "";

    if (!data || data.length === 0) {
      audioDiv.innerHTML = "<p>Playlist kosong.</p>";
      return;
    }

    data.forEach(file => {
      const fileName = typeof file === 'string' ? file : (file.name || file.filename);
      
      const item = document.createElement("div");
      item.className = "playlist-item";
      item.textContent = fileName;
      item.style.cursor = "pointer";
      item.style.padding = "8px";
      item.style.borderBottom = "1px solid #eee";
      item.onclick = () => playFile(fileName);

      if (fileName.endsWith(".mp3") || fileName.endsWith(".wav")) {
        audioDiv.appendChild(item);
      } else if (fileName.endsWith(".mp4") || fileName.endsWith(".webm")) {
        videoDiv.appendChild(item);
      } else {
        // File lain masuk ke audio
        audioDiv.appendChild(item); 
      }
    });

  } catch (err) {
    console.error("❌ Kesalahan total saat load playlist:", err);
    showError(`Gagal muat playlist: \${err.message}. Cek Console (F12).`);
  }
}

function showError(message) {
  const audioDiv = document.getElementById("playlist-audio");
  if (audioDiv) {
    audioDiv.innerHTML = `<p style="color:red; font-weight:bold;">\${message}</p>`;
  }
}

function playFile(file) {
  if (!API_BASE) {
    alert("API_BASE tidak ditemukan!");
    return;
  }

  // ⚠️ Sesuaikan path ini dengan backend kamu
  // Kalo file disimpan di folder 'files', mungkin jadi: ${API_BASE}/files/${file}
  const src = `${API_BASE}/${file}`;
  console.log("▶️ Memutar:", src);
  
  player.src = src;
  player.play().catch(e => {
    console.error("Gagal play media:", e);
    alert("Gagal memutar file. Cek Console.");
  });

  const infoEl = document.getElementById("infoLagu");
  if (infoEl) infoEl.innerText = file;
  
  if (typeof toggleLiveIndicator === 'function') {
    toggleLiveIndicator("active");
  }
}

// =======================
// Init
// =======================
loadPlaylist();
