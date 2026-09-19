# URL Shortener API

A URL shortener API built with React.js, Node.js, Express, MongoDB and Redis. It converts a long URL into a short code using Base62 encoding, and uses MongoDB indexing and Redis caching to make redirects fast.

## Screenshots

### Home page
<img width="1534" height="734" alt="image" src="https://github.com/user-attachments/assets/12bc3b05-d988-4834-be01-d67743737a79" />

### Short URL generated
<img width="1535" height="734" alt="image" src="https://github.com/user-attachments/assets/8ddf1ac9-e064-4414-8396-549727177927" />

### URL Working on browser
https://github.com/user-attachments/assets/25f0909b-2c65-463d-a8e9-0eb6ca47304f

### Invalid URL error
<img width="1535" height="730" alt="image" src="https://github.com/user-attachments/assets/3bde3a01-f525-4e02-90f1-585ba7b7ae41" />

## Tech Stack

- **Backend:** Node.js, Express 5
- **Database:** MongoDB (Atlas)
- **Cache:** Redis
- **Frontend:** React

## How It Works

**Shorten a URL**
1. Validate the URL (only `http` and `https` are allowed).
2. Get the next number from an atomic counter in MongoDB.
3. Convert that number to a Base62 short code.
4. Save the short code and the original URL in MongoDB.
5. Return the short URL.

**Redirect**
1. Check Redis for the short code.
2. On a cache hit, redirect immediately.
3. On a cache miss, look it up in MongoDB, store it in Redis, then redirect.
4. If the short code doesn't exist, return 404.

## API Endpoints

### `POST /api/createShortUrl`

Request body:
```json
{ "url": "https://example.com/some/very/long/link" }
```

Response: the short URL as text, e.g. `http://localhost:9000/1a`

| Status | Meaning |
|--------|---------|
| 200 | Short URL created |
| 400 | Invalid URL |
| 500 | Internal server error |

### `GET /:shortUrl`

Redirects to the original URL.

| Status | Meaning |
|--------|---------|
| 302 | Redirect to the original URL |
| 404 | Short URL not found |
| 500 | Internal server error |

## Setup

1. Clone the repository
```bash
   git clone https://github.com/karkera-saakshi/url-shortener.git
```

2. Create a `.env` file inside `backend/`
```
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   BASE_URL=http://localhost:9000
```

3. Run the backend (runs on port 9000)
```bash
   cd backend
   npm install
   node server.js
```

4. Run the frontend
```bash
   cd frontend/frontend-url-shortener
   npm install
   npm run dev
```

## Project Structure

```
backend/
├── controllers/   # Handle request and response
├── models/        # Database and cache logic
├── routes/        # API routes
├── utils/         # URL validator, Base62 generator, Redis client
└── server.js
frontend/
└── frontend-url-shortener/   # React (Vite) app
```

---

## Concepts I Learned

### 1. Base62 Encoding
- **What:** Converting a number into a string using 62 characters (`0-9`, `a-z`, `A-Z`).
- **Why:** It gives short, URL-friendly codes. Just 6 characters can represent 62⁶ ≈ 56 billion URLs.
- **In this project:** The counter value (1, 2, 3...) is divided by 62 repeatedly, and the remainders are mapped to characters.
- **Trade-off:** Codes are sequential, so anyone can guess the next one.

### 2. Atomic Counter with `$inc`
- **What:** An atomic operation completes as one indivisible step. MongoDB's `$inc` reads and increases the counter in a single operation.
- **Why:** Suppose two requests arrive at the same time and both try to read the counter. Because the operation is atomic, MongoDB handles one request first, and the second waits for a fraction of a second. So each request gets a different number, and no two URLs ever get the same short code.
- **In this project:** `findOneAndUpdate` with `$inc` and `upsert` on a `counters` collection.
- **Trade-off:** All requests depend on one counter, which can become a bottleneck at very large scale.

### 3. Indexing (B-tree)
- **What:** A B-tree index is a data structure that lets the database find a document without scanning the whole collection. Uniqueness is a separate rule added on top of an index.
- **Why:** Every redirect looks up a document by `shortUrl`. Without an index, each lookup scans all documents (`COLLSCAN`). With an index, it jumps straight to the document (`IXSCAN`).
- **In this project:** A unique index on `shortUrl`, created in mongosh:
```js
  db.urls.createIndex({ shortUrl: 1 }, { unique: true })
```
  There is no unique index on the original URL, because many people can shorten the same long URL, so duplicates there are valid.
- **Check it:** `db.urls.getIndexes()` lists the indexes, and `.explain("executionStats")` shows whether a query uses one.
- **Trade-off:** Indexes make reads faster but use extra storage and slightly slow down writes. An index created by hand in Atlas exists only in that database, so creating it in code at startup with `createIndex` makes it reproducible.

### 4. Redis Cache-Aside Pattern
- **What:** The app checks the cache first. On a miss, it reads from the database and then stores the result in the cache.
- **Why:** Redis keeps data in memory, so reads are much faster than a database query.
- **In this project:** The redirect flow checks Redis first, falls back to MongoDB, then saves the result in Redis.
- **Trade-off:** Cached data can go stale, and memory can grow without limit unless keys expire. A TTL (expiry time) on cached keys solves this.

### 5. Read-Heavy System Design
- **What:** A system where reads happen far more often than writes.
- **Why it matters here:** A short link is created once but clicked many times, so redirects must be fast. This is why the design uses an index and a cache on the read path.
- **Interview point:** For read-heavy systems, use caching, indexing, and keep the read path as short as possible.

### 6. Graceful Shutdown
- **What:** Handling `SIGINT` (Ctrl + C) and `SIGTERM` (sent by Docker or hosting platforms) so the app cleans up before it stops.
- **In this project:** The Redis connection is closed when the server receives these signals.
- **Why:** Closing connections cleanly avoids leaked connections and half-finished requests.
