const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/fb", (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).json({ error: "ไม่มี URL" });

  const command = `yt-dlp -j ${videoURL}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("yt-dlp error:", stderr);
      return res.status(500).json({ error: "ไม่สามารถดึงวิดีโอได้" });
    }

    try {
      const data = JSON.parse(stdout);
      const formats = data.formats
        .filter(f => f.url && f.ext === "mp4")
        .map(f => ({
          url: f.url,
          quality: f.format_note || f.resolution,
          size: f.filesize
        }));
      res.json({ formats });
    } catch (e) {
      res.status(500).json({ error: "ไม่สามารถแปลงข้อมูลวิดีโอได้" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
