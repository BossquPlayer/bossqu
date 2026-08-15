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
    const res = await fetch("./playlist.json"); // path aman di Vercel
    const data = await res.json();
    daftarLagu = data;

    audioTab.innerHTML = "";
    videoTab.innerHTML = "";

    data.forEach(file => {
      const item = document.createElement("div");
      item.className = "playlist-item";

      // Icon sesuai jenis file
      let iconSVG = file.endsWith(".mp3")
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2196f3"><path d="M9 17V5h2v12H9zm4 0V5h2v12h-2z"/></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2196f3"><path d="M4 4h16v16H4V4zm5 3v10l9-5-9-5z"/></svg>`;

      item.innerHTML = iconSVG + " " + file;
      item.onclick = () => playFile(file);

      if (file.endsWith(".mp3")) {
        audioTab.appendChild(item);
      } else {
        videoTab.appendChild(item);
      }
    });
  } catch (err) {
    console.error("Gagal load playlist:", err);
  }
}

// panggil saat halaman load
loadPlaylist();

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
  currentIndex++;
  if (currentIndex < daftarLagu.length) {
    playFile(daftarLagu[currentIndex]);
  } else {
    toggleLiveIndicator("stopped");
  }
});

function playFile(file) {
  player.style.display = "block";
  document.getElementById("audioPlaceholder").style.display = "none";

  player.src = file; // langsung path dari JSON
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

      // Highlight kata kunci
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
// Modal Donasi & QRIS
// =======================
const donasiModal = document.getElementById("donasiModal");
const qrisModal = document.getElementById("qrisModal");
const btnOpenDonasi = document.getElementById("openDonasi");
const btnOpenPaypal = document.getElementById("openPaypal");
const btnOpenQris = document.getElementById("openQris");
const closeBtns = document.querySelectorAll(".modal .close");

// buka modal donasi
btnOpenDonasi.addEventListener("click", () => {
  donasiModal.style.display = "block";
});

// buka modal QRIS
btnOpenQris.addEventListener("click", () => {
  qrisModal.style.display = "block";
});

// tutup modal (semua)
closeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    donasiModal.style.display = "none";
    qrisModal.style.display = "none";
  });
});

// tutup modal kalau klik luar area
window.addEventListener("click", (event) => {
  if (event.target === donasiModal) donasiModal.style.display = "none";
  if (event.target === qrisModal) qrisModal.style.display = "none";
});

// tombol PayPal langsung redirect
btnOpenPaypal.addEventListener("click", () => {
  window.open("https://paypal.me/username", "_blank");
});

// =======================
// Sidebar toggle
// =======================
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const collapseBtn = document.querySelector('.collapse-btn');
  
  sidebar.classList.toggle('collapsed');
  
  if (sidebar.classList.contains('collapsed')) {
    collapseBtn.textContent = '➡️ Tampilkan Donasi';
  } else {
    collapseBtn.textContent = '⬅️ Sembunyikan Donasi';
  }
}
