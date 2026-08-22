import { google } from "googleapis";

export default async function handler(req, res) {
  const audioFolderId = process.env.AUDIO_FOLDER_ID;
  const videoFolderId = process.env.VIDEO_FOLDER_ID;

  if (!audioFolderId || !videoFolderId) {
    return res.status(500).json({ error: "Missing folder IDs" });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

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

    const audioFiles = await getFiles(audioFolderId, "audio");
    const videoFiles = await getFiles(videoFolderId, "video");

    res.status(200).json({
      success: true,
      data: {
        audio: audioFiles,
        video: videoFiles,
        total: audioFiles.length + videoFiles.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
