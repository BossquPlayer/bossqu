// =======================
// Variabel utama
// =======================
const audioTab = document.getElementById("playlist-audio");
const videoTab = document.getElementById("playlist-video");
const player = document.getElementById("player");
let daftarLagu = [];
let currentIndex = 0;

// ⚠️ FIX: Hardcode URL API di sini (Ganti ini ke URL API kamu yang bener!)
// Contoh: https://bossqu-api.vercel.app/api
let API_BASE = "https://bossqu-api.vercel.app/api"; 

// Optional: Kalo mau baca dari HTML data-attribute, uncomment baris di bawah:
// const html = document.documentElement;
// const fromHtml = html.getAttribute('data-api-base');
// if (fromHtml) API_BASE = fromHtml;

console.log("🚀 API_BASE yang dipakai:", API_BASE);

// =======================
// Load Playlist
// =======================
async function loadPlaylist() {
  if (!API_BASE || API_BASE === "undefined") {
    console.error("❌ API_BASE tidak didefinisikan!");
    alert("Error: Backend tidak terhubung. Cek console.");
    return;
  }

  // ⚠️ FIX: Pastikan pake backtick (`) bukan petik biasa (")
  const url = `\${API_BASE}/playlist`;
  console.log("📡 Fetching playlist dari:", url);

  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`HTTP Error: \${res.status}`);
    }
    
    const data = await res.json();
    daftarLagu = data;

    const audioDiv = document.getElementById("playlist-audio");
    const videoDiv = document.getElementById("playlist-video");
    
    if (!audioDiv || !videoDiv) {
      console.error("❌ Element playlist tidak ditemukan!");
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
    errorDiv.innerHTML = `<p style="color:red">Gagal muat playlist.<br>
    Cek Console (F12) untuk detail error.<br>
    Pastikan API_BASE benar dan backend jalan.</p>`;
  }
}

function playFile(file) {
  // ⚠️ Pastikan path ini sesuai dengan backend kamu
  const src = `${API_BASE}/${file}`;
  console.log("▶️ Play file:", src);
  
  player.src = src;
  player.play().catch(e => {
    console.error("Gagal play:", e);
    alert("Gagal memutar file. Cek console.");
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
