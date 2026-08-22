import { google } from "googleapis";

export default async function handler(req, res) {
  // 1. DAPATIN ID FOLDER DARI ENV VAR
  const audioFolderId = process.env.AUDIO_FOLDER_ID;
  const videoFolderId = process.env.VIDEO_FOLDER_ID;

  if (!audioFolderId || !videoFolderId) {
    return res.status(500).json({ 
      error: "Missing folder IDs. Check Vercel Env Var." 
    });
  }

  try {
    // 2. AUTH PAKAI ENV VAR (Gak pake file lagi)
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Penting: .replace(/\\n/g, "\n") buat ngelurusin format key
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), 
      },
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    // 3. FUNGSI BANTUAN BIAR KODENYA RAPI
    const getFiles = async (folderId, type) => {
      const res = await drive.files.list({
        q: `'\${folderId}' in parents and trashed = false`,
        fields: "files(id, name, mimeType, owners(emailAddress))",
        pageSize: 1000,
      });

      return res.data.files.map((file) => {
        const ownerEmail = file.owners?.?.emailAddress || "Unknown";
        return {
          id: file.id,
          title: file.name,
          type: type,
          mimeType: file.mimeType,
          ownerEmail: ownerEmail,
          url: `https://drive.google.com/uc?export=download&id=\${file.id}`,
        };
      });
    };

    // 4. AMBIL FILE AUDIO DAN VIDEO
    const audioFiles = await getFiles(audioFolderId, "audio");
    const videoFiles = await getFiles(videoFolderId, "video");

    // 5. KIRIM RESPONSE FINAL
    res.status(200).json({
      success: true,
      data: {
        audio: audioFiles,
        video: videoFiles,
        total: audioFiles.length + videoFiles.length,
      },
    });

  } catch (err) {
    console.error("Error fetching playlist:", err.message);
    
    let message = "Internal server error";
    if (err.message.includes("404")) message = "Folder ID not found or invalid";
    if (err.message.includes("403")) message = "Service account not authorized (check sharing)";
    
    res.status(500).json({
      success: false,
      error: message,
      details: err.message,
    });
  }
}
