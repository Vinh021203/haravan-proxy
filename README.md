# Haravan Proxy

> Lightweight Express.js API proxy for creating and updating Haravan blog articles.

**Haravan Proxy** is a small backend service that provides a simplified API layer between your application and the [Haravan](https://www.haravan.com/) Web API.

The main purpose of this project is to keep the Haravan API access token on the server while providing a simple REST API for blog article management.

---

## ✨ Features

* 🚀 Lightweight Express.js server
* 🔐 Keeps Haravan API token on the backend
* 📝 Create Haravan blog articles
* ✏️ Update existing blog articles
* 🌐 CORS support
* 📦 JSON request handling
* 🔗 Axios-based Haravan API integration
* ⚙️ Environment-based configuration
* ⏱️ 30-second upstream request timeout
* 📄 Support for large JSON payloads up to 10 MB

---

# 🏗️ Architecture

The project acts as a proxy between your frontend/application and the Haravan API.

```text
┌─────────────────────────┐
│     Frontend / CMS      │
│                         │
│  Blog Editor / Admin UI │
└────────────┬────────────┘
             │
             │ HTTP Request
             ▼
┌─────────────────────────┐
│      Haravan Proxy      │
│                         │
│       Express.js        │
│                         │
│  POST /api/articles     │
│  PUT  /api/articles/:id │
└────────────┬────────────┘
             │
             │ Bearer Token
             ▼
┌─────────────────────────┐
│      Haravan API        │
│                         │
│   Blog / Article API    │
└─────────────────────────┘
```

The proxy is responsible for attaching the Haravan authentication token and forwarding requests to the Haravan Web API.

---

# 🔄 Request Flow

## Create Article

```text
Client
  │
  │ POST /api/articles
  ▼
Express Server
  │
  │ Add Authorization header
  ▼
Haravan API
  │
  │ Create article
  ▼
Haravan
  │
  ▼
Response
  │
  ▼
Client
```

## Update Article

```text
Client
  │
  │ PUT /api/articles/:id
  ▼
Express Server
  │
  │ Add Authorization header
  ▼
Haravan API
  │
  │ Update article
  ▼
Haravan
  │
  ▼
Response
  │
  ▼
Client
```

---

# 🛠️ Tech Stack

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| Node.js         | JavaScript runtime              |
| Express.js      | REST API server                 |
| Axios           | HTTP client for Haravan API     |
| dotenv          | Environment variable management |
| CORS            | Cross-origin request handling   |
| Haravan Web API | Blog/article management         |

---

# 📁 Project Structure

```text
haravan-proxy/
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
├── .gitattributes
└── README.md
```

The current project intentionally keeps the architecture small because the proxy only needs a few API routes.

---

# ⚙️ Requirements

Before running the project, make sure you have:

* Node.js 18+
* npm
* A Haravan store
* A valid Haravan API access token
* A valid Haravan Blog ID

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/Vinh021203/haravan-proxy.git

cd haravan-proxy
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```text
.env
```

Example:

```env
HARAVAN_TOKEN=your_haravan_access_token

BLOG_ID=your_blog_id

PORT=3000
```

### Environment Variables

| Variable        | Required | Description              | Example      |
| --------------- | -------- | ------------------------ | ------------ |
| `HARAVAN_TOKEN` | Yes      | Haravan API access token | `your_token` |
| `BLOG_ID`       | Yes      | Target Haravan blog ID   | `123456`     |
| `PORT`          | No       | Server port              | `3000`       |

If `PORT` is not specified, the server uses:

```text
3000
```

---

# 🔐 Authentication

The Haravan access token is loaded from:

```env
HARAVAN_TOKEN=your_haravan_access_token
```

The token is then attached to requests sent to Haravan using:

```http
Authorization: Bearer YOUR_TOKEN
```

The token is never expected to be supplied by the frontend.

This allows the frontend to communicate with your own backend without exposing the Haravan credential directly in browser-side code.

---

# 🌐 Haravan API

The proxy communicates with:

```text
https://apis.haravan.com/web
```

The Axios client is configured with:

```text
Base URL:
https://apis.haravan.com/web

Authentication:
Bearer Token

Content-Type:
application/json

Timeout:
30 seconds
```

---

# 📡 API Reference

## Health Check

The root endpoint can be used to verify that the server is running.

### Request

```http
GET /
```

### Example

```bash
curl http://localhost:3000/
```

### Response

```json
{
  "status": "OK",
  "blog_id": "YOUR_BLOG_ID"
}
```

---

# 📝 Create Article

Create a new article in the configured Haravan blog.

### Request

```http
POST /api/articles
```

### Headers

```http
Content-Type: application/json
```

### Example Request

```json
{
  "article": {
    "title": "My First Article",
    "body_html": "<p>Hello from Haravan Proxy.</p>",
    "tags": "technology, web development"
  }
}
```

### cURL

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "article": {
      "title": "My First Article",
      "body_html": "<p>Hello from Haravan Proxy.</p>",
      "tags": "technology, web development"
    }
  }'
```

The proxy forwards the request to:

```text
POST /blogs/{BLOG_ID}/articles.json
```

on the Haravan API.

---

# ✏️ Update Article

Update an existing Haravan article.

### Request

```http
PUT /api/articles/:id
```

Where:

```text
:id = Haravan article ID
```

### Example

```http
PUT /api/articles/123456
```

### Request Body

```json
{
  "article": {
    "title": "Updated Article",
    "body_html": "<p>Updated content.</p>",
    "tags": "technology, haravan"
  }
}
```

### cURL

```bash
curl -X PUT http://localhost:3000/api/articles/123456 \
  -H "Content-Type: application/json" \
  -d '{
    "article": {
      "title": "Updated Article",
      "body_html": "<p>Updated content.</p>",
      "tags": "technology, haravan"
    }
  }'
```

The proxy forwards the request to:

```text
PUT /blogs/{BLOG_ID}/articles/{ARTICLE_ID}.json
```

on the Haravan API.

---

# 📋 API Summary

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| `GET`  | `/`                 | Check server status |
| `POST` | `/api/articles`     | Create an article   |
| `PUT`  | `/api/articles/:id` | Update an article   |

---

# 📦 Request Examples

## Create Article

```json
{
  "article": {
    "title": "Welcome to My Blog",
    "body_html": "<h2>Hello World</h2><p>This is my first article.</p>",
    "tags": "blog, technology"
  }
}
```

## Update Article

```json
{
  "article": {
    "title": "Updated Blog Post",
    "body_html": "<h2>Updated Content</h2><p>This article has been updated.</p>",
    "tags": "blog, development"
  }
}
```

---

# ❌ Error Handling

The server forwards the HTTP status returned by Haravan when available.

If Haravan returns an error, the proxy responds with the corresponding status and error body.

The general error flow is:

```text
Haravan API Error
       │
       ▼
Axios Error
       │
       ▼
Express Error Handler
       │
       ├── HTTP Status from Haravan
       │
       └── Error Response
```

If no HTTP status is available, the server returns:

```text
500 Internal Server Error
```

with a JSON error response.

---

# 📦 JSON Body Limit

The Express server accepts JSON requests up to:

```text
10 MB
```

This is configured to support article content containing relatively large HTML bodies and associated data.

---

# ⏱️ API Timeout

Requests from the proxy to Haravan have a timeout of:

```text
30 seconds
```

If Haravan does not respond within the configured timeout, Axios throws an error and the proxy returns the corresponding error response.

---

# 🌐 CORS

CORS is enabled for the API:

```javascript
app.use(cors());
```

This allows the proxy to be called from a separate frontend application.

For production deployments, it is recommended to restrict allowed origins instead of allowing all origins.

For example:

```javascript
app.use(
  cors({
    origin: "https://your-frontend-domain.com"
  })
);
```

---

# 🔒 Security

The most important security requirement is protecting:

```text
HARAVAN_TOKEN
```

Never expose the token in:

* Frontend JavaScript
* Browser local storage
* Public GitHub repositories
* Client-side environment variables
* Public API responses

The recommended architecture is:

```text
Browser
   │
   │ No Haravan token
   ▼
Your Backend
   │
   │ Bearer Token
   ▼
Haravan API
```

---

# 🧪 Local Testing

Start the server:

```bash
npm start
```

The server will run on:

```text
http://localhost:3000
```

Check the health endpoint:

```bash
curl http://localhost:3000/
```

Expected response:

```json
{
  "status": "OK",
  "blog_id": "YOUR_BLOG_ID"
}
```

---

# ▶️ Running the Project

The current project does not define a dedicated `start` script in `package.json`.

You can start the server directly with:

```bash
node server.js
```

For development:

```bash
node --watch server.js
```

If you prefer the standard command:

```bash
npm start
```

add the following script to `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

---

# 📜 Dependencies

The project currently includes:

```text
express
axios
cors
dotenv
form-data
node-fetch
```

## Express

Provides the HTTP server and REST API routing.

## Axios

Handles communication between the proxy and Haravan API.

## CORS

Allows frontend applications hosted on different origins to communicate with the proxy.

## dotenv

Loads environment variables from `.env`.

## form-data

Provides support for multipart/form-data operations if required by future integrations.

## node-fetch

Provides Fetch API functionality for Node.js integrations.

---

# 🎯 Use Case

This project is useful when you have a separate frontend or content management interface that needs to publish articles to Haravan.

For example:

```text
┌────────────────────────────┐
│       Admin Dashboard      │
│                            │
│  Article Editor            │
│  Title                     │
│  Content                   │
│  Tags                      │
└─────────────┬──────────────┘
              │
              │ POST /api/articles
              ▼
┌────────────────────────────┐
│      Haravan Proxy         │
│                            │
│   Express.js + Axios       │
└─────────────┬──────────────┘
              │
              │ Bearer Token
              ▼
┌────────────────────────────┐
│       Haravan API          │
│                            │
│       Blog Articles        │
└────────────────────────────┘
```

This approach keeps the third-party API credential on the server and provides the frontend with a simpler API.

---

# 🚀 Deployment

The project can be deployed to any Node.js-compatible hosting platform.

Examples include:

* Vercel
* Render
* Railway
* Fly.io
* VPS
* Docker-based hosting
* Other Node.js hosting platforms

Before deployment, configure:

```env
HARAVAN_TOKEN=your_production_token

BLOG_ID=your_production_blog_id

PORT=3000
```

---

# 🐳 Docker

A Docker setup can be added in the future if containerized deployment is required.

A typical production architecture would be:

```text
Internet
   │
   ▼
Reverse Proxy
   │
   ▼
Haravan Proxy
   │
   ▼
Haravan API
```

---

# 🔧 Recommended Production Improvements

The current implementation is intentionally lightweight. For a production-grade service, the following improvements would be useful:

* [ ] Restrict CORS origins
* [ ] Add request validation
* [ ] Add authentication for proxy users
* [ ] Add rate limiting
* [ ] Add structured logging
* [ ] Add request IDs
* [ ] Add API documentation
* [ ] Add automated tests
* [ ] Add health/readiness endpoints
* [ ] Add graceful shutdown
* [ ] Add Docker support
* [ ] Add CI/CD
* [ ] Add centralized error handling
* [ ] Add request/response logging
* [ ] Add API versioning

---

# 🧩 Future API

Potential future endpoints:

```text
GET    /api/articles
GET    /api/articles/:id
POST   /api/articles
PUT    /api/articles/:id
DELETE /api/articles/:id
```

This would turn the proxy into a more complete Haravan blog management API.

---

# 📊 Architecture Benefits

Using a backend proxy provides several advantages.

### Security

The Haravan API token remains on the server.

### Simplicity

The frontend communicates with a small internal API instead of implementing Haravan-specific authentication and request handling.

### Separation of Concerns

```text
Frontend
   │
   │ Application logic
   ▼
Backend
   │
   │ Integration logic
   ▼
Haravan
```

### Extensibility

The proxy can later become a centralized integration layer for:

* Blog management
* Product management
* Orders
* Customers
* Media
* Other Haravan APIs

---

# 📈 Current Scope

The current repository intentionally focuses on a small scope:

```text
Haravan Proxy
│
├── Server health
│
├── Create article
│
└── Update article
```

It does **not** currently implement a complete Haravan management system.

---

# 👨‍💻 Author

**VinhWorks / Vinh**

Digital Developer & Web Development

### Portfolio

[vinhwork.io.vn](https://vinhwork.io.vn)

### GitHub

[Vinh021203](https://github.com/Vinh021203)

---

# 🔗 Repository

[GitHub — Vinh021203/haravan-proxy](https://github.com/Vinh021203/haravan-proxy)

---

# 📄 License

This project currently uses the `ISC` license as specified in `package.json`.

---

# ⭐ Support

If this project is useful to you, consider giving the repository a ⭐ on GitHub.

**Haravan Proxy**

A lightweight bridge between your application and the Haravan Blog API.
