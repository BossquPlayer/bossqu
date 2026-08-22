import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json", // file service account
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Folder ID musik & video
    const audioFolderId = "YOUR_AUDIO_FOLDER_ID";
    const videoFolderId = "YOUR_VIDEO_FOLDER_ID";

    // Ambil file audio
    const audioRes = await drive.files.list({
      q: `'${audioFolderId}' in parents`,
      fields: "files(id, name, mimeType)",
    });

    const audioFiles = audioRes.data.files.map(f => ({
      title: f.name,
      url: `https://drive.google.com/uc?export=download&id=${f.id}`
    }));

    // Ambil file video
    const videoRes = await drive.files.list({
      q: `'${videoFolderId}' in parents`,
      fields: "files(id, name, mimeType)",
    });

    const videoFiles = videoRes.data.files.map(f => ({
      title: f.name,
      url: `https://drive.google.com/uc?export=download&id=${f.id}`
    }));

    res.status(200).json({ audio: audioFiles, video: videoFiles });
  } catch (err) {
    console.error("Error ambil playlist:", err);
    res.status(500).json({ error: "Gagal ambil playlist" });
  }
}
