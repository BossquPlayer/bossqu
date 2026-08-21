const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8080;

// Path drive D
const musicDir = "D:/FM/public/music";
const videoDir = "D:/FM/public/video";

// Cache playlist
let playlistCache = null;

// Fungsi generate playlist
function generatePlaylist() {
  const audioFiles = fs.readdirSync(musicDir)
    .filter(f => f.endsWith(".mp3"))
    .map(f => ({ title: f, url: `/music/${f}` }));

  const videoFiles = fs.readdirSync(videoDir)
    .filter(f => f.endsWith(".mp4"))
    .map(f => ({ title: f, url: `/video/${f}` }));

  playlistCache = { audio: audioFiles, video: videoFiles };
  console.log(`Playlist di-refresh (${audioFiles.length} audio, ${videoFiles.length} video)`);
}

// Refresh pertama kali
generatePlaylist();

// Auto refresh tiap 1 menit
setInterval(generatePlaylist, 60 * 1000);

// Endpoint API
app.get("/api/playlist", (req, res) => {
  res.json(playlistCache);
});

// Serve file statis
app.use("/music", express.static(musicDir));
app.use("/video", express.static(videoDir));
app.use("/", express.static("D:/FM/public"));

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
