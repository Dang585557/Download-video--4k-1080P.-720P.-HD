const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/fb', (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL || !videoURL.includes('facebook.com')) {
    return res.status(400).json({ error: 'ลิงก์ไม่ถูกต้อง' });
  }

  exec(`yt-dlp -f best -g "${videoURL}"`, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: 'ไม่สามารถดึงวิดีโอได้' });
    }
    const directLink = stdout.trim();
    res.json({ download: directLink });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
