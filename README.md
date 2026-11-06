# UTH Festival 2026 – Music Talent Recruitment & Audition Platform
### Grand Egyptian Museum • November 20–21, 2026

A complete, professional music talent recruitment, audition management, and jury scoring web platform built with Next.js 14, React 18, Tailwind CSS, Leaflet, and Node.js.

> **Notice**: Built as an independent audition application demo platform scouting undiscovered musical talents for UTH Festival 2026.

---

## 🌟 Key Features

- **Bilingual & RTL**: Full Arabic (RTL) and English (LTR) language support with instant toggle.
- **Dynamic Countdown**: Real-time timer to the application deadline (**November 12, 2026**).
- **6-Step Registration**:
  1. Personal Details (National ID, auto age calculation, emergency contact).
  2. Address & Voluntary Leaflet GPS Location Picker with draggable pin.
  3. Educational Information (academic degree, music education, self-taught flag).
  4. Musical Talent (category, genre, experience, links to Spotify/YouTube/Instagram/SoundCloud, questionnaire).
  5. Required Document Vault (National ID front/back, artist photo, degree certificate).
  6. Audition Video Upload (strictly validated between 60–90 seconds; MP4/MOV preview).
- **Confirmation & Receipts**: Unique reference number generator (`UTH-2026-XXXX`) and printable receipt.
- **Private Admin & Jury Portal (`/admin`)**:
  - Live statistics and demographic charts (Governorates, Categories, Age groups).
  - Searchable applicants database with multi-criteria filtering and CSV export.
  - Complete Applicant Dossier with built-in audition video player.
  - 5-axis Jury Performance Scoring (1–10 on Vocal Quality, Stage Presence, Musical Talent, Originality, Overall Performance).
  - Direct WhatsApp Chat (`https://wa.me/...`) and Email shortcuts.
  - Audition & Interview Scheduling.
  - Interactive Geographic Distribution Map of Egypt with applicant pins and details.
  - Audit Trail logging all actions.

---

## 🔑 Demo Admin Accounts

| Role | Email | Password |
|---|---|---|
| **Super Admin (General Director)** | `admin@uthfestival.com` | `UTHAdmin2026!` |
| **Lead Artistic Jury** | `jury@uthfestival.com` | `JuryReview2026!` |
| **Security & Compliance** | `security@uthfestival.com` | `Security2026!` |

---

## 🚀 Running Locally & Deploying to Railway

### 1. Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 2. Railway Deployment
1. Link your GitHub repository (`https://github.com/z0maaa/nile.git`) to **Railway**.
2. Railway will automatically detect Next.js and run:
   - Build: `npm run build`
   - Start: `npm run start` (binds automatically to Railway's dynamic `$PORT`).
3. (Optional) Set environment variable in Railway:
   - `JWT_SECRET=any-long-secure-random-secret`

