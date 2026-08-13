// =======================
// Variabel utama
// =======================
const audioTab = document.getElementById("playlist-audio");
const videoTab = document.getElementById("playlist-video");
const player = document.getElementById("player");
let daftarLagu = [];
let currentIndex = 0;

// =======================
// Ambil playlist dari server Lazarus (/playlist)
// =======================
window.onload = () => {
  fetch("/playlist")
    .then(res => res.json())
    .then(data => {
      daftarLagu = [];

      // Render audio
      audioTab.innerHTML = "";
      data.forEach(file => {
        if (file.startsWith("music/")) {
          const title = file.split("/").pop();
          const item = document.createElement("div");
          item.className = "playlist-item";
          item.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2196f3"><path d="M9 17V5h2v12H9zm4 0V5h2v12h-2z"/></svg> ${title}`;
          item.onclick = () => playFile(file, title);
          audioTab.appendChild(item);
          daftarLagu.push({ url: file, title });
        }
      });

      // Render video
      videoTab.innerHTML = "";
      data.forEach(file => {
        if (file.startsWith("video/")) {
          const title = file.split("/").pop();
          const item = document.createElement("div");
          item.className = "playlist-item";
          item.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="#2196f3"><path d="M4 4h16v16H4V4zm5 3v10l9-5-9-5z"/></svg> ${title}`;
          item.onclick = () => playFile(file, title);
          videoTab.appendChild(item);
          daftarLagu.push({ url: file, title });
        }
      });

      // Auto-play lagu pertama
      if (daftarLagu.length > 0) {
        currentIndex = 0;
        playFile(daftarLagu[currentIndex].url, daftarLagu[currentIndex].title);
      }
    })
    .catch(err => console.error("Error load playlist:", err));
};

// =======================
// Kontrol Player
// =======================
function playAll() {
  if (daftarLagu.length > 0) {
    currentIndex = 0;
    playFile(daftarLagu[currentIndex].url, daftarLagu[currentIndex].title);
  }
}

player.addEventListener("ended", () => {
  currentIndex++;
  if (currentIndex < daftarLagu.length) {
    playFile(daftarLagu[currentIndex].url, daftarLagu[currentIndex].title);
  } else {
    toggleLiveIndicator("stopped");
  }
});

function playFile(url, title) {
  player.src = url;
  player.play();
  document.getElementById("infoLagu").innerText = title;
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

  // filter dulu
  let filtered = daftarLagu.filter(file => file.title.toLowerCase().includes(query));

  // urutkan abjad
  filtered.sort((a, b) => a.title.localeCompare(b.title));

  filtered.forEach(file => {
    const item = document.createElement("div");
    item.className = "playlist-item";

    const regex = new RegExp(`(${query})`, "gi");
    const highlighted = file.title.replace(regex, '<span class="highlight">$1</span>');

    item.innerHTML = highlighted;
    item.onclick = () => playFile(file.url, file.title);
    results.appendChild(item);
  });

  if (filtered.length === 0) {
    results.innerHTML = "<p>Tidak ada hasil</p>";
  }
}



// Modal Donasi
const modal = document.getElementById("donasiModal");
const btnOpen = document.getElementById("openDonasi");
const btnPaypal = document.getElementById("openPaypal");
const closeBtn = modal.querySelector(".close");

// buka modal donasi
btnOpen.addEventListener("click", () => {
  modal.style.display = "block";
});

// tutup modal donasi
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// tutup modal donasi kalau klik luar area
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// tombol PayPal langsung redirect
btnPaypal.addEventListener("click", () => {
  window.open("https://paypal.me/username", "_blank");
});

// Modal QRIS
const qrisModal = document.getElementById("qrisModal");
const btnQris = document.getElementById("openQris");
const closeQris = qrisModal.querySelector(".close");

// buka modal QRIS
btnQris.addEventListener("click", () => {
  qrisModal.style.display = "block";
});

// tutup modal QRIS
closeQris.addEventListener("click", () => {
  qrisModal.style.display = "none";
});

// tutup modal QRIS kalau klik luar area
window.addEventListener("click", (event) => {
  if (event.target === qrisModal) {
    qrisModal.style.display = "none";
  }
});
