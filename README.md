# Verbilo AI - AI Auto-Caption Platform for Creators

A complete full-stack web application designed specifically for creators (Instagram Reels, YouTube Shorts, and TikTok).

---

## 🌟 Key Features

1. **Multilingual Speech & Script Engine**:
   - **Hinglish**: Hindi spoken language displayed in natural phonetic English script (*"Aaj hum seekhenge viral reels ke captions kaise banate hain! 🔥"*).
   - **Hindi (हिंदी)**: Native Devanagari script.
   - **Bengali (বাংলা)**: Native Bengali script with font rendering (*"আজকে আমরা শিখবো কীভাবে ভাইরাল ক্যাপশন তৈরি করবেন! ✨"*).
   - **Tamil (தமிழ்)** & **Telugu (తెలుగు)** & **Marathi (मराठी)**.
   - **Indian English**.

2. **Viral Subtitle Presets**:
   - **Hormozi Viral**: High-contrast Yellow (`#FFE600`) with bold black outline and 115% active word scaling.
   - **Cyber Neon**: Electric Cyan (`#00F0FF`) with neon glow.
   - **Submagic Pop**: Magenta (`#FF007A`) with dynamic emoji highlights.
   - **Green Beast**: MrBeast style high-visibility green (`#00FF66`).
   - **Clean Minimal**: Semi-translucent dark pill with crisp typography.

3. **Interactive Studio Player**:
   - 9:16 smartphone vertical reel preview.
   - Real-time word-by-word synced subtitle animation.
   - Interactive timeline scrubber, speed, and volume controls.
   - One-click jump to any word's timestamp.
   - Inline text editing to fix spellings or adjust slang.
   - Auto-insert viral emojis (🔥, 🚀, 💰, 🤫, 🤯, 💯).
   - Instant `.SRT` download and backend MP4 rendering.

---

## 🚀 Quick Start

### 1. Launch Both Servers (One Click on Windows)
Double-click:
```powershell
run_dev.bat
```

### 2. Manual Start

**Backend (FastAPI)**:
```powershell
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

**Frontend (Vite React + TypeScript + Tailwind CSS)**:
```powershell
cd frontend
npm run dev
```
Frontend Studio will be live at: [http://localhost:5173](http://localhost:5173)
