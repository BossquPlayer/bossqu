// =======================
// Variabel utama
// =======================
const audioTab = document.getElementById("playlist-audio");
const videoTab = document.getElementById("playlist-video");
const player = document.getElementById("player");
let daftarLagu = [];
let currentIndex = 0;

// Ganti dengan URL ngrok kamu
const API_BASE = "https://abcd1234.ngrok.io"; 

// =======================
// Ambil playlist dari server PC via ngrok
// =======================
async function loadPlaylist() {
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

      let iconSVG = file.endsWith(".mp3")
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2196f3"><path d="M9 17V5h2v12H9zm4 0V5h2v12h-2z"/></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2196f3"><path d="M4 4h16v16H4V4zm5 3v10l9-5-9-5z"/></svg>`;

      item.innerHTML = iconSVG + " " + file;
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

// =======================
// Kontrol Player
// =======================
function playAll() {
  if (daftarLagu.length > 0) {
    currentIndex = 0;
    playFile(daftarLagu[currentIndex]);
  }
}

player.addEventListener("ended", () => {
  if (repeatSingle) {
    playFile(daftarLagu[currentIndex]);
  } else {
    currentIndex++;
    if (currentIndex < daftarLagu.length) {
      playFile(daftarLagu[currentIndex]);
    } else if (repeatMode) {
      currentIndex = 0;
      playFile(daftarLagu[currentIndex]);
    } else {
      toggleLiveIndicator("stopped");
    }
  }
});

function playFile(file) {
  player.src = `${API_BASE}/${file}`;
  player.play();
  document.getElementById("infoLagu").innerText = file;
  toggleLiveIndicator("active");
}

function stopPlayer() {
  player.pause();
  player.src = "";
  document.getElementById("infoLagu").innerText = "Stopped";
  toggleLiveIndicator("stopped");
}

function toggleLiveIndicator(state) {
  const liveEl = document.getElementById("liveIndicator");
  liveEl.style.display = (state === "active") ? "block" : "none";
}

// =======================
// Repeat & Shuffle
// =======================
let repeatMode = false;
let repeatSingle = false;

function toggleRepeat() {
  repeatMode = !repeatMode;
  document.getElementById("infoLagu").innerText = repeatMode ? "Repeat Mode: ON" : "Repeat Mode: OFF";
}

function toggleRepeatSingle() {
  repeatSingle = !repeatSingle;
  document.getElementById("infoLagu").innerText = repeatSingle ? "Repeat Single: ON" : "Repeat Single: OFF";
}

function shufflePlaylist() {
  if (daftarLagu.length > 0) {
    for (let i = daftarLagu.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [daftarLagu[i], daftarLagu[j]] = [daftarLagu[j], daftarLagu[i]];
    }
    currentIndex = 0;
    playFile(daftarLagu[currentIndex]);
  }
}

// =======================
// Next / Previous
// =======================
function nextTrack() {
  if (daftarLagu.length > 0) {
    currentIndex++;
    if (currentIndex >= daftarLagu.length) currentIndex = 0;
    playFile(daftarLagu[currentIndex]);
  }
}

function prevTrack() {
  if (daftarLagu.length > 0) {
    currentIndex--;
    if (currentIndex < 0) currentIndex = daftarLagu.length - 1;
    playFile(daftarLagu[currentIndex]);
  }
}

// =======================
// Init
// =======================
loadPlaylist();
