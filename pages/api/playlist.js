import { google } from "googleapis";

export default async function handler(req, res) {
  // 1. Ambil ID folder dari Environment Variable (di Vercel Dashboard)
  const audioFolderId = process.env.AUDIO_FOLDER_ID;
  const videoFolderId = process.env.VIDEO_FOLDER_ID;

  if (!audioFolderId || !videoFolderId) {
    return res.status(500).json({
      error: "Missing folder IDs. Set AUDIO_FOLDER_ID and VIDEO_FOLDER_ID in Vercel Env.",
    });
  }

  try {
    // 2. Auth dengan credentials.json (path aman untuk Vercel)
    const auth = new google.auth.GoogleAuth({
      keyFile: process.cwd() + "/credentials.json",
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    // 3. Fungsi helper biar koding rapi
    const getFiles = async (folderId, type) => {
      const res = await drive.files.list({
        q: `'\${folderId}' in parents and trashed = false`,
        fields: "files(id, name, mimeType, owners(emailAddress))",
        pageSize: 1000, // Max 1000 file per request
      });

      return res.data.files.map((file) => {
        const ownerEmail = file.owners?.?.emailAddress || "Unknown";
        const isVideo = type === "video";
        
        return {
          id: file.id,
          title: file.name,
          type: isVideo ? "video" : "audio",
          mimeType: file.mimeType,
          ownerEmail: ownerEmail,
          url: `https://drive.google.com/uc?export=download&id=\${file.id}`,
        };
      });
    };

    // 4. Ambil file audio dan video
    const audioFiles = await getFiles(audioFolderId, "audio");
    const videoFiles = await getFiles(videoFolderId, "video");

    // 5. Kirim response final
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
    
    // Kasih error message yang lebih user-friendly
    let message = "Internal server error";
    if (err.message.includes("404")) message = "Folder ID not found or invalid";
    if (err.message.includes("403")) message = "Service account not authorized (check sharing)";
    
    res.status(500).json({
      success: false,
      error: message,
      details: process.env.VERCEL ? "Check Vercel Build Logs" : err.message,
    });
  }
}
