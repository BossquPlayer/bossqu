import { google } from "googleapis";

export default async function handler(req, res) {
  // 1. DAPATIN ID FOLDER DARI ENV VAR (Jangan lupa tambahin ini di Vercel!)
  const audioFolderId = process.env.AUDIO_FOLDER_ID;
  const videoFolderId = process.env.VIDEO_FOLDER_ID;

  if (!audioFolderId || !videoFolderId) {
    return res.status(500).json({ 
      error: "Missing folder IDs. Please add AUDIO_FOLDER_ID and VIDEO_FOLDER_ID to Vercel Environment Variables." 
    });
  }

  try {
    // 2. AUTH PAKAI ENV VAR (Gak pake file credentials.json lagi)
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Penting: .replace(/\\n/g, "\n") buat ngelurusin format key yang di-copy paste ke Vercel
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), 
      },
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    // 3. LOGIKA AMBIL FILE (Bisa digabung atau dipisah, tergantung kebutuhan)
    // Contoh ambil file dari folder audio
    const audioFiles = await drive.files.list({
      q: `'\${audioFolderId}' in parents and trashed = false`,
      fields: "files(id, name, webContentLink, mimeType)",
      pageSize: 100,
    });

    // Contoh ambil file dari folder video
    const videoFiles = await drive.files.list({
      q: `'\${videoFolderId}' in parents and trashed = false`,
      fields: "files(id, name, webContentLink, mimeType)",
      pageSize: 100,
    });

    // Gabungin hasilnya jadi satu JSON
    const allFiles = [
      ...(audioFiles.data.files || []),
      ...(videoFiles.data.files || [])
    ];

    res.status(200).json({
      success: true,
      count: allFiles.length,
      files: allFiles,
    });

  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ 
      error: "Failed to fetch files from Google Drive", 
      details: err.message 
    });
  }
}
