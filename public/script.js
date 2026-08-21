// =======================
// Variabel utama
// =======================
const audioTab = document.getElementById("playlist-audio");
const videoTab = document.getElementById("playlist-video");
const player = document.getElementById("player");
let daftarLagu = [];
let currentIndex = 0;

// ⚠️ IMPORTANT: Ini link defaultnya. Ganti ini manual kalo link ngrok berubah.
// Tapi kita juga tetep coba ambil dari config.json dulu.
let API_BASE = "https://judge-osmosis-bolster.ngrok-free.dev"; 

// =======================
// Load Config (Prioritas 1: config.json, Kalau gagal: pake default di atas)
// =======================
async function loadConfig() {
  try {
    const res = await fetch("/config.json");
    
    // Cek kalo file config.json ada
    if (!res.ok) {
      console.warn("config.json tidak ditemukan, pakai API_BASE default.");
      return;
    }

    const config = await res.json();
    
    // Cek kalo key API_BASE ada di config
    if (config.API_BASE) {
      API_BASE = config.API_BASE;
      console.log("✅ API_BASE loaded from config:", API_BASE);
    } else {
      console.warn("API_BASE tidak ada di config.json, pakai default.");
    }

    // Setelah config siap, load playlist & users
    loadPlaylist();
    loadUsers();

  } catch (err) {
    // Kalo config.json ga ada di Vercel (biasanya ga ada), ini ga akan crash app
    console.warn("Gagal load config.json (mungkin ga ada di deploy), pakai default API_BASE.");
    console.log("⚠️ Menggunakan API_BASE default:", API_BASE);
    
    // Tetep jalanin load meskipun config gagal
    loadPlaylist();
    loadUsers();
  }
}

// =======================
// Playlist
// =======================
async function loadPlaylist() {
  if (!API_BASE) {
    console.error("API_BASE tidak didefinisikan!");
    alert("Error: Backend tidak terhubung. Cek console.");
    return;
  }

  try {
    // ⚠️ Pastikan endpoint ini sama persis dengan yang di Lazarus kamu
    const res = await fetch(`\${API_BASE}/playlist`);
    
    if (!res.ok) throw new Error(`HTTP Error: \${res.status}`);
    
    const data = await res.json();
    daftarLagu = data;

    const audioDiv = document.getElementById("playlist-audio");
    const videoDiv = document.getElementById("playlist-video");
    
    if (!audioDiv || !videoDiv) {
      console.error("Element playlist-audio atau playlist-video tidak ditemukan!");
      return;
    }

    audioDiv.innerHTML = "";
    videoDiv.innerHTML = "";

    if (!data || data.length === 0) {
      audioDiv.innerHTML = "<p>Playlist kosong atau gagal muat.</p>";
      return;
    }

    data.forEach(file => {
      // ⚠️ Penting: Pastikan 'file' ini string nama file. 
      // Kalo backend ngasih object {name: "..."}, ubah jadi file.name
      const fileName = typeof file === 'string' ? file : file.name;
      
      const item = document.createElement("div");
      item.className = "playlist-item";
      item.textContent = fileName; // Ganti innerHTML ke textContent buat keamanan
      item.onclick = () => playFile(fileName);

      if (fileName.endsWith(".mp3") || fileName.endsWith(".wav")) {
        audioDiv.appendChild(item);
      } else if (fileName.endsWith(".mp4") || fileName.endsWith(".webm")) {
        videoDiv.appendChild(item);
      } else {
        // File lain bisa masuk ke audio atau diabaikan
        audioDiv.appendChild(item); 
      }
    });
  } catch (err) {
    console.error("❌ Error fetch playlist:", err);
    document.getElementById("playlist-audio").innerHTML = `<p style="color:red">Gagal muat playlist. Cek CORS atau link backend.</p>`;
  }
}

function playFile(file) {
  // ⚠️ Pastikan path ini benar. Kalo file di folder 'files' di backend, mungkin perlu:
  // player.src = `${API_BASE}/files/${file}`;
  player.src = `${API_BASE}/${file}`;
  
  player.play().catch(e => {
    console.error("Gagal play audio/video:", e);
    alert("Gagal memutar file. Cek console.");
  });

  document.getElementById("infoLagu").innerText = file;
  toggleLiveIndicator("active");
}

// =======================
// Users API
// =======================
async function loadUsers() {
  if (!API_BASE) return;
  try {
    // ⚠️ Pastikan endpoint ini benar. Kalo di Lazarus cuma '/users', hapus '/api/'
    const res = await fetch(`\${API_BASE}/api/users`);
    
    if (!res.ok) throw new Error(`Users API error: \${res.status}`);

    const data = await res.json();
    const list = document.getElementById("users");
    
    if (!list) {
      console.warn("Element 'users' tidak ditemukan, skip load users.");
      return;
    }

    list.innerHTML = "";

    if (!data || data.length === 0) {
      list.innerHTML = "<li>Tidak ada user.</li>";
      return;
    }

    data.forEach(user => {
      const li = document.createElement("li");
      // Handle kalo user cuma string atau object
      const userText = typeof user === 'object' ? `${user.id} - ${user.name}` : user;
      li.textContent = userText;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("❌ Gagal load users:", err);
    // Jangan crash app, cuma log error
  }
}

// =======================
// Live Indicator
// =======================
function toggleLiveIndicator(state) {
  const liveEl = document.getElementById("liveIndicator");
  if (liveEl) {
    liveEl.style.display = (state === "active") ? "block" : "none";
  }
}

// =======================
// Init
// =======================
loadConfig();
