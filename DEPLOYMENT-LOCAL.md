# Running the Amigos SACCO Examination System on a Local Machine

Every command below was run end to end on a clean checkout of this archive
before this guide was written. Install counts and timings are from that run.

**Architecture:** two processes. An Express API on port **5000** and a React
dev server on port **3000**. MongoDB is a third piece, either local or Atlas.
The React dev server proxies `/api/*` to port 5000 automatically (set by
`"proxy"` in `frontend/package.json`), which is why you do **not** set an API
URL for local development.

---

## Step 0 — Prerequisites

| Tool | Version | Check with |
|---|---|---|
| Node.js | 20 LTS or 22 | `node -v` |
| npm | 10+ | `npm -v` |
| MongoDB | 6 or 7 (local), or an Atlas cluster | `mongod --version` |
| Git | any | `git --version` |

Node 20 LTS is the safest choice. The build is verified on Node 22.22; older
than 18 will fail because `react-scripts` 5 needs modern crypto APIs.

**A working webcam and a modern Chrome or Edge are required** to exercise the
proctoring features. Firefox works but its face-detection performance under
TensorFlow.js is noticeably worse.

---

## Step 1 — Unpack and enter the project

```bash
unzip Amigos-AI-Exam-System-Branded.zip
cd AI-Proctored-System-main-main
```

You should see `backend/`, `frontend/`, `package.json`, `BRANDING.md`.

---

## Step 2 — Install backend dependencies

From the **project root** (the root `package.json` *is* the backend's):

```bash
npm install
```

Expect roughly 209 packages in under a minute. Two deprecation warnings
(`json2csv`, `lodash.get`) and an audit summary are normal and do not block
anything. **Do not run `npm audit fix --force`** — it will pull breaking major
versions of Express and Mongoose.

---

## Step 3 — Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

Expect roughly 1,675 packages in about a minute — TensorFlow.js and Monaco are
large. This completes cleanly; you do **not** need `--legacy-peer-deps`.

---

## Step 4 — Start MongoDB

### Option A — local MongoDB

macOS (Homebrew):
```bash
brew services start mongodb-community
```

Ubuntu/Debian:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod     # optional: start on boot
```

Windows: MongoDB installs as a service and usually runs already. Otherwise
open Services and start **MongoDB Server**.

Confirm it is listening:
```bash
mongosh --eval "db.runCommand({ping:1})"
```

You do not need to create the database. Mongoose creates `amigos_exams` on
first write.

### Option B — MongoDB Atlas

Create a free M0 cluster, add a database user, and under **Network Access**
allow your current IP. Copy the connection string for Step 5.

---

## Step 5 — Create the `.env` file

In the **project root**, not in `backend/`:

```bash
cp .env.example .env
```

Then edit it. The two lines that matter:

```env
MONGO_URL=mongodb://127.0.0.1:27017/amigos_exams
JWT_SECRET=<paste a long random string here>
```

Generate the secret rather than inventing one:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Use `127.0.0.1` rather than `localhost` in `MONGO_URL`. On Node 18+ `localhost`
can resolve to IPv6 `::1` while MongoDB listens only on IPv4, which produces a
confusing `ECONNREFUSED ::1:27017`.

If you are on Atlas, paste the `mongodb+srv://...` string instead and
URL-encode special characters in the password (`@` → `%40`, `#` → `%23`).

Leave `REACT_APP_BACKEND_URL` unset for local work. The dev-server proxy
handles it, and setting it will break cookie-based auth across origins.

---

## Step 6 — Run both processes

From the project root:

```bash
npm run dev
```

This uses `concurrently` to start the API and the React dev server together.
You are looking for two lines:

```
server is running on http://localhost:5000
MongoDB Connected
```

and then the React dev server opening `http://localhost:3000`.

**If you prefer two terminals** (better logs, and the API keeps running while
you restart the frontend):

```bash
# terminal 1
npm run server        # nodemon backend/server.js

# terminal 2
npm run client        # react-scripts start
```

Confirm the API independently:

```bash
curl http://localhost:5000/api/brand
```

That returns the Amigos brand manifest — palette, fonts, org identity, badge
tiers. It is public and needs no token, so it is the quickest proof that the
server, routing and the branding layer are all live.

---

## Step 7 — Create the first accounts

Open `http://localhost:3000`. You land on the branded login card.

There is no seeded admin, so:

1. Click **Create an account**.
2. Register once with role **Administrator** — this is your exam manager.
3. Register again with role **Employee / Student** — this is your test candidate.

Registration asks for **Branch** and **Department**. Those lists come from
`frontend/src/data/orgData.js`, which currently holds 9 branches, not the full
53. See `BRANDING.md` §8 — worth fixing before real use, because the branch is
snapshotted onto the certificate permanently at issue time.

Register the candidate in a **private/incognito window** so you can hold both
sessions at once without logging in and out.

---

## Step 8 — Walk the full path once

This is the smoke test that proves the whole system, branding included:

1. **As admin:** *Create Exam* → set a title, duration and pass mark.
2. **As admin:** *Add Questions* → add at least 3, in English and Amharic.
3. **As candidate:** *Exams* → start the exam. Grant camera permission when
   prompted; the attempt will not start without it.
4. **During the attempt:** switch browser tabs deliberately, then look away
   from the camera. Both should raise violations.
5. **As admin:** *Exam Logs* → confirm the violations were recorded with
   timestamps.
6. **As candidate:** once the result is released, open *Certificates & Badges*
   and download the PDF. Check the Amigos lockup, the issuing seal, the 70/30
   rule across the head, and the QR code.
7. **Scan the QR** with a phone on the same network, or open the `/verify/...`
   URL directly. The public verification page should render the full Amigos
   lockup and a **VALID** chip.

If the language toggle in the header is switched to አማርኛ, the certificate PDF
must still render Amharic correctly — that is functional point FP-10.3, and it
depends on the Noto Ethiopic fonts loaded in `frontend/public/index.html`.

---

## Step 9 — Optional: run the production build locally

To see exactly what a deployed instance looks like, served by Express as a
single origin on port 5000:

```bash
npm run build                     # builds frontend/build
NODE_ENV=production npm start     # Express serves the API *and* the built app
```

Then open `http://localhost:5000`. On Windows PowerShell:

```powershell
$env:NODE_ENV="production"; npm start
```

The build completes with ESLint warnings only — unused imports inherited from
the original template. No errors.

---

## Troubleshooting

**`MONGO_URL is not defined`** — the `.env` is in the wrong place. It belongs in
the project root, beside `package.json`, not in `backend/`.

**`ECONNREFUSED ::1:27017`** — IPv6 resolution. Change `localhost` to
`127.0.0.1` in `MONGO_URL`.

**`EADDRINUSE :::5000`** — something else holds port 5000. On macOS this is
often AirPlay Receiver; turn it off in System Settings → General → AirDrop &
Handoff, or change `PORT` in `.env` **and** the `proxy` value in
`frontend/package.json` to match.

**Camera never prompts** — `getUserMedia` needs a secure context. `localhost`
counts as secure; `127.0.0.1:3000` in some browsers and any LAN IP such as
`192.168.x.x` do not. Use `http://localhost:3000`.

**Login succeeds but every API call then 401s** — you have set
`REACT_APP_BACKEND_URL`. Unset it and restart the dev server; auth cookies do
not survive the cross-origin hop.

**Blank page, console shows a chunk load error** — stale build cache. Run
`rm -rf frontend/node_modules/.cache` and restart.

**Proctoring never initialises** — the TensorFlow models are fetched from a CDN
at runtime. The machine needs internet access on first load even though
everything else is local.

**`frontend/vercel.json` points at someone else's server** — it rewrites `/api`
to `https://ai-proctored-system.onrender.com`, the original template author's
deployment. It is ignored locally, but edit it before you deploy to Vercel.
