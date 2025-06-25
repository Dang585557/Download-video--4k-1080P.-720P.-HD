// server.js
import express from 'express';
import { exec } from 'child_process';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/video', (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) {
    return res.status(400).json({ error: 'กรุณาระบุ URL' });
  }

  const cmd = `yt-dlp -J "${videoURL}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error('เกิดข้อผิดพลาด:', stderr);
      return res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลได้' });
    }

    try {
      const info = JSON.parse(stdout);
      const formats = info.formats?.map(f => ({
        url: f.url,
        quality: f.format_note || f.quality_label,
        ext: f.ext
      })).filter(f => f.url);

      res.json({ title: info.title, formats });
    } catch (err) {
      console.error('แปลง JSON ไม่ได้:', err);
      res.status(500).json({ error: 'ผิดพลาดในการประมวลผล' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
