require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = process.env.HARAVAN_TOKEN;
const BLOG_ID = process.env.BLOG_ID;
const PORT = process.env.PORT || 3000;
const API = `https://apis.haravan.com/web/blogs/${BLOG_ID}/articles.json`;

app.get("/", (req, res) =>
  res.json({ status: "OK", message: "Haravan Proxy Running", blog_id: BLOG_ID })
);

app.post("/api/articles", async (req, res) => {
  console.log("📤 Received payload:", JSON.stringify(req.body, null, 2));

  try {
    const response = await axios.post(API, req.body, {
      headers: {
        Authorization: "Bearer " + TOKEN,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Success:", response.status, response.data.article.id);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("❌ Error:", err.response?.status, err.response?.data);
    const status = err.response?.status || 500;
    const data = err.response?.data || { success: false, errors: err.message };
    res.status(status).json(data);
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
