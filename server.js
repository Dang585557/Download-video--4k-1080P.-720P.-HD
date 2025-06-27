
 import express from 'express'; 
import cors from 'cors'; 
import { exec } from 'child_process'; 
import fs from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);
const app = express(); const PORT = process.env.PORT || 3000;

app.use(cors()); app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/getVideo', (req, res) => { const videoURL = req.query.url; if (!videoURL) return res.status(400).json({ error: 'ต้องใส่ URL' });

const cmd = yt-dlp -J ${videoURL}; exec(cmd, (error, stdout, stderr) => { if (error) { console.error('เกิดข้อผิดพลาด:', stderr); return res.status(500).json({ error: 'ไม่สามารถดึงวิดีโอได้' }); }
try {
  const data = JSON.parse(stdout);
  const formats = data.formats.map(format => ({
    url: format.url,
    ext: format.ext,
    height: format.height,
    format_note: format.format_note
  })).filter(f => f.url && f.ext === 'mp4');
  res.json({ formats });
} catch (err) {
  console.error('แปลง JSON ผิด:', err);
  res.status(500).json({ error: 'ข้อมูลผิดพลาด' });
}
}); });
app.listen(PORT, () => { 
    console.log(Server เริ่มต้นที่ http://localhost:${PORT}); 
    });

