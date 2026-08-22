import { google } from "googleapis";

export default async function handler(req, res) {
  // 1. Ambil data rahasia dari Vercel Settings
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKeyId = process.env.GOOGLE_PRIVATE_KEY_ID;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  // Cek apakah semua data sudah diisi di Vercel
  if (!clientEmail || !privateKeyId || !privateKey) {
    console.error("❌ ERROR: Data Google belum diisi di Vercel Environment Variables!");
    return res.status(500).json({ 
      error: "Server belum dikonfigurasi. Cek Settings Vercel." 
    });
  }

  try {
    // 2. Buat objek kredensial tanpa pakai file
    const credentials = {
      type: "service_account",
      client_email: clientEmail,
      private_key_id: privateKeyId,
      private_key: privateKey,
      project_id: "dummy-project-id", 
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
    };

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    // 3. MASUKKIN ID FOLDER GOOGLE DRIVE DI SINI! (Hanya ID, tanpa ?usp...)
    // ⚠️ PENTING: Hapus semua tulisan setelah ID (?usp=sharing, dll)
    const audioFolderId = "1K3Wl1lMlIia-Bwojq7zXghdNE3BbMUmO"; 
    const videoFolderId = "1xe_8lg3JGwsyY91HEhkOZ7AiMzRpM_rO";

    // Perbaikan: Cek apakah ID kosong, bukan bandingin sama string lama
    if (!audioFolderId || !videoFolderId) {
       return res.status(500).json({ 
        error: "Tolong masukkan ID Folder Audio dan Video di kode ini!" 
      });
    }

    // Fungsi kecil buat ambil file dari folder
    const getFiles = async (folderId, type) => {
      const res = await drive.files.list({
        q: `'${folderId}' in parents`,
        fields: "files(id, name, mimeType)",
      });
      
      return res.data.files.map(f => ({
        title: f.name,
        // Link download langsung dari Google Drive
        url: `https://drive.google.com/uc?export=download&id=${f.id}`,
        type: type,
        mimeType: f.mimeType
      }));
    };

    // Ambil file audio dan video secara bersamaan (lebih cepat)
    const [audioFiles, videoFiles] = await Promise.all([
      getFiles(audioFolderId, "audio"),
      getFiles(videoFolderId, "video")
    ]);

    // 4. Tambah Header CORS (Wajib buat Vercel)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Kalau browser nanya "OPTIONS" (preflight), langsung kasih OK
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Kirim data playlist ke Bossqu Player
    res.status(200).json({ 
      audio: audioFiles, 
      video: videoFiles,
      count: { audio: audioFiles.length, video: videoFiles.length }
    });

  } catch (err) {
    console.error("❌ Error ambil playlist:", err);
    
    let message = "Gagal ambil playlist dari Google Drive";
    if (err.code === 403) message = "Permission Denied! Service Account kamu belum diinvite ke folder.";
    if (err.code === 404) message = "Folder ID salah. Cek lagi ID folder kamu (pastikan tanpa ?usp)";

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ error: message });
  }
}
