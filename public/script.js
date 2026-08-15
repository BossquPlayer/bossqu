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
fetch("/playlist")
  .then(res => res.json())
  .then(data => {
    daftarLagu = data;
    data.forEach(file => {
      const item = document.createElement("div");
      item.className = "playlist-item";

      // Icon sesuai jenis file
      let iconSVG = file.endsWith(".mp3")
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2196f3"><path d="M9 17V5h2v12H9zm4 0V5h2v12h-2z"/></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2196f3"><path d="M4 4h16v16H4V4zm5 3v10l9-5-9-5z"/></svg>`;

      item.innerHTML = iconSVG + " " + file;

      // Klik item → putar
      item.onclick = () => {
        player.src = "/" + file;
        player.play();
        document.getElementById("infoLagu").innerText = file;
        toggleLiveIndicator("active");
      };

      // Masukkan ke tab sesuai jenis
      if (file.endsWith(".mp3")) {
        audioTab.appendChild(item);
      } else {
        videoTab.appendChild(item);
      }
    });
  })
  .catch(err => console.error("Error fetch playlist:", err));

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
// Donasi Modal
// =======================
function openDonasi() {
  const modal = document.getElementById("donasiModal");
  modal.style.display = "block";

  // Restart animasi setiap kali dibuka
  const content = modal.querySelector(".modal-content");
  content.style.animation = "none";
  content.offsetHeight; // trigger reflow
  content.style.animation = "fadeSlideIn 0.6s forwards";
}

function closeDonasi() {
  document.getElementById("donasiModal").style.display = "none";
}

async function loadPlaylist() {
  try {
    const res = await fetch("/playlist");
    const data = await res.json();

    // pisahkan audio & video
    const audioDiv = document.getElementById("playlist-audio");
    const videoDiv = document.getElementById("playlist-video");
    audioDiv.innerHTML = "";
    videoDiv.innerHTML = "";

    data.forEach(item => {
      if (item.endsWith(".mp3")) {
        const btn = document.createElement("button");
        btn.textContent = item;
        btn.onclick = () => playMedia(item);
        audioDiv.appendChild(btn);
      } else {
        const btn = document.createElement("button");
        btn.textContent = item;
        btn.onclick = () => playMedia(item);
        videoDiv.appendChild(btn);
      }
    });
  } catch (err) {
    console.error("Gagal load playlist", err);
  }
}

// panggil saat halaman load
loadPlaylist();

function playMedia(path) {
  const player = document.getElementById("player");
  if (path.endsWith(".mp3")) {
    player.style.display = "none"; // sembunyikan video
    document.getElementById("audioPlaceholder").style.display = "block";
    const audio = new Audio(path);
    audio.play();
  } else {
    document.getElementById("audioPlaceholder").style.display = "none";
    player.style.display = "block";
    player.src = path;
    player.play();
  }
}

// Mode bisa 'sandbox' atau 'live'
let paypalMode = "sandbox"; 

function setPaypalMode(mode) {
  paypalMode = mode;
  updatePaypalForm();
}

function updatePaypalForm() {
  const form = document.getElementById("paypalForm");
  const businessInput = document.getElementById("paypalBusiness");

  if (paypalMode === "sandbox") {
    form.action = "https://www.sandbox.paypal.com/donate";
    businessInput.value = "YOUR_SANDBOX_MERCHANT_ID"; // ganti dengan Merchant ID sandbox
  } else {
    form.action = "https://www.paypal.com/donate";
    businessInput.value = "YOUR_LIVE_MERCHANT_ID"; // ganti dengan Merchant ID asli
  }
}

// Panggil saat halaman load
updatePaypalForm();

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
