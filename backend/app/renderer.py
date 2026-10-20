import os
import re
import uuid
import subprocess
import imageio_ffmpeg
from typing import List, Dict, Any, Optional

def hex_to_ass_color(hex_str: str) -> str:
    """Converts #RRGGBB or #RGB to ASS format &H00BBGGRR&"""
    if not hex_str:
        return "&H00FFFFFF&"
    hex_clean = hex_str.strip().lstrip('#')
    if len(hex_clean) == 3:
        hex_clean = "".join(c * 2 for c in hex_clean)
    if len(hex_clean) == 6:
        r, g, b = hex_clean[0:2], hex_clean[2:4], hex_clean[4:6]
        return f"&H00{b.upper()}{g.upper()}{r.upper()}&"
    return "&H00FFFFFF&"

def format_ass_time(seconds: float) -> str:
    """Formats seconds into ASS timestamp format H:MM:SS.CC"""
    if seconds < 0:
        seconds = 0
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    centis = int(round((seconds - int(seconds)) * 100))
    if centis >= 100:
        centis = 99
    return f"{hours}:{minutes:02d}:{secs:02d}.{centis:02d}"

def get_video_dimensions(video_path: str) -> tuple[int, int]:
    """Gets video width and height using FFprobe / FFmpeg."""
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    try:
        cmd = [ffmpeg_exe, "-i", video_path]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        # Look for resolution pattern like 1080x1920 or 720x1280
        match = re.search(r",\s*(\d{3,4})x(\d{3,4})", res.stderr)
        if match:
            return int(match.group(1)), int(match.group(2))
    except Exception as e:
        print(f"Error determining video dimensions: {e}")
    # Default to vertical 9:16 reel
    return 1080, 1920

def generate_ass_subtitles(
    words: List[Dict[str, Any]],
    output_ass_path: str,
    width: int = 1080,
    height: int = 1920,
    font_name: str = "Arial",
    font_size: int = 60,
    primary_color_hex: str = "#FFE600",
    secondary_color_hex: str = "#FFFFFF",
    stroke: bool = True,
    chunk_size: int = 3,
    y_position_pct: float = 75.0,
    sub_label: Optional[str] = None,
    sub_position: str = "top",
    text_transform: str = "uppercase"
) -> str:
    """
    Generates an Advanced SubStation Alpha (.ass) subtitle file
    with viral creator styling, precise word highlighting, and 9:16 layout.
    """
    ass_primary = hex_to_ass_color(primary_color_hex)
    ass_secondary = hex_to_ass_color(secondary_color_hex)
    outline_val = 5 if stroke else 0
    outline_color = "&H00000000&"  # Bold black outline

    # Clean font name (remove CSS quotes or fallback list)
    clean_font = font_name.replace("'", "").replace('"', "").split(",")[0].strip()
    if not clean_font:
        clean_font = "Arial Black"

    pos_x = int(width / 2)
    pos_y = int(height * (y_position_pct / 100.0))
    sub_y = pos_y - int(font_size * 1.1) if sub_position == "top" else pos_y + int(font_size * 1.1)

    ass_content = f"""[Script Info]
Title: Verbilo AI Auto-Captions
ScriptType: v4.00+
PlayResX: {width}
PlayResY: {height}
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: MainWord,{clean_font},{font_size},{ass_secondary},{ass_primary},{outline_color},&H80000000,-1,0,0,0,100,100,0,0,1,{outline_val},0,5,10,10,10,1
Style: SubHeader,Arial Black,{int(font_size * 0.55)},&H00FFFFFF,&H00FFFFFF,{outline_color},&H80000000,-1,0,0,0,100,100,2,0,1,3,0,5,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    if not words:
        with open(output_ass_path, "w", encoding="utf-8") as f:
            f.write(ass_content)
        return output_ass_path

    # Chunk words into groups of chunk_size
    n = len(words)
    chunk_list = []
    for i in range(0, n, chunk_size):
        chunk_list.append(words[i:i + chunk_size])

    events = []
    for chunk in chunk_list:
        chunk_start = chunk[0].get("start", 0.0)
        chunk_end = chunk[-1].get("end", chunk_start + 1.0)
        
        # If there is a sub header label, show it during the entire chunk duration
        if sub_label and sub_label.strip():
            clean_sub = sub_label.strip().upper()
            start_str = format_ass_time(chunk_start)
            end_str = format_ass_time(chunk_end)
            events.append(
                f"Dialogue: 0,{start_str},{end_str},SubHeader,,0,0,0,,{{\\pos({pos_x},{sub_y})}}{clean_sub}"
            )

        # For each word in this chunk, create a timed subtitle line where that word is highlighted
        for target_idx, active_word in enumerate(chunk):
            w_start = active_word.get("start", chunk_start)
            w_end = active_word.get("end", w_start + 0.3)
            # Ensure duration is at least 0.15s
            if w_end <= w_start:
                w_end = w_start + 0.2

            start_str = format_ass_time(w_start)
            end_str = format_ass_time(w_end)

            # Build line text
            formatted_words = []
            for idx, w in enumerate(chunk):
                raw_text = str(w.get("word", "")).strip()
                if text_transform == "uppercase":
                    raw_text = raw_text.upper()
                elif text_transform == "capitalize":
                    raw_text = raw_text.capitalize()

                if idx == target_idx:
                    # Highlighted active word: primary color + slight scale
                    formatted_words.append(f"{{\\c{ass_primary}\\fscx112\\fscy112}}{raw_text}{{\\rMainWord}}")
                else:
                    # Non-active word: secondary color
                    formatted_words.append(f"{{\\c{ass_secondary}}}{raw_text}")

            line_text = " ".join(formatted_words)
            events.append(
                f"Dialogue: 1,{start_str},{end_str},MainWord,,0,0,0,,{{\\pos({pos_x},{pos_y})}}{line_text}"
            )

    ass_content += "\n".join(events) + "\n"

    with open(output_ass_path, "w", encoding="utf-8") as f:
        f.write(ass_content)

    return output_ass_path

def render_captioned_video(
    input_video_path: str,
    output_video_path: str,
    words: List[Dict[str, Any]],
    font_name: str = "Arial",
    font_size: int = 56,
    primary_color_hex: str = "#FFE600",
    secondary_color_hex: str = "#FFFFFF",
    stroke: bool = True,
    chunk_size: int = 3,
    y_position_pct: float = 75.0,
    sub_label: Optional[str] = None,
    sub_position: str = "top",
    text_transform: str = "uppercase",
    aspect_ratio: Optional[str] = "original"
) -> str:
    """
    Burs ASS captions directly into the video file using imageio-ffmpeg.
    Supports aspect ratios: '9:16', '16:9', '1:1', '4:5', 'original'.
    """
    if not os.path.exists(input_video_path):
        raise FileNotFoundError(f"Input video not found: {input_video_path}")

    orig_w, orig_h = get_video_dimensions(input_video_path)
    target_w, target_h = orig_w, orig_h

    if aspect_ratio == "9:16":
        target_w, target_h = 1080, 1920
    elif aspect_ratio == "16:9":
        target_w, target_h = 1920, 1080
    elif aspect_ratio == "1:1":
        target_w, target_h = 1080, 1080
    elif aspect_ratio == "4:5":
        target_w, target_h = 1080, 1350

    width, height = target_w, target_h

    ass_filename = f"temp_sub_{uuid.uuid4().hex[:8]}.ass"
    ass_path = os.path.abspath(os.path.join(os.path.dirname(output_video_path), ass_filename))

    try:
        generate_ass_subtitles(
            words=words,
            output_ass_path=ass_path,
            width=width,
            height=height,
            font_name=font_name,
            font_size=font_size,
            primary_color_hex=primary_color_hex,
            secondary_color_hex=secondary_color_hex,
            stroke=stroke,
            chunk_size=chunk_size,
            y_position_pct=y_position_pct,
            sub_label=sub_label,
            sub_position=sub_position,
            text_transform=text_transform
        )

        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

        # In FFmpeg subtitles filter on Windows, colons and backslashes must be escaped
        escaped_ass_path = ass_path.replace("\\", "/").replace(":", "\\:")

        vf_filters = []
        if (target_w, target_h) != (orig_w, orig_h) and aspect_ratio != "original":
            vf_filters.append(f"scale={target_w}:{target_h}:force_original_aspect_ratio=decrease,pad={target_w}:{target_h}:(ow-iw)/2:(oh-ih)/2:color=black")
        vf_filters.append(f"ass='{escaped_ass_path}'")

        cmd = [
            ffmpeg_exe, "-y",
            "-i", input_video_path,
            "-vf", ",".join(vf_filters),
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-crf", "22",
            "-c:a", "aac",
            "-b:a", "128k",
            "-movflags", "+faststart",
            output_video_path
        ]

        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"FFmpeg rendering failed: {result.stderr}")

        return output_video_path

    finally:
        if os.path.exists(ass_path):
            try:
                os.remove(ass_path)
            except Exception:
                pass
