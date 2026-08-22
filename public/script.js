// =======================
// Variabel utama
// =======================
const audioTab = document.getElementById("playlist-audio");
const videoTab = document.getElementById("playlist-video");
const player = document.getElementById("player");
let daftarLagu = [];
let currentIndex = 0;

// ⚠️ FIX: Baca dari Environment Variable di Vercel
// Kalo kamu pake Vite: import.meta.env.VITE_API_BASE
// Kalo kamu pake Next.js/React: process.env.NEXT_PUBLIC_API_BASE atau process.env.REACT_APP_API_BASE
// Kalo variable ga ada (misal di local tanpa .env), pake fallback URL
const rawApiBase = import.meta.env?.VITE_API_BASE || process.env.NEXT_PUBLIC_API_BASE || process.env.REACT_APP_API_BASE;

let API_BASE = rawApiBase || "https://bossqu-api.vercel.app/api"; // FALLBACK URL (Ganti ini ke URL API kamu yang public)

console.log("🚀 API_BASE yang dipakai:", API_BASE);

// =======================
// Load Playlist (Langsung jalan, ga usah config.json)
// =======================
async function loadPlaylist() {
  if (!API_BASE) {
    console.error("API_BASE tidak didefinisikan!");
    alert("Error: Backend tidak terhubung. Cek console.");
    return;
  }

  try {
    // ⚠️ Pastikan endpoint ini sama persis dengan yang di backend kamu
    // Kalo backend kamu ngasih data di /api/playlist, maka fetchnya ke /playlist aja (karena API_BASE udah include base url)
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
      audioDiv.innerHTML = "<p>Playlist kosong atau backend belum siap.</p>";
      return;
    }

    data.forEach(file => {
      const fileName = typeof file === 'string' ? file : file.name;
      
      const item = document.createElement("div");
      item.className = "playlist-item";
      item.textContent = fileName;
      item.onclick = () => playFile(fileName);

      if (fileName.endsWith(".mp3") || fileName.endsWith(".wav")) {
        audioDiv.appendChild(item);
      } else if (fileName.endsWith(".mp4") || fileName.endsWith(".webm")) {
        videoDiv.appendChild(item);
      } else {
        audioDiv.appendChild(item); 
      }
    });
  } catch (err) {
    console.error("❌ Error fetch playlist:", err);
    const errorDiv = document.getElementById("playlist-audio") || document.body;
    errorDiv.innerHTML = `<p style="color:red">Gagal muat playlist. Cek Console (F12) untuk detail error.<br>
    Pastikan API_BASE benar dan CORS di backend aktif.</p>`;
  }
}

function playFile(file) {
  // ⚠️ Sesuaikan path ini dengan backend kamu
  // Kalo file disimpan di folder 'files' di backend, mungkin jadi: `${API_BASE}/files/${file}`
  player.src = `${API_BASE}/${file}`;
  
  player.play().catch(e => {
    console.error("Gagal play audio/video:", e);
    alert("Gagal memutar file. Cek console.");
  });

  document.getElementById("infoLagu")?.innerText = file;
  toggleLiveIndicator("active");
}

// =======================
// Init
// =======================
// Langsung load playlist, ga usah loadConfig lagi
loadPlaylist();
