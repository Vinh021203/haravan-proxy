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
const API = `https://apis.haravan.com/web/blogs/${BLOG_ID}/articles.json`;
const ASSET_API = `https://apis.haravan.com/web/themes/assets.json`;

app.get("/", (req, res) =>
  res.json({ status: "OK", message: "Haravan Proxy Running", blog_id: BLOG_ID })
);

// 🆕 UPLOAD NHIỀU ẢNH
app.post("/api/upload-images", async (req, res) => {
  try {
    const { images } = req.body;
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: "Missing images array" });
    }

    const uploadPromises = images.map(async ({ base64, filename }) => {
      const response = await axios.post(
        ASSET_API,
        {
          asset: {
            key: `assets/${filename}`,
            attachment: base64,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.asset.public_url;
    });

    const urls = await Promise.all(uploadPromises);
    res.json({ success: true, urls });
  } catch (err) {
    console.error("Upload error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// POST ARTICLE
app.post("/api/articles", async (req, res) => {
  try {
    const response = await axios.post(API, req.body, {
      headers: {
        Authorization: "Bearer " + TOKEN,
        "Content-Type": "application/json",
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { success: false, errors: err.message };
    res.status(status).json(data);
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
