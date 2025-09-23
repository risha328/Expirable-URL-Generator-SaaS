Expireo – Expirable URL Generator SaaS

A full-stack MERN-based SaaS platform to generate short, expirable, password-protected, and trackable URLs for secure sharing.
Inspired by Bitly, OneTimeSecret, and File.io, but enhanced with advanced analytics, expiration control, and security features.

✨ Features
🔗 Core

URL Shortening – Create short links with custom slugs

Expirable URLs – Time-based expiry (minutes, hours, days)

Password Protection – Secure links with optional password

One-Time Access Links – Auto-expire after first click

File Sharing Support (future) – Upload files with expiry

📊 Analytics

Track clicks, devices, browsers, and geo-location

Dashboard with charts (Recharts / Chart.js)

Top links & active users

🔐 Security

End-to-End Encryption (E2EE) for secret links

Role-based access (Admin, User)

Two-Factor Authentication (2FA) (optional)

Abuse detection & reporting system

⚙️ Admin Features

User management (ban/unban, reset password)

Link management (view, delete, force expire)

Abuse monitoring & system logs

SMTP / Email integration (reset password, alerts)

🆚 Why Different from Bitly, OneTimeSecret, and File.io?

Bitly → Focuses only on link shortening & analytics.

OneTimeSecret → Focuses only on secret message sharing (one-time view).

File.io → Focuses only on file sharing with expiration.

✅ Expireo combines all three:

Short links like Bitly

Secret sharing like OneTimeSecret

Expirable links/files like File.io

Plus click tracking + analytics + admin control, making it an all-in-one secure sharing SaaS.

🛠️ Tech Stack

Frontend

React.js + Vite

Tailwind CSS + shadcn/ui

Redux Toolkit (state management)

Framer Motion (animations)

Backend

Node.js + Express.js

MongoDB + Mongoose

JWT Authentication

Nodemailer (SMTP for emails)

node-cron (auto-delete expired links)

Others

Docker (optional)

Firebase/Cloudinary (for optional file uploads)

📂 Project Structure
expireo/
│── backend/          # Express + MongoDB backend
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express routes (auth, url, admin)
│   ├── controllers/  # Business logic
│   └── utils/        # Helpers (jwt, mailer, etc.)
│
│── frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── pages/    # Dashboard, CreateLink, Analytics
│   │   ├── components/ # Reusable UI
│   │   └── api/      # Axios config
│
│── README.md
│── .env.example
│── docker-compose.yml

🚀 Getting Started
1️⃣ Clone Repo
git clone https://github.com/your-username/expireo.git
cd expireo

2️⃣ Setup Backend
cd backend
npm install
cp .env.example .env
npm run dev

3️⃣ Setup Frontend
cd frontend
npm install
npm run dev

4️⃣ Environment Variables (.env)
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret
BASE_URL=http://localhost:5000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

📊 Sidebar (Admin Panel)

Dashboard (stats & graphs)

Users → All Users, Roles & Permissions

Links → All Links, Reported/Abuse Links

Analytics → System Analytics, Traffic Insights

Settings → General, SMTP/Email, Security

Logs → System Logs, Alerts

📸 Screenshots (add later)

 Dashboard with charts

 Create short link page

 Analytics page

 Admin panel

📧 Email/SMTP Setup

We use Nodemailer for sending emails (password reset, alerts).
👉 For Gmail, enable App Passwords under your Google Account (Security → 2FA → App Passwords).


📜 License

MIT License © 2025 [Risha Mondal]
