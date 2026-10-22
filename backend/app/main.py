import os
import sys

# Ensure UTF-8 output encoding on Windows console for Hindi / Hinglish / emojis
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import shutil
import uuid
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add the backend and app directory to Python path for imports to work properly
import sys
_current_dir = os.path.dirname(os.path.abspath(__file__))
_parent_dir = os.path.dirname(_current_dir)
if _parent_dir not in sys.path:
    sys.path.insert(0, _parent_dir)
if _current_dir not in sys.path:
    sys.path.insert(0, _current_dir)

# Import modules after setting up path with error handling
try:
    from app.transcriber import transcribe_media
    from app.hinglish_engine import (
        transliterate_devanagari_to_hinglish,
        transliterate_hinglish_to_devanagari,
        enrich_with_emojis,
        is_urdu_arabic,
        convert_urdu_to_hindi,
    )
    from app.renderer import render_captioned_video
except ImportError:
    from transcriber import transcribe_media
    from hinglish_engine import (
        transliterate_devanagari_to_hinglish,
        transliterate_hinglish_to_devanagari,
        enrich_with_emojis,
        is_urdu_arabic,
        convert_urdu_to_hindi,
    )
    from renderer import render_captioned_video

app = FastAPI(title="Verbilo AI Engine API", description="AI Multilingual Auto-Caption API for Indian Creators")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(_parent_dir, "uploads")
OUTPUT_DIR = os.path.join(_parent_dir, "outputs")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Mount the outputs directory for static file serving with error handling
try:
    from fastapi.staticfiles import StaticFiles
    app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")
except Exception as e:
    print(f"Warning: Could not mount static files directory: {e}")

class WordItem(BaseModel):
    word: str
    start: float
    end: float
    customColor: Optional[str] = None

class TranscribeResponse(BaseModel):
    status: str
    video_id: str
    language: str
    words: List[WordItem]

class TransliterateRequest(BaseModel):
    text: str

class RenderRequest(BaseModel):
    video_id: Optional[str] = None
    words: List[WordItem]
    font_name: Optional[str] = "Arial Black"
    font_size: Optional[int] = 56
    primary_color: Optional[str] = "#FFE600"
    secondary_color: Optional[str] = "#FFFFFF"
    stroke: Optional[bool] = True
    chunk_size: Optional[int] = 3
    y_position: Optional[float] = 75.0
    sub_label: Optional[str] = None
    sub_position: Optional[str] = "top"
    text_transform: Optional[str] = "uppercase"
    aspect_ratio: Optional[str] = "original"

@app.get("/")
def read_root():
    return {
        "app": "Verbilo AI Backend",
        "status": "online",
        "supported_languages": ["hinglish", "hindi", "bengali", "tamil", "telugu", "marathi", "english"]
    }

@app.post("/api/upload-and-transcribe", response_model=TranscribeResponse)
async def upload_and_transcribe(
    file: UploadFile = File(...),
    language: str = Form("hinglish"),
):
    video_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1] or ".mp4"
    saved_path = os.path.join(UPLOAD_DIR, f"{video_id}{ext}")

    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        words_data, detected_lang = transcribe_media(saved_path, language=language)
        return TranscribeResponse(
            status="success",
            video_id=video_id,
            language=detected_lang or language,
            words=[WordItem(**w) for w in words_data]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/transliterate-hinglish")
def transliterate_to_hinglish(req: TransliterateRequest):
    result = transliterate_devanagari_to_hinglish(req.text)
    return {"original": req.text, "hinglish": result}

@app.post("/api/transliterate-hindi")
def transliterate_to_hindi(req: TransliterateRequest):
    result = transliterate_hinglish_to_devanagari(req.text)
    return {"original": req.text, "hindi": result}

@app.post("/api/enrich-emojis")
def enrich_emojis_endpoint(req: TransliterateRequest):
    words = req.text.split()
    enriched = [enrich_with_emojis(w) for w in words]
    return {"enriched": " ".join(enriched)}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Verbilo AI Backend"}

@app.get("/api/transcribe")
def get_transcribe_sample(language: str = "hinglish"):
    words_data, detected_lang = transcribe_media("", language=language)
    return {"status": "success", "language": detected_lang or language, "words": words_data}

@app.get("/outputs/{filename}")
async def get_rendered_output(filename: str):
    file_path = os.path.join(OUTPUT_DIR, filename)
    if os.path.isfile(file_path):
        from fastapi.responses import FileResponse
        return FileResponse(file_path, media_type="video/mp4")
    raise HTTPException(status_code=404, detail="File not found")

@app.post("/api/render")
def render_video_endpoint(req: RenderRequest):
    # Locate video file
    video_path = None
    if req.video_id:
        for f in os.listdir(UPLOAD_DIR):
            if f.startswith(req.video_id):
                video_path = os.path.join(UPLOAD_DIR, f)
                break

    # If not found or not specified, use the most recently uploaded video
    if not video_path or not os.path.exists(video_path):
        candidates = []
        for f in os.listdir(UPLOAD_DIR):
            full_p = os.path.join(UPLOAD_DIR, f)
            if os.path.isfile(full_p) and not f.startswith(".") and os.path.getsize(full_p) > 1000:
                candidates.append(full_p)
        if candidates:
            video_path = max(candidates, key=os.path.getmtime)

    if not video_path:
        raise HTTPException(status_code=404, detail="No video file available to render captions onto. Please upload a video first.")

    out_name = f"verbilo_rendered_{uuid.uuid4().hex[:8]}.mp4"
    out_path = os.path.join(OUTPUT_DIR, out_name)

    try:
        render_captioned_video(
            input_video_path=video_path,
            output_video_path=out_path,
            words=[w.model_dump() for w in req.words],
            font_name=req.font_name or "Arial Black",
            font_size=req.font_size or 56,
            primary_color_hex=req.primary_color or "#FFE600",
            secondary_color_hex=req.secondary_color or "#FFFFFF",
            stroke=req.stroke if req.stroke is not None else True,
            chunk_size=req.chunk_size or 3,
            y_position_pct=req.y_position or 75.0,
            sub_label=req.sub_label,
            sub_position=req.sub_position or "top",
            text_transform=req.text_transform or "uppercase",
            aspect_ratio=req.aspect_ratio or "original"
        )
        return {
            "status": "success",
            "download_url": f"/outputs/{out_name}",
            "filename": out_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rendering error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
