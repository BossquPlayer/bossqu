// generatePlaylist.js
const fs = require("fs");

// Masukkan daftar file OneDrive di sini (hasil copy link direct download)
const audioFiles = [
  { title: "Lagu 1 - Tak Ada Yang Abadi", url: "https://onedrive.live.com/download?cid=...!111&authkey=..." },
  { title: "Lagu 2 - Generasi Frustasi", url: "https://onedrive.live.com/download?cid=...!222&authkey=..." },
  { title: "Lagu 3 - Senja di Jakarta", url: "https://onedrive.live.com/download?cid=...!333&authkey=..." },
  { title: "Lagu 4 - Malam Sunyi", url: "https://onedrive.live.com/download?cid=...!444&authkey=..." },
  { title: "Lagu 5 - Jalan Panjang", url: "https://onedrive.live.com/download?cid=...!555&authkey=..." }
];

const videoFiles = [
  { title: "Video 1 - Konser Live", url: "https://onedrive.live.com/download?cid=...!666&authkey=..." },
  { title: "Video 2 - Behind The Scene", url: "https://onedrive.live.com/download?cid=...!777&authkey=..." }
];

const playlist = { audio: audioFiles, video: videoFiles };

// Simpan ke public/playlist.json
fs.writeFileSync("public/playlist.json", JSON.stringify(playlist, null, 2));
console.log("playlist.json berhasil dibuat!");
