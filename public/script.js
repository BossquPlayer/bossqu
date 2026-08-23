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
//let API_BASE = "https://bossqu-api.vercel.app/api"; 

console.log("🚀 Bossqu Player Initialized");
console.log("📡 API_BASE Target:", API_BASE);

// =======================
// Load Playlist
// =======================

async function loadPlaylist() {
  // Karena API ini di repo yang sama, kita pake path relative
  const url = '/api/get-playlist'; 
  
  console.log("📡 Mencoba fetch ke:", url);

  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    console.log("✅ Playlist dari Google Drive:", data);
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
      audioDiv.innerHTML = "<p>Playlist kosong di Google Drive.</p>";
      return;
    }

    data.forEach(item => {
      const displayName = item.title;
      const fileUrl = item.url; // Ini langsung link download dari Google Drive
      
      const element = document.createElement("div");
      element.className = "playlist-item";
      element.textContent = displayName;
      element.style.cursor = "pointer";
      element.style.padding = "8px";
      element.style.borderBottom = "1px solid #eee";
      
      element.onclick = () => playFile(fileUrl);

      // Cek ekstensi dari title
      const isAudio = displayName.toLowerCase().endsWith(".mp3") || displayName.toLowerCase().endsWith(".wav");
      const isVideo = displayName.toLowerCase().endsWith(".mp4") || displayName.toLowerCase().endsWith(".webm");

      if (isAudio) {
        audioDiv.appendChild(element);
      } else if (isVideo) {
        videoDiv.appendChild(element);
      } else {
        audioDiv.appendChild(element); 
      }
    });

  } catch (err) {
    console.error("❌ Kesalahan load playlist:", err);
    showError(`Gagal muat playlist: \${err.message}. Cek Logs Vercel!`);
  }
}


function showError(message) {
  const audioDiv = document.getElementById("playlist-audio");
  if (audioDiv) {
    audioDiv.innerHTML = `<p style="color:red; font-weight:bold;">\${message}</p>`;
  }
}


function playFile(source) {
  // 'source' sekarang langsung URL file (contoh: https://example.com/song1.mp3)
  if (!source) {
    alert("Tidak ada file untuk diputar!");
    return;
  }

  console.log("▶️ Memutar:", source);
  
  player.src = source;
  player.play().catch(e => {
    console.error("Gagal play media:", e);
    alert("Gagal memutar file. Browser mungkin blokir autoplay.");
  });

  const infoEl = document.getElementById("infoLagu");
  // Kalo mau nampilin title, kita perlu cari lagi di daftarLagu, tapi buat sekarang cukup URL
  if (infoEl) infoEl.innerText = source; 
  
  if (typeof toggleLiveIndicator === 'function') {
    toggleLiveIndicator("active");
  }
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
