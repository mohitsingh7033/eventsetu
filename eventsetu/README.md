# EventSetu — MERN Event Management System

Full-stack event management platform: browse & search events, book seats with
a simulated payment flow, manage bookings, and an admin dashboard to create/edit/delete
events and view revenue stats.

## Tech stack
- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt
- **Payments:** Dummy/simulated gateway (always succeeds) — swap in Razorpay/Stripe later, see note below

## Features
- User register/login (JWT), role-based access (`user` / `admin`)
- Browse, search, and filter events by category
- Book seats -> simulated payment -> booking confirmed, seats decremented
- "My Bookings" page with cancel option (restores seats)
- Admin dashboard: stats (events/users/bookings/revenue), create/edit/delete events, recent bookings
- Seed script to create a default admin account

---

## 1. Local setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (Atlas or local) and JWT_SECRET
npm run dev          # starts on http://localhost:5000
node seed/seedAdmin.js   # optional: creates admin@example.com / admin123
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev          # starts on http://localhost:5173
```

Open http://localhost:5173, sign up as a normal user, or log in as the seeded
admin (`admin@example.com` / `admin123`) to access `/admin`.

---

## 2. Deploy (Vercel + Render + MongoDB Atlas)

### Step A — MongoDB Atlas (free tier)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster.
3. Database Access → add a user with a password.
4. Network Access → Add IP Address → **Allow access from anywhere** (0.0.0.0/0) — needed since Render's IP isn't static.
5. Connect → Drivers → copy the connection string, looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/eventdb?retryWrites=true&w=majority`

### Step B — Backend on Render
1. Push this project to a GitHub repo.
2. https://render.com → New → Web Service → connect your repo.
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (Render dashboard → Environment):
   - `MONGO_URI` = (from Atlas, step A)
   - `JWT_SECRET` = any long random string
   - `CLIENT_URL` = your Vercel URL (add after Step C; you can redeploy to update it)
   - `PORT` = 5000 (Render sets its own PORT env var automatically too, server.js already respects `process.env.PORT`)
7. Deploy. Note the live URL, e.g. `https://gather-backend.onrender.com`

### Step C — Frontend on Vercel
1. https://vercel.com → New Project → import the same repo.
2. Root directory: `frontend`
3. Framework preset: Vite (auto-detected)
4. Environment variable:
   - `VITE_API_URL` = `https://gather-backend.onrender.com/api` (your Render URL + `/api`)
5. Deploy. Vercel gives you a URL like `https://gather.vercel.app`

### Step D — connect the two
1. Go back to Render → your backend service → Environment → set `CLIENT_URL` to your Vercel URL → save (triggers redeploy). This makes CORS accept requests from your live frontend.
2. Visit your Vercel URL, sign up, and test booking an event end-to-end.

### Step E — create an admin on the live DB
Render → your service → Shell tab → run:
```bash
node seed/seedAdmin.js
```
(or manually update a user's `role` field to `"admin"` in Atlas's Collections view)

---

## 3. Swapping in a real payment gateway
`backend/controllers/bookingController.js` has a clearly marked block simulating
payment success. To go live with Razorpay/Stripe:
1. Create an order on their API before confirming the booking.
2. Return the order/checkout details to the frontend.
3. On the frontend, open their checkout widget.
4. On success callback, hit a `/api/bookings/verify` endpoint (you'd add this)
   that verifies the payment signature server-side before marking `paymentStatus: 'paid'`.

## Project structure
```
eventsetu/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── models/
│   ├── routes/
│   ├── seed/seedAdmin.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/
        └── pages/
```
