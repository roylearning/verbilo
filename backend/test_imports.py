#!/usr/bin/env python3
"""
Test script to verify all imports work properly in the backend application.
"""

import sys
import os

# Ensure UTF-8 output encoding on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Add backend and app directories to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.join(current_dir, "app")
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if app_dir not in sys.path:
    sys.path.insert(0, app_dir)

def test_imports():
    """Test that all required modules can be imported."""
    print("Testing imports...")

    # Test basic FastAPI imports
    try:
        from fastapi import FastAPI
        from fastapi.staticfiles import StaticFiles
        print("[OK] FastAPI and StaticFiles imports successful")
    except ImportError as e:
        print(f"[FAIL] FastAPI import failed: {e}")
        return False

    # Test our application modules
    try:
        from app.transcriber import transcribe_media
        print("[OK] transcriber module import successful")
    except ImportError as e:
        try:
            from transcriber import transcribe_media
            print("[OK] transcriber module import successful (direct)")
        except ImportError as e2:
            print(f"[FAIL] transcriber import failed: {e2}")
            return False

    try:
        from app.hinglish_engine import (
            transliterate_devanagari_to_hinglish,
            transliterate_hinglish_to_devanagari,
            enrich_with_emojis,
            is_urdu_arabic,
            convert_urdu_to_hindi,
        )
        print("[OK] hinglish_engine module import successful")
    except ImportError as e:
        try:
            from hinglish_engine import (
                transliterate_devanagari_to_hinglish,
                transliterate_hinglish_to_devanagari,
                enrich_with_emojis,
                is_urdu_arabic,
                convert_urdu_to_hindi,
            )
            print("[OK] hinglish_engine module import successful (direct)")
        except ImportError as e2:
            print(f"[FAIL] hinglish_engine import failed: {e2}")
            return False

    try:
        from app.renderer import render_captioned_video
        print("[OK] renderer module import successful")
    except ImportError as e:
        try:
            from renderer import render_captioned_video
            print("[OK] renderer module import successful (direct)")
        except ImportError as e2:
            print(f"[FAIL] renderer import failed: {e2}")
            return False

    print("All imports successful!")
    return True

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)
