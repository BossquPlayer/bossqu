// Load playlist dari playlist.json
async function loadPlaylist() {
  try {
    const res = await fetch("./playlist.json");
    const data = await res.json();

    // Audio
    data.audio.forEach(track => {
      const item = document.createElement("div");
      item.className = "playlist-item";
      item.textContent = track.title;
      item.onclick = () => playFile(track.url, track.title);
      document.getElementById("playlist-audio").appendChild(item);
    });

    // Video
    data.video.forEach(vid => {
      const item = document.createElement("div");
      item.className = "playlist-item";
      item.textContent = vid.title;
      item.onclick = () => playFile(vid.url, vid.title);
      document.getElementById("playlist-video").appendChild(item);
    });
  } catch (err) {
    console.error("Gagal load playlist:", err);
  }
}

// Play file audio/video
function playFile(url, title) {
  const player = document.getElementById("player");
  player.src = url;
  player.play();
  document.getElementById("infoLagu").innerText = title;
}

// Tombol Play All & Stop
document.getElementById("playAll").addEventListener("click", () => {
  const firstAudio = document.querySelector("#playlist-audio .playlist-item");
  if (firstAudio) firstAudio.click();
});

document.getElementById("stopAll").addEventListener("click", () => {
  const player = document.getElementById("player");
  player.pause();
  player.src = "";
  document.getElementById("infoLagu").innerText = "Tidak ada media diputar";
});

// Pencarian
document.getElementById("searchBtn").addEventListener("click", () => {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll(".playlist-item").forEach(item => {
    if (item.textContent.toLowerCase().includes(keyword)) {
      item.style.backgroundColor = "yellow";
    } else {
      item.style.backgroundColor = "";
    }
  });
});

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  document.querySelectorAll(".playlist-item").forEach(item => {
    item.style.backgroundColor = "";
  });
});

// Donasi
document.getElementById("openQris").addEventListener("click", () => {
  document.getElementById("donasiArea").style.display = "block";
});

document.getElementById("openPaypal").addEventListener("click", () => {
  window.open("https://paypal.me/username", "_blank"); // ganti username dengan akun PayPal kamu
});

document.getElementById("hideDonasi").addEventListener("click", () => {
  document.getElementById("donasiArea").style.display = "none";
});

// Jalankan saat halaman load
window.onload = loadPlaylist;
