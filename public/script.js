// =======================
// Variabel Utama
// =======================
const audioTab = document.getElementById("playlist-audio");
const videoTab = document.getElementById("playlist-video");
const player = document.getElementById("player");
let daftarLagu = [];

console.log("🚀 Bossqu Player Initialized");

// =======================
// Load Playlist (Dari API Route)
// =======================
async function loadPlaylist() {
  // Kita fetch ke API route yang kita bikin di pages/api/get-playlist.js
  const url = '/api/get-playlist'; 
  
  console.log("📡 Mencoba fetch ke:", url);

  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ HTTP Error:", res.status, res.statusText);
      console.error("Server Response:", errText);
      throw new Error(`HTTP \${res.status}`);
    }

    const data = await res.json();
    console.log("✅ Playlist berhasil dimuat:", data);
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
      // Handle format data dari API (pasti ada title dan url)
      const displayName = item.title || item.name || "Unknown File";
      const fileUrl = item.url; 
      
      const element = document.createElement("div");
      element.className = "playlist-item";
      element.textContent = displayName;
      element.style.cursor = "pointer";
      element.style.padding = "8px";
      element.style.borderBottom = "1px solid #eee";
      element.style.color = "#333";
      
      element.onclick = () => playFile(fileUrl);

      // Pisah Audio dan Video berdasarkan ekstensi
      const lowerName = displayName.toLowerCase();
      const isAudio = lowerName.endsWith(".mp3") || lowerName.endsWith(".wav") || lowerName.endsWith(".ogg");
      const isVideo = lowerName.endsWith(".mp4") || lowerName.endsWith(".webm") || lowerName.endsWith(".mkv");

      if (isAudio) {
        audioDiv.appendChild(element);
      } else if (isVideo) {
        videoDiv.appendChild(element);
      } else {
        // File lain masuk ke audio (atau bisa diignore)
        audioDiv.appendChild(element); 
      }
    });

  } catch (err) {
    console.error("❌ Kesalahan total saat load playlist:", err);
    showError(`Gagal muat playlist: \${err.message}. Cek Console (F12) dan Logs Vercel!`);
  }
}

function showError(message) {
  const audioDiv = document.getElementById("playlist-audio");
  if (audioDiv) {
    audioDiv.innerHTML = `<p style="color:red; font-weight:bold; padding: 10px; background: #ffe6e6; border-radius: 4px;">⚠️ \${message}</p>`;
  }
}

function playFile(source) {
  if (!source) {
    alert("Tidak ada file untuk diputar!");
    return;
  }

  console.log("▶️ Memutar:", source);
  
  player.src = source;
  // Autoplay di browser modern sering di-block, jadi kita coba play dan handle error
  player.play().catch(e => {
    console.error("Autoplay blocked or error:", e);
    alert("Gagal play otomatis. Silakan klik manual di player atau cek link file.");
  });

  const infoEl = document.getElementById("infoLagu");
  if (infoEl) {
    // Tampilin nama file aja, bukan full URL
    const fileName = source.split('/').pop().split('?');
    infoEl.innerText = fileName;
  }
  
  if (typeof toggleLiveIndicator === 'function') {
    toggleLiveIndicator("active");
  }
}

// =======================
// Init
// =======================
loadPlaylist();
