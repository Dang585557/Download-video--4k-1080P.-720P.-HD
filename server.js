import express from 'express';
import { exec } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/video', (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).json({ error: 'กรุณาระบุ URL' });

  const cmd = `yt-dlp -J "${videoURL}"`;
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error('เกิดข้อผิดพลาด:', stderr);
      return res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลวิดีโอได้' });
    }

    try {
      const info = JSON.parse(stdout);
      const formats = info.formats.map(f => ({
        url: f.url,
        quality: f.qualityLabel || '',
        ext: f.ext || ''
      })).filter(f => f.url);

      res.json({ formats });
    } catch (e) {
      res.status(500).json({ error: 'วิเคราะห์ข้อมูลผิดพลาด' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
