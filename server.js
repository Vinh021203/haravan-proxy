require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const TOKEN = process.env.HARAVAN_TOKEN;
const BLOG_ID = process.env.BLOG_ID;
const PORT = process.env.PORT || 3000;

const haravan = axios.create({
  baseURL: "https://apis.haravan.com/web",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

app.get("/", (req, res) => res.json({ status: "OK" }));

// Upload nhiều ảnh
app.post("/api/upload-images", async (req, res) => {
  try {
    const { images } = req.body;
    if (!images?.length)
      return res.status(400).json({ error: "Missing images" });

    const urls = await Promise.all(
      images.map(({ base64, filename }) =>
        haravan
          .post("/themes/assets.json", {
            asset: {
              key: `assets/${Date.now()}-${filename}`,
              attachment: base64,
            },
          })
          .then((r) => r.data.asset.public_url)
      )
    );

    res.json({ success: true, urls });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post bài
app.post("/api/articles", async (req, res) => {
  try {
    const response = await haravan.post(
      `/blogs/${BLOG_ID}/articles.json`,
      req.body
    );
    res.json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server on port ${PORT}`));
