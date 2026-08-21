// =======================
// Variabel utama
// =======================
const audioTab = document.getElementById("playlist-audio");
const videoTab = document.getElementById("playlist-video");
const player = document.getElementById("player");
let daftarLagu = [];
let currentIndex = 0;
let API_BASE = "";

// =======================
// Load Config (ambil URL ngrok dari config.json)
// =======================
async function loadConfig() {
  try {
    const res = await fetch("/config.json");
    const config = await res.json();
    API_BASE = config.API_BASE;
    console.log("API_BASE loaded:", API_BASE);

    // Setelah config siap, load playlist & users
    loadPlaylist();
    loadUsers();
  } catch (err) {
    console.error("Gagal load config.json:", err);
  }
}

// =======================
// Playlist
// =======================
async function loadPlaylist() {
  if (!API_BASE) return;
  try {
    const res = await fetch(`${API_BASE}/playlist`);
    const data = await res.json();
    daftarLagu = data;

    const audioDiv = document.getElementById("playlist-audio");
    const videoDiv = document.getElementById("playlist-video");
    audioDiv.innerHTML = "";
    videoDiv.innerHTML = "";

    data.forEach(file => {
      const item = document.createElement("div");
      item.className = "playlist-item";
      item.innerHTML = file;
      item.onclick = () => playFile(file);

      if (file.endsWith(".mp3")) {
        audioDiv.appendChild(item);
      } else {
        videoDiv.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Error fetch playlist:", err);
  }
}

function playFile(file) {
  player.src = `${API_BASE}/${file}`;
  player.play();
  document.getElementById("infoLagu").innerText = file;
  toggleLiveIndicator("active");
}

// =======================
// Users API
// =======================
async function loadUsers() {
  if (!API_BASE) return;
  try {
    const res = await fetch(`${API_BASE}/api/users`);
    const data = await res.json();
    const list = document.getElementById("users");
    list.innerHTML = "";

    data.forEach(user => {
      const li = document.createElement("li");
      li.textContent = `${user.id} - ${user.name}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Gagal load users:", err);
  }
}

// =======================
// Live Indicator
// =======================
function toggleLiveIndicator(state) {
  const liveEl = document.getElementById("liveIndicator");
  liveEl.style.display = (state === "active") ? "block" : "none";
}

// =======================
// Init
// =======================
loadConfig();
