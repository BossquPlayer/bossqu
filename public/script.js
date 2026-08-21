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
fetch("/api/playlist")
  .then(res => res.json())
  .then(data => {
    // gabungkan audio + video ke daftarLagu
    daftarLagu = [...data.audio.map(f => f.url), ...data.video.map(f => f.url)];

    // render audio
    data.audio.forEach(file => {
      const item = document.createElement("div");
      item.className = "playlist-item";
      item.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2196f3"><path d="M9 17V5h2v12H9zm4 0V5h2v12h-2z"/></svg> ${file.title}`;
      item.onclick = () => playFile(file.url);
      audioTab.appendChild(item);
    });

    // render video
    data.video.forEach(file => {
      const item = document.createElement("div");
      item.className = "playlist-item";
      item.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2196f3"><path d="M4 4h16v16H4V4zm5 3v10l9-5-9-5z"/></svg> ${file.title}`;
      item.onclick = () => playFile(file.url);
      videoTab.appendChild(item);
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
  player.src = file;
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
// Donasi Modal + Sidebar
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
    businessInput.value = "YOUR_SANDBOX_MERCHANT_ID";
  } else {
    form.action = "https://www.paypal.com/donate";
    businessInput.value = "YOUR_LIVE_MERCHANT_ID";
  }
}
updatePaypalForm();

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const collapseBtn = document.querySelector('.collapse-btn');
  sidebar.classList.toggle('collapsed');
  collapseBtn.textContent = sidebar.classList.contains('collapsed')
    ? '➡️ Tampilkan Donasi'
    : '⬅️ Sembunyikan Donasi';
}
