// =======================
// Variabel utama
// =======================
const audioTab = document.getElementById("playlist-audio");
const videoTab = document.getElementById("playlist-video");
const player = document.getElementById("player");
let daftarLagu = [];
let currentIndex = 0;

// =======================
// Ambil playlist dari server
// =======================
async function loadPlaylist() {
  try {
    const res = await fetch("/playlist");
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
    // ulangi lagu yang sama
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
  player.src = "/" + file;
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
// Tab Playlist
// =======================
function showTab(type, event) {
  document.querySelectorAll(".playlist-tab").forEach(tab => tab.classList.remove("show"));
  document.getElementById("playlist-" + type).classList.add("show");

  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
}

// =======================
// Pencarian
// =======================
function doSearch() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  tampilkanHasilSearch(query);
}

function resetSearch() {
  document.getElementById("searchBox").value = "";
  document.getElementById("searchResults").innerHTML = "";
}

document.getElementById("searchBox").addEventListener("input", function() {
  tampilkanHasilSearch(this.value.toLowerCase());
});

function tampilkanHasilSearch(query) {
  const results = document.getElementById("searchResults");
  results.innerHTML = "";

  if (!query) return;

  daftarLagu.forEach(file => {
    if (file.toLowerCase().includes(query)) {
      const item = document.createElement("div");
      item.className = "playlist-item";

      const regex = new RegExp(`(${query})`, "gi");
      const highlighted = file.replace(regex, '<span class="highlight">$1</span>');

      item.innerHTML = highlighted;
      item.onclick = () => playFile(file);
      results.appendChild(item);
    }
  });

  if (results.innerHTML === "") {
    results.innerHTML = "<p>Tidak ada hasil</p>";
  }
}

// =======================
// Donasi Modal
// =======================
function openDonasi() {
  const modal = document.getElementById("donasiModal");
  modal.style.display = "block";

  const content = modal.querySelector(".modal-content");
  content.style.animation = "none";
  content.offsetHeight;
  content.style.animation = "fadeSlideIn 0.6s forwards";
}

function closeDonasi() {
  document.getElementById("donasiModal").style.display = "none";
}

// =======================
// Sidebar
// =======================
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const collapseBtn = document.querySelector('.collapse-btn');
  
  sidebar.classList.toggle('collapsed');
  
  collapseBtn.textContent = sidebar.classList.contains('collapsed')
    ? '➡️ Tampilkan Donasi'
    : '⬅️ Sembunyikan Donasi';
}

// =======================
// Users API Integration
// =======================
async function loadUsers() {
  try {
    const res = await fetch("/api/users");
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

async function addUser() {
  const name = document.getElementById("newUserName").value;
  if (!name) return alert("Isi nama dulu!");
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    await res.json();
    document.getElementById("newUserName").value = "";
    loadUsers();
  } catch (err) {
    console.error("Gagal tambah user:", err);
  }
}

// =======================
// Init
// =======================
loadPlaylist();
loadUsers();


// =======================
// Shuffle Playlist
// =======================
function shufflePlaylist() {
  if (daftarLagu.length > 0) {
    // acak array daftarLagu
    for (let i = daftarLagu.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [daftarLagu[i], daftarLagu[j]] = [daftarLagu[j], daftarLagu[i]];
    }
    currentIndex = 0;
    playFile(daftarLagu[currentIndex]);
  }
}


// =======================
// Repeat Mode
// =======================
let repeatMode = false;

function toggleRepeat() {
  repeatMode = !repeatMode;
  const info = document.getElementById("infoLagu");
  info.innerText = repeatMode ? "Repeat Mode: ON" : "Repeat Mode: OFF";
}


// =======================
// Repeat Single Track
// =======================
let repeatSingle = false;

function toggleRepeatSingle() {
  repeatSingle = !repeatSingle;
  const info = document.getElementById("infoLagu");
  info.innerText = repeatSingle ? "Repeat Single: ON" : "Repeat Single: OFF";
}

// =======================
// Next / Previous Track
// =======================
function nextTrack() {
  if (daftarLagu.length > 0) {
    currentIndex++;
    if (currentIndex >= daftarLagu.length) {
      currentIndex = 0; // balik ke awal kalau sudah habis
    }
    playFile(daftarLagu[currentIndex]);
  }
}

function prevTrack() {
  if (daftarLagu.length > 0) {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = daftarLagu.length - 1; // balik ke akhir kalau mundur dari awal
    }
    playFile(daftarLagu[currentIndex]);
  }
}




