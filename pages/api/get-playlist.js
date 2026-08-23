// pages/api/get-playlist.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  // 1. Ambil ID folder dari Environment Variables
  const audioFolderId = process.env.AUDIO_FOLDER_ID;
  const videoFolderId = process.env.VIDEO_FOLDER_ID;

  if (!audioFolderId || !videoFolderId) {
    return res.status(500).json({ error: 'Folder IDs not configured. Check Vercel Env Vars!' });
  }

  // 2. Ambil credentials
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return res.status(500).json({ error: 'Google Service Account credentials missing!' });
  }

  try {
    // 3. Setup Auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'), // Penting: handle newline
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // 4. Fungsi helper
    const getFilesFromFolder = async (folderId) => {
      const res = await drive.files.list({
        q: `'\${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, webContentLink)',
        pageSize: 1000,
      });
      return res.data.files || [];
    };

    // 5. Ambil file
    const audioFiles = await getFilesFromFolder(audioFolderId);
    const videoFiles = await getFilesFromFolder(videoFolderId);

    // 6. Format hasil
    const playlist = [
      ...audioFiles.map(f => ({ title: f.name, url: f.webContentLink })),
      ...videoFiles.map(f => ({ title: f.name, url: f.webContentLink }))
    ];

    res.status(200).json(playlist);

  } catch (error) {
    console.error('Error fetching from Google Drive:', error);
    res.status(500).json({ 
      error: 'Failed to fetch playlist from Google Drive', 
      details: error.message 
    });
  }
}
