import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Video, Globe2, Play, Pause, Download,
  Upload, Wand2, Palette, Sliders, Plus,
  Smile, Volume2, VolumeX, Loader2, CheckCircle2,
  Type, Flame, AlignLeft
} from 'lucide-react';

export interface WordItem {
  word: string;
  start: number;
  end: number;
  customColor?: string;
}

export interface StylePreset {
  id: string;
  name: string;
  category: 'verbilo-styles' | 'creator-pairing' | 'viral-glow' | 'hindi-styles';
  badge?: string;
  tags?: string[];
  layout: 'splash' | 'center';
  emphasis: 'emphasize' | 'spotlight';
  primaryColor: string;
  secondaryColor: string;
  font: string;
  hindiFont: string;
  subFont?: string;
  subHindiFont?: string;
  subWeight?: number;
  fontStyle?: 'normal' | 'italic';
  textTransform?: 'uppercase' | 'none' | 'capitalize';
  letterSpacing?: string;
  stroke: boolean;
  strokeLevel?: 'heavy' | 'subtle' | 'none' | 'ultra';
  glowIntensity: number; // 0 to 60
  glowColor?: string;
  chromatic3D?: boolean;
  dropShadow?: boolean;
  pillBox?: boolean;
  pillBg?: string;
  previewTop?: string;
  previewMain: string;
  previewBottom?: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  // 1. CREATOR PAIRINGS (High-Contrast Punch Word + Clean Supporting Font)
  {
    id: 'punch-red-bold',
    name: 'Bold Crimson Punch',
    category: 'creator-pairing',
    badge: 'Popular',
    tags: ['Vibrant Red', 'High Contrast'],
    layout: 'splash',
    emphasis: 'emphasize',
    previewTop: 'THE QUICK',
    previewMain: 'PUNCH RED',
    previewBottom: 'FOX JUMPS',
    subFont: "'DM Sans', sans-serif",
    subHindiFont: "'Hind', sans-serif",
    subWeight: 400,
    font: "'Anton', 'Bebas Neue', sans-serif",
    hindiFont: "'Teko', sans-serif",
    fontStyle: 'normal',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    primaryColor: '#FF1E1E', // Vibrant Red
    secondaryColor: '#FFFFFF', // Clean White
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 22,
    glowColor: '#FF1E1E'
  },
  {
    id: 'desi-punch-pair',
    name: 'Desi Hindi Punch',
    category: 'creator-pairing',
    badge: 'Hindi Hit',
    tags: ['Hindi Punch', 'Clean Font'],
    layout: 'splash',
    emphasis: 'emphasize',
    previewTop: 'देश का सबसे',
    previewMain: 'बड़ा धमाका',
    previewBottom: 'आज ही देखें',
    subFont: "'Hind', sans-serif",
    subHindiFont: "'Hind', sans-serif",
    subWeight: 300,
    font: "'Teko', sans-serif",
    hindiFont: "'Teko', sans-serif",
    fontStyle: 'normal',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    primaryColor: '#FF1E1E', // Vibrant Big Red
    secondaryColor: '#FFFFFF', // Pure White
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 24,
    glowColor: '#FF1E1E'
  },
  {
    id: 'dm-sans-sf-pro',
    name: 'Modern Ultra Black',
    category: 'creator-pairing',
    badge: 'Modern',
    tags: ['Punch', 'Heavy'],
    layout: 'splash',
    emphasis: 'emphasize',
    previewTop: 'HIGH IMPACT',
    previewMain: 'VIRAL REEL',
    previewBottom: 'CAPTION STYLE',
    subFont: "'DM Sans', sans-serif",
    subHindiFont: "'Mukta', sans-serif",
    subWeight: 500,
    font: "'Montserrat', sans-serif",
    hindiFont: "'Mukta', sans-serif",
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    primaryColor: '#D60000',
    secondaryColor: '#FFFFFF',
    stroke: true,
    strokeLevel: 'subtle',
    glowIntensity: 10,
    glowColor: '#D60000'
  },
  {
    id: 'playfair-luxury',
    name: 'Editorial Luxury Serif',
    category: 'creator-pairing',
    badge: 'Editorial',
    tags: ['Luxury Serif', 'Aesthetic'],
    layout: 'splash',
    emphasis: 'emphasize',
    previewTop: 'THE ART OF',
    previewMain: 'PLAYFAIR LUXURY',
    previewBottom: 'ELEGANT WORDS',
    subFont: "'DM Sans', sans-serif",
    subHindiFont: "'Mukta', sans-serif",
    subWeight: 400,
    font: "'Playfair Display', serif",
    hindiFont: "'Rozha One', serif",
    fontStyle: 'normal',
    textTransform: 'none',
    letterSpacing: '0em',
    primaryColor: '#C41230',
    secondaryColor: '#FFFFFF',
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 6,
    glowColor: '#C41230'
  },

  // 2. DEDICATED HINDI & DESI CREATOR STYLES
  {
    id: 'bollywood-fire',
    name: 'Bollywood Fire',
    category: 'hindi-styles',
    badge: 'Popular',
    tags: ['Hindi', 'Neon Glow'],
    layout: 'splash',
    emphasis: 'emphasize',
    primaryColor: '#CCFF00', // Neon Lime
    secondaryColor: '#64748B',
    font: "'Montserrat', sans-serif",
    hindiFont: "'Mukta', sans-serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    fontStyle: 'normal',
    textTransform: 'uppercase',
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 28,
    glowColor: '#CCFF00',
    dropShadow: false,
    previewTop: 'आज हम',
    previewMain: 'सीखेंगे',
    previewBottom: 'वायरल कैप्शन'
  },
  {
    id: 'delhi-royale',
    name: 'Delhi Royale Serif',
    category: 'hindi-styles',
    badge: 'Aesthetic',
    tags: ['Luxury Serif', 'Hindi'],
    layout: 'center',
    emphasis: 'spotlight',
    primaryColor: '#FFFFFF',
    secondaryColor: '#94A3B8',
    font: "'Playfair Display', serif",
    hindiFont: "'Rozha One', serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    fontStyle: 'normal',
    textTransform: 'none',
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 20,
    glowColor: '#FFFFFF',
    previewTop: 'खूबसूरत',
    previewMain: 'रोझा वन',
    previewBottom: 'स्टाइल'
  },
  {
    id: 'desi-headliner',
    name: 'Desi Headliner Teko',
    category: 'hindi-styles',
    badge: 'High Impact',
    tags: ['Tall', 'Condensed', 'Hindi'],
    layout: 'splash',
    emphasis: 'emphasize',
    primaryColor: '#FF2222', // Fiery Red
    secondaryColor: '#FFFFFF',
    font: "'Teko', sans-serif",
    hindiFont: "'Teko', sans-serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    fontStyle: 'normal',
    textTransform: 'uppercase',
    stroke: true,
    strokeLevel: 'subtle',
    glowIntensity: 22,
    glowColor: '#FF2222',
    previewTop: 'देश का सबसे',
    previewMain: 'बड़ा धमाका',
    previewBottom: 'आज ही देखें'
  },
  {
    id: 'shayari-vibe',
    name: 'Shayari & Vibe',
    category: 'hindi-styles',
    badge: 'Handwritten',
    tags: ['Cursive', 'Hindi'],
    layout: 'center',
    emphasis: 'emphasize',
    primaryColor: '#00F0FF', // Cyber Cyan
    secondaryColor: '#FFFFFF',
    font: "'Great Vibes', cursive",
    hindiFont: "'Kalam', cursive",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    fontStyle: 'normal',
    textTransform: 'none',
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 24,
    glowColor: '#00F0FF',
    previewTop: 'दिल की',
    previewMain: 'शायरी कलम',
    previewBottom: 'अंदाज'
  },
  {
    id: 'mumbai-3d',
    name: 'Mumbai 3D Punch',
    category: 'hindi-styles',
    badge: '3D',
    tags: ['Black 900', '3D', 'Hindi'],
    layout: 'splash',
    emphasis: 'emphasize',
    primaryColor: '#FFFFFF',
    secondaryColor: '#64748B',
    font: "'Montserrat', sans-serif",
    hindiFont: "'Noto Sans Devanagari', sans-serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    fontStyle: 'normal',
    textTransform: 'uppercase',
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 12,
    chromatic3D: true,
    previewTop: 'यह है असली',
    previewMain: 'मुंबई इम्पैक्ट',
    previewBottom: 'सुपर वायरल'
  },
  {
    id: 'ranga-brush',
    name: 'Ranga Street Art',
    category: 'hindi-styles',
    badge: 'Artistic',
    tags: ['Brush', 'Hindi'],
    layout: 'center',
    emphasis: 'emphasize',
    primaryColor: '#FFD000',
    secondaryColor: '#FFFFFF',
    font: "'Ranga', cursive",
    hindiFont: "'Ranga', cursive",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    fontStyle: 'normal',
    textTransform: 'none',
    stroke: true,
    strokeLevel: 'subtle',
    glowIntensity: 18,
    glowColor: '#FFD000',
    previewTop: 'रंगीन',
    previewMain: 'रंगा आर्ट',
    previewBottom: 'कैप्शन'
  },

  // 3. VERBILO STYLES
  {
    id: 'verbilo-shadow',
    name: 'Verbilo Shadow',
    category: 'verbilo-styles',
    badge: 'New',
    tags: ['Bold'],
    layout: 'splash',
    emphasis: 'emphasize',
    primaryColor: '#FFFFFF',
    secondaryColor: '#64748B',
    font: "'Montserrat', sans-serif",
    hindiFont: "'Mukta', sans-serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    fontStyle: 'normal',
    textTransform: 'uppercase',
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 0,
    dropShadow: true,
    previewTop: 'the quick',
    previewMain: 'BROWN',
    previewBottom: 'fox jumps'
  },
  {
    id: 'verbilo-glow',
    name: 'Verbilo Glow',
    category: 'verbilo-styles',
    badge: 'Popular',
    tags: ['Bold', 'Glow'],
    layout: 'splash',
    emphasis: 'emphasize',
    primaryColor: '#CCFF00', // Neon Lime / Yellow from Image 1 & 3
    secondaryColor: '#64748B',
    font: "'Montserrat', sans-serif",
    hindiFont: "'Mukta', sans-serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    fontStyle: 'normal',
    textTransform: 'uppercase',
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 28,
    glowColor: '#CCFF00',
    dropShadow: false,
    previewTop: 'the quick',
    previewMain: 'BROWN',
    previewBottom: 'fox jumps'
  },
  {
    id: 'delhi',
    name: 'Delhi Aesthetic',
    category: 'verbilo-styles',
    badge: 'Aesthetic',
    tags: ['Script', 'Glow'],
    layout: 'center',
    emphasis: 'spotlight',
    primaryColor: '#FFFFFF',
    secondaryColor: '#94A3B8',
    font: "'Playfair Display', serif",
    hindiFont: "'Rozha One', serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    fontStyle: 'italic',
    textTransform: 'none',
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 18,
    glowColor: '#FFFFFF',
    previewTop: 'the',
    previewMain: 'quick',
    previewBottom: 'fox'
  },
  {
    id: 'illusion',
    name: 'Illusion 3D',
    category: 'verbilo-styles',
    badge: 'New',
    tags: ['3D', 'Kinetic'],
    layout: 'splash',
    emphasis: 'emphasize',
    primaryColor: '#FFFFFF',
    secondaryColor: '#64748B',
    font: "'Montserrat', sans-serif",
    hindiFont: "'Hind', sans-serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    fontStyle: 'normal',
    textTransform: 'capitalize',
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 10,
    chromatic3D: true,
    previewTop: 'he had rented the',
    previewMain: 'Biggest',
    previewBottom: ''
  },
  {
    id: 'editor-masala',
    name: 'Editor Masala',
    category: 'verbilo-styles',
    badge: 'Smart',
    tags: ['Bold', 'Kinetic'],
    layout: 'splash',
    emphasis: 'emphasize',
    primaryColor: '#FFD000',
    secondaryColor: '#64748B',
    font: "'Anton', 'Bebas Neue', sans-serif",
    hindiFont: "'Teko', sans-serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    fontStyle: 'normal',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 14,
    glowColor: '#FFD000',
    previewTop: 'trust the',
    previewMain: 'PROCESS',
    previewBottom: ''
  },
  {
    id: 'ali-abdaal',
    name: 'Ali Abdaal',
    category: 'verbilo-styles',
    badge: 'Static',
    tags: ['Pill', 'Minimal'],
    layout: 'center',
    emphasis: 'spotlight',
    primaryColor: '#000000',
    secondaryColor: '#94A3B8',
    font: "'Poppins', sans-serif",
    hindiFont: "'Mukta', sans-serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    fontStyle: 'normal',
    textTransform: 'none',
    stroke: false,
    strokeLevel: 'none',
    glowIntensity: 0,
    pillBox: true,
    pillBg: '#FFFFFF',
    previewTop: 'the',
    previewMain: 'quick',
    previewBottom: 'fox'
  },

  // 4. VIRAL GLOW STYLES
  {
    id: 'hormozi',
    name: 'Hormozi Viral',
    category: 'viral-glow',
    badge: 'Classic',
    tags: ['High Impact'],
    layout: 'center',
    emphasis: 'emphasize',
    primaryColor: '#FFE600',
    secondaryColor: '#FFFFFF',
    font: "'Montserrat', sans-serif",
    hindiFont: "'Mukta', sans-serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    textTransform: 'uppercase',
    stroke: true,
    strokeLevel: 'heavy',
    glowIntensity: 18,
    glowColor: '#FFE600',
    previewMain: 'HORMOZI YELLOW'
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    category: 'viral-glow',
    badge: 'Glow',
    tags: ['Cyan Glow'],
    layout: 'center',
    emphasis: 'emphasize',
    primaryColor: '#00F0FF',
    secondaryColor: '#FFFFFF',
    font: "'Montserrat', sans-serif",
    hindiFont: "'Mukta', sans-serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    textTransform: 'uppercase',
    stroke: true,
    strokeLevel: 'subtle',
    glowIntensity: 34,
    glowColor: '#00F0FF',
    previewMain: 'CYBER NEON'
  },
  {
    id: 'beast',
    name: 'Green Beast',
    category: 'viral-glow',
    badge: 'Viral',
    tags: ['Beast Green'],
    layout: 'center',
    emphasis: 'emphasize',
    primaryColor: '#00FF66',
    secondaryColor: '#FFFFFF',
    font: "'Montserrat', sans-serif",
    hindiFont: "'Mukta', sans-serif",
    subFont: "'Poppins', sans-serif",
    subWeight: 300,
    textTransform: 'uppercase',
    stroke: true,
    strokeLevel: 'heavy',
    glowIntensity: 26,
    glowColor: '#00FF66',
    previewMain: 'GREEN BEAST'
  },
];

// Popular Global & Regional Languages
export const SUPPORTED_LANGUAGES = [
  { code: 'hindi', label: '🇮🇳 Hindi (हिंदी Devanagari - Authentic)', script: 'देवनागरी' },
  { code: 'auto', label: '⚡ Auto-Detect Language', script: 'Any Language' },
  { code: 'english', label: 'English (Global / Standard)', script: 'Latin' },
  { code: 'hinglish', label: 'Hinglish (Hindi in English Script)', script: 'Romanized' },
  { code: 'spanish', label: 'Spanish (Español)', script: 'Latin' },
  { code: 'french', label: 'French (Français)', script: 'Latin' },
  { code: 'german', label: 'German (Deutsch)', script: 'Latin' },
  { code: 'japanese', label: 'Japanese (日本語)', script: 'Kanji / Kana' },
  { code: 'portuguese', label: 'Portuguese (Português)', script: 'Latin' },
  { code: 'arabic', label: 'Arabic (العربية)', script: 'Arabic' },
  { code: 'chinese', label: 'Chinese (中文)', script: 'Simplified' },
  { code: 'bengali', label: 'Bengali (বাংলা)', script: 'বাংলা' },
  { code: 'tamil', label: 'Tamil (தமிழ்)', script: 'தமிழ்' },
  { code: 'telugu', label: 'Telugu (తెలుగు)', script: 'తెలుగు' },
  { code: 'marathi', label: 'Marathi (मराठी)', script: 'मराठी' },
];

// ═══════════════════════════════════════════════════════════════
// UNIFIED FONT CATALOG — One list for everything (Part 1 & Part 2)
// Works for English, Hindi, Bengali, Hinglish — auto-detects script
// ═══════════════════════════════════════════════════════════════
export const ALL_FONTS = [
  // ── VIRAL PUNCH (English) ──────────────────────────────────
  { id: 'anton', name: 'Anton — Ultra Punch', font: "'Anton', 'Bebas Neue', sans-serif", category: 'punch' },
  { id: 'bebas', name: 'Bebas Neue — Headliner Bold', font: "'Bebas Neue', sans-serif", category: 'punch' },
  { id: 'montserrat', name: 'Montserrat — Black 900', font: "'Montserrat', sans-serif", category: 'punch' },
  { id: 'integral', name: 'Integral CF — Extra Bold', font: "'Integral CF', 'Anton', sans-serif", category: 'punch' },
  { id: 'akira', name: 'Akira Expanded', font: "'Akira Expanded', 'Impact', sans-serif", category: 'punch' },
  { id: 'basement', name: 'Basement Grotesque — Black', font: "'Basement Grotesque', 'Anton', sans-serif", category: 'punch' },
  { id: 'uni_sans', name: 'Uni Sans — Heavy', font: "'Uni Sans Heavy', 'Montserrat', sans-serif", category: 'punch' },
  { id: 'sf_pro', name: 'SF Pro Display — Bold', font: "'SF Pro Display', 'Inter', sans-serif", category: 'punch' },
  { id: 'playfair', name: 'Playfair Display — Luxury Serif', font: "'Playfair Display', serif", category: 'punch' },

  // ── CLEAN SANS (English) ───────────────────────────────────
  { id: 'poppins', name: 'Poppins — Geometric Sans', font: "'Poppins', sans-serif", category: 'clean' },
  { id: 'dmsans', name: 'DM Sans — Modern Clean', font: "'DM Sans', sans-serif", category: 'clean' },
  { id: 'inter', name: 'Inter — Neutral Clean', font: "'Inter', sans-serif", category: 'clean' },
  { id: 'anek_latin', name: 'Anek Latin — Modern', font: "'Anek Latin', sans-serif", category: 'clean' },

  // ── HINDI / DEVANAGARI ─────────────────────────────────────
  { id: 'teko', name: 'Teko — टेको Tall Impact', font: "'Teko', sans-serif", category: 'hindi' },
  { id: 'mukta', name: 'Mukta — मुक्ता Modern Bold', font: "'Mukta', sans-serif", category: 'hindi' },
  { id: 'hind', name: 'Hind — हिन्द Clean Punch', font: "'Hind', sans-serif", category: 'hindi' },
  { id: 'noto_devanagari', name: 'Noto Sans Devanagari — 900', font: "'Noto Sans Devanagari', sans-serif", category: 'hindi' },
  { id: 'rozha', name: 'Rozha One — रोझा Luxury Serif', font: "'Rozha One', serif", category: 'hindi' },
  { id: 'kalam', name: 'Kalam — कलम Handwritten', font: "'Kalam', cursive", category: 'hindi' },
  { id: 'ranga', name: 'Ranga — रंगा Street Brush', font: "'Ranga', cursive", category: 'hindi' },
  { id: 'yatra', name: 'Yatra One — यात्रा Heritage', font: "'Yatra One', display", category: 'hindi' },
  { id: 'ams_kashi', name: 'AMS Kashi — काशी Classic', font: "'AMS Kashi', serif", category: 'hindi' },

  // ── BENGALI / বাংলা ────────────────────────────────────────
  { id: 'hind_siliguri', name: 'Hind Siliguri — হিন্দ Modern', font: "'Hind Siliguri', sans-serif", category: 'bengali' },
  { id: 'noto_bengali', name: 'Noto Serif Bengali — নোটো Serif', font: "'Noto Serif Bengali', serif", category: 'bengali' },
  { id: 'anek_bangla', name: 'Anek Bangla — আনেক Variable', font: "'Anek Bangla', sans-serif", category: 'bengali' },
  { id: 'galada', name: 'Galada — গালাদা Brush Script', font: "'Galada', cursive", category: 'bengali' },
  { id: 'mina', name: 'Mina — মীনা Bold Display', font: "'Mina', sans-serif", category: 'bengali' },
  { id: 'atma', name: 'Atma — আত্মা Handwriting', font: "'Atma', display", category: 'bengali' },

  // ── CURSIVE / ARTISTIC ─────────────────────────────────────
  { id: 'great_vibes', name: 'Great Vibes — Elegant Script', font: "'Great Vibes', cursive", category: 'artistic' },
];

// Quick Viral Neon Color Swatches
export const VIRAL_COLORS = [
  { name: 'Vibrant Red', hex: '#FF1E1E' },
  { name: 'Crimson Red', hex: '#D60000' },
  { name: 'Neon Lime', hex: '#CCFF00' },
  { name: 'Cyber Cyan', hex: '#00F0FF' },
  { name: 'Hormozi Gold', hex: '#FFE600' },
  { name: 'Electric Pink', hex: '#FF007F' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Beast Green', hex: '#00FF66' },
  { name: 'Fire Orange', hex: '#FF7700' }
];

export const CONTEXT_COLORS = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Slate Muted', hex: '#94A3B8' },
  { name: 'Cool Gray', hex: '#64748B' },
  { name: 'Zinc Light', hex: '#A1A1AA' },
  { name: 'Dark Slate', hex: '#334155' },
  { name: 'Pitch Black', hex: '#000000' }
];

export const DEFAULT_SAMPLE_WORDS: Record<string, WordItem[]> = {
  hindi: [
    { word: "नमस्ते", start: 0.1, end: 0.6 },
    { word: "दोस्तों,", start: 0.6, end: 1.0 },
    { word: "आज", start: 1.0, end: 1.4 },
    { word: "हम", start: 1.4, end: 1.8 },
    { word: "सीखेंगे", start: 1.8, end: 2.4 },
    { word: "वायरल", start: 2.5, end: 3.0 },
    { word: "कैप्शन", start: 3.0, end: 3.6 },
    { word: "बनाना! 🚀", start: 3.6, end: 4.4 }
  ],
  english: [
    { word: "Today", start: 0.1, end: 0.5 },
    { word: "we", start: 0.5, end: 0.8 },
    { word: "are", start: 0.8, end: 1.1 },
    { word: "creating", start: 1.1, end: 1.7 },
    { word: "viral", start: 1.7, end: 2.2 },
    { word: "captions", start: 2.2, end: 2.8 },
    { word: "that", start: 2.8, end: 3.1 },
    { word: "engage", start: 3.1, end: 3.6 },
    { word: "everyone! 🔥", start: 3.6, end: 4.4 }
  ],
  hinglish: [
    { word: "Namaste", start: 0.1, end: 0.5 },
    { word: "dosto,", start: 0.5, end: 0.9 },
    { word: "aaj", start: 1.0, end: 1.3 },
    { word: "hum", start: 1.3, end: 1.6 },
    { word: "seekhenge", start: 1.6, end: 2.2 },
    { word: "viral", start: 2.3, end: 2.8 },
    { word: "reels", start: 2.8, end: 3.3 },
    { word: "ke", start: 3.3, end: 3.6 },
    { word: "captions", start: 3.6, end: 4.1 },
    { word: "kaise", start: 4.1, end: 4.5 },
    { word: "banate", start: 4.5, end: 5.0 },
    { word: "hain! 🔥", start: 5.0, end: 5.8 }
  ]
};

// Check if a string contains Devanagari Unicode characters (Hindi, Marathi, etc.)
export const isDevanagari = (text: string) => /[\u0900-\u097F]/.test(text);

// Check if a string contains Arabic / Urdu characters
export const isUrduArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'landing'>('studio');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hindi'); // Default to Hindi to prevent Urdu misclassification
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');
  const [words, setWords] = useState<WordItem[]>(DEFAULT_SAMPLE_WORDS.hindi);
  const [videoSrc, setVideoSrc] = useState<string>(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(15);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState<string>('');
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  // TEMPLATE & CUSTOMIZER STATES (Featuring Creator Pairs Image 2 Style by default)
  const [presetCategory, setPresetCategory] = useState<'verbilo-styles' | 'creator-pairing' | 'viral-glow' | 'hindi-styles'>('creator-pairing');
  const [selectedPreset, setSelectedPreset] = useState<StylePreset>(STYLE_PRESETS[0]); // Punch Red & Poppins Light
  const [layoutMode, setLayoutMode] = useState<'splash' | 'center'>('splash');
  const [emphasisMode, setEmphasisMode] = useState<'emphasize' | 'spotlight'>('emphasize');

  // Two-Part Font Customization (Part 1 Main Word vs Part 2 Secondary Words)
  // Single unified font selection per part — auto-detects Hindi/Bengali/Latin
  const [primaryFont, setPrimaryFont] = useState<string>("'Integral CF', 'Anton', sans-serif"); // Part 1 font
  const [contextFont, setContextFont] = useState<string>("'Poppins', sans-serif"); // Part 2 font
  const [contextFontWeight, setContextFontWeight] = useState<number>(400);
  const [punchScale, setPunchScale] = useState<number>(1.35);
  
  // Part 1: Main Word Dedicated Glow
  const [part1GlowEnabled, setPart1GlowEnabled] = useState<boolean>(true);
  const [part1GlowMode, setPart1GlowMode] = useState<'neon' | 'soft' | 'off'>('neon');
  const [part1GlowColor, setPart1GlowColor] = useState<string>('#FF1E1E');
  const [part1GlowIntensity, setPart1GlowIntensity] = useState<number>(24);

  // Part 2: Supporting Words Dedicated Glow
  const [part2GlowEnabled, setPart2GlowEnabled] = useState<boolean>(false);
  const [part2GlowMode, setPart2GlowMode] = useState<'neon' | 'soft' | 'off'>('off');
  const [part2GlowColor, setPart2GlowColor] = useState<string>('#FFFFFF');
  const [part2GlowIntensity, setPart2GlowIntensity] = useState<number>(14);

  // Words per Line Selector (1, 2, 3, or 4 words)
  const [wordsPerLine, setWordsPerLine] = useState<number>(3);

  // Video Aspect Ratio & Display Format
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1' | '4:5' | 'original'>('9:16');
  const [videoFit, setVideoFit] = useState<'cover' | 'contain'>('cover');
  const [videoNativeAspect, setVideoNativeAspect] = useState<string>('9/16');
  const [isRendering, setIsRendering] = useState<boolean>(false);

  // Colors
  const [primaryColor, setPrimaryColor] = useState<string>('#FF1E1E'); // Vibrant Red
  const [secondaryColor, setSecondaryColor] = useState<string>('#FFFFFF'); // Clean White

  // Advanced Visuals
  const [hasChromatic3D, setHasChromatic3D] = useState<boolean>(false);
  const [strokeLevel, setStrokeLevel] = useState<'ultra' | 'heavy' | 'subtle' | 'none'>('none');
  const [hasPillBox, setHasPillBox] = useState<boolean>(false);
  const [pillBgColor, setPillBgColor] = useState<string>('#FFFFFF');
  const [fontSize, setFontSize] = useState<number>(40);
  const [yPosition, setYPosition] = useState<number>(75);
  const [textTransform, setTextTransform] = useState<'uppercase' | 'none' | 'capitalize'>('uppercase');

  const videoRef = useRef<HTMLVideoElement>(null);

  // Poll backend health
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('/api/health').catch(() => fetch('http://localhost:8000/api/health').catch(() => null));
        if (res && res.ok) {
          setBackendConnected(true);
        } else {
          setBackendConnected(false);
        }
      } catch {
        setBackendConnected(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 4000);
    return () => clearInterval(interval);
  }, []);

  // 60FPS Millisecond-Accurate Subtitle Playback Sync Loop
  useEffect(() => {
    let animId: number;
    const updateLoop = () => {
      if (videoRef.current && !videoRef.current.paused) {
        setCurrentTime(videoRef.current.currentTime);
      }
      animId = requestAnimationFrame(updateLoop);
    };
    if (isPlaying) {
      animId = requestAnimationFrame(updateLoop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // When preset is selected, populate all customizer controls
  const applyPreset = (preset: StylePreset) => {
    setSelectedPreset(preset);
    setLayoutMode(preset.layout);
    setEmphasisMode(preset.emphasis);
    setPrimaryColor(preset.primaryColor);
    setSecondaryColor(preset.secondaryColor);

    // Part 1 Glow Setup
    if (preset.glowIntensity > 0) {
      setPart1GlowEnabled(true);
      setPart1GlowMode('neon');
      setPart1GlowIntensity(preset.glowIntensity);
      setPart1GlowColor(preset.glowColor || preset.primaryColor);
    } else {
      setPart1GlowEnabled(false);
      setPart1GlowMode('off');
    }

    // Part 2 Glow defaults off for clean contrast
    setPart2GlowEnabled(false);
    setPart2GlowMode('off');
    setPart2GlowColor('#FFFFFF');

    setHasChromatic3D(!!preset.chromatic3D);
    setStrokeLevel(preset.strokeLevel || (preset.stroke ? 'subtle' : 'none'));
    setHasPillBox(!!preset.pillBox);
    setPillBgColor(preset.pillBg || '#FFFFFF');
    setPrimaryFont(preset.font);
    if (preset.subFont) setContextFont(preset.subFont);
    if (preset.subWeight) setContextFontWeight(preset.subWeight);
    if (preset.textTransform) setTextTransform(preset.textTransform);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      if (w && h) {
        setVideoNativeAspect(`${w} / ${h}`);
        if (w > h) {
          setAspectRatio('16:9');
        }
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Video Upload Handler -> Immediately extracts audio and transcribes via Faster-Whisper
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadedFileName(file.name);
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsPlaying(false);

      await transcribeUploadedVideo(file, selectedLanguage);
    }
  };

  const transcribeUploadedVideo = async (file: File, lang: string) => {
    setIsGenerating(true);
    setTranscriptionStatus('🎙️ Faster-Whisper transcribing speech into authentic Devanagari Hindi...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      // Force 'hindi' if hindi or auto was picked to ensure Whisper never outputs Urdu Arabic text
      formData.append('language', lang);

      const res = await fetch('/api/upload-and-transcribe', {
        method: 'POST',
        body: formData,
      }).catch(() =>
        fetch('http://localhost:8000/api/upload-and-transcribe', {
          method: 'POST',
          body: formData,
        }).catch(() => null)
      );

      if (res && res.ok) {
        const data = await res.json();
        if (data.words && data.words.length > 0) {
          // Check if any word was misclassified into Urdu/Arabic script
          const containsUrdu = data.words.some((w: WordItem) => isUrduArabic(w.word));
          if (containsUrdu) {
            setTranscriptionStatus('🇮🇳 Converting Urdu characters to pure Devanagari Hindi...');
            // Retry with explicit language=hindi
            const retryFormData = new FormData();
            retryFormData.append('file', file);
            retryFormData.append('language', 'hindi');
            const retryRes = await fetch('/api/upload-and-transcribe', {
              method: 'POST',
              body: retryFormData
            }).catch(() => null);
            if (retryRes && retryRes.ok) {
              const retryData = await retryRes.json();
              setWords(retryData.words);
              setDetectedLanguage('hi');
              setTranscriptionStatus(`✨ Faster-Whisper generated ${retryData.words.length} Hindi words!`);
              setTimeout(() => setTranscriptionStatus(''), 4500);
              return;
            }
          }

          setWords(data.words);
          if (data.language) {
            setDetectedLanguage(data.language);
          }
          setTranscriptionStatus(`✨ Faster-Whisper synchronized ${data.words.length} words! [Lang: ${data.language || 'Hindi'}]`);
          setTimeout(() => setTranscriptionStatus(''), 4500);
          return;
        }
      }

      const sampleKey = lang === 'english' ? 'english' : (lang === 'hinglish' ? 'hinglish' : 'hindi');
      setWords([...DEFAULT_SAMPLE_WORDS[sampleKey]]);
      setTranscriptionStatus('⚡ Using timed words preview');
      setTimeout(() => setTranscriptionStatus(''), 3000);
    } catch (err) {
      console.error('Transcription error:', err);
      setWords([...DEFAULT_SAMPLE_WORDS.hindi]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (uploadedFile) {
      transcribeUploadedVideo(uploadedFile, lang);
    } else {
      const sampleKey = lang === 'english' ? 'english' : (lang === 'hinglish' ? 'hinglish' : 'hindi');
      if (DEFAULT_SAMPLE_WORDS[sampleKey]) {
        setWords([...DEFAULT_SAMPLE_WORDS[sampleKey]]);
      }
    }
  };

  const handleGenerateAI = async () => {
    if (uploadedFile) {
      await transcribeUploadedVideo(uploadedFile, selectedLanguage);
      return;
    }

    setIsGenerating(true);
    setTranscriptionStatus('🤖 Generating synchronized subtitles...');
    try {
      const res = await fetch(`/api/transcribe?language=${selectedLanguage}`).catch(() =>
        fetch(`http://localhost:8000/api/transcribe?language=${selectedLanguage}`).catch(() => null)
      );
      if (res && res.ok) {
        const data = await res.json();
        if (data.words && data.words.length > 0) {
          setWords(data.words);
          setBackendConnected(true);
          setTranscriptionStatus('✨ Done!');
          setTimeout(() => setTranscriptionStatus(''), 2500);
          return;
        }
      }
      const sampleKey = selectedLanguage === 'english' ? 'english' : (selectedLanguage === 'hinglish' ? 'hinglish' : 'hindi');
      setWords([...DEFAULT_SAMPLE_WORDS[sampleKey]]);
    } catch {
      setWords([...DEFAULT_SAMPLE_WORDS.hindi]);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateWordText = (index: number, newText: string) => {
    const updated = [...words];
    updated[index].word = newText;
    setWords(updated);
  };

  const updateWordTiming = (index: number, start: number, end: number) => {
    const updated = [...words];
    updated[index].start = start;
    updated[index].end = end;
    setWords(updated);
  };

  const setWordColorOverride = (index: number, color?: string) => {
    const updated = [...words];
    updated[index].customColor = color;
    setWords(updated);
  };

  const removeWord = (index: number) => {
    const updated = words.filter((_, i) => i !== index);
    setWords(updated);
  };

  const addWord = () => {
    const lastWord = words[words.length - 1];
    const newStart = lastWord ? lastWord.end + 0.1 : 0;
    setWords([...words, { word: "नया शब्द", start: newStart, end: newStart + 0.5 }]);
  };

  // Convert all words to authentic Devanagari Hindi
  const convertScriptToHindi = async () => {
    try {
      const fullText = words.map(w => w.word).join(" ");
      const res = await fetch('/api/transliterate-hindi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText })
      }).catch(() =>
        fetch('http://localhost:8000/api/transliterate-hindi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: fullText })
        }).catch(() => null)
      );

      if (res && res.ok) {
        const data = await res.json();
        const convertedTokens = data.hindi.split(" ");
        const updated = words.map((w, i) => ({
          ...w,
          word: convertedTokens[i] || w.word
        }));
        setWords(updated);
        setTranscriptionStatus('🇮🇳 Converted to authentic Devanagari Hindi script!');
        setTimeout(() => setTranscriptionStatus(''), 3000);
      }
    } catch {
      // Fallback
    }
  };

  const convertScriptToHinglish = async () => {
    try {
      const fullText = words.map(w => w.word).join(" ");
      const res = await fetch('/api/transliterate-hinglish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText })
      }).catch(() =>
        fetch('http://localhost:8000/api/transliterate-hinglish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: fullText })
        }).catch(() => null)
      );

      if (res && res.ok) {
        const data = await res.json();
        const convertedTokens = data.hinglish.split(" ");
        const updated = words.map((w, i) => ({
          ...w,
          word: convertedTokens[i] || w.word
        }));
        setWords(updated);
        setTranscriptionStatus('🔤 Converted to Roman Hinglish script!');
        setTimeout(() => setTranscriptionStatus(''), 3000);
      }
    } catch {
      // Fallback
    }
  };

  const autoAddEmojis = () => {
    const emojiMap: Record<string, string> = {
      viral: "🚀",
      reels: "📱",
      captions: "✨",
      money: "💰",
      paisa: "💰",
      growth: "📈",
      fire: "🔥",
      best: "💯",
      secret: "🤫",
      love: "❤️",
      today: "⚡",
      aaj: "⚡",
      namaste: "🙏",
      सीखेंगे: "🔥",
      कैप्शन: "✨",
      धमाका: "💥",
      शानदार: "💯"
    };

    const updated = words.map(item => {
      const clean = item.word.toLowerCase().replace(/[^a-z\u0900-\u097F]/g, '');
      if (emojiMap[clean] && !item.word.includes(emojiMap[clean])) {
        return { ...item, word: `${item.word} ${emojiMap[clean]}` };
      }
      return item;
    });
    setWords(updated);
  };

  const exportSRT = () => {
    let srt = "";
    words.forEach((w, i) => {
      const formatTime = (sec: number) => {
        const d = new Date(0);
        d.setSeconds(sec);
        const ms = Math.floor((sec - Math.floor(sec)) * 1000);
        return d.toISOString().substring(11, 19) + "," + String(ms).padStart(3, '0');
      };
      srt += `${i + 1}\n${formatTime(w.start)} --> ${formatTime(w.end)}\n${w.word}\n\n`;
    });

    const blob = new Blob([srt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verbilo_${selectedLanguage}_subtitles.srt`;
    a.click();
  };

  const handleRenderMP4 = async () => {
    if (words.length === 0) {
      alert("No words to render. Please upload a video and transcribe first.");
      return;
    }
    setIsRendering(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: words,
          font_name: primaryFont.replace(/'/g, "").split(",")[0].trim(),
          font_size: fontSize,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          stroke: strokeLevel !== 'none',
          chunk_size: wordsPerLine,
          y_position: yPosition,
          text_transform: textTransform,
          aspect_ratio: aspectRatio
        })
      });
      const data = await res.json();
      if (data.status === "success" && data.download_url) {
        const downloadLink = document.createElement("a");
        downloadLink.href = `http://127.0.0.1:8000${data.download_url}`;
        downloadLink.download = data.filename || "verbilo_rendered.mp4";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        alert("Render failed: " + (data.detail || "Server error"));
      }
    } catch (err: any) {
      alert("Render error: " + err.message);
    } finally {
      setIsRendering(false);
    }
  };

  // Find exact active word at currentTime with seamless gap-bridging (eliminates flicker/desync)
  let currentWordIndex = -1;
  for (let i = 0; i < words.length; i++) {
    if (currentTime >= words[i].start && currentTime <= words[i].end) {
      currentWordIndex = i;
      break;
    }
  }

  // If between words during a natural speech pause, stay on the current word until the next one starts
  if (currentWordIndex === -1 && words.length > 0) {
    for (let i = words.length - 1; i >= 0; i--) {
      if (currentTime >= words[i].start) {
        const nextWord = words[i + 1];
        if (!nextWord || currentTime < nextWord.start) {
          currentWordIndex = i;
        }
        break;
      }
    }
  }

  const activeWordItem = currentWordIndex !== -1 ? words[currentWordIndex] : (words[0] || null);

  // Group into chunks of `wordsPerLine` (1, 2, 3, or 4 words per line)
  let activeChunk: { item: WordItem; isCurrent: boolean; index: number }[] = [];
  if (words.length > 0) {
    if (wordsPerLine === 1) {
      if (currentWordIndex !== -1) {
        activeChunk = [{ item: words[currentWordIndex], isCurrent: true, index: currentWordIndex }];
      } else if (words[0]) {
        activeChunk = [{ item: words[0], isCurrent: false, index: 0 }];
      }
    } else {
      const targetIdx = currentWordIndex !== -1 ? currentWordIndex : 0;
      const chunkIdx = Math.floor(targetIdx / wordsPerLine);
      const startIdx = chunkIdx * wordsPerLine;
      const endIdx = Math.min(words.length, startIdx + wordsPerLine);
      for (let i = startIdx; i < endIdx; i++) {
        activeChunk.push({
          item: words[i],
          isCurrent: i === currentWordIndex,
          index: i
        });
      }
    }
  }

  // FONT RESOLVER FOR TWO-PART STYLING:
  // Each part has ONE font — the font auto-applies regardless of script
  const getResolvedFont = (_text: string, isMainWord: boolean = true) => {
    return isMainWord ? (primaryFont || selectedPreset.font) : (contextFont || "'Poppins', sans-serif");
  };

  // Calculate rich text shadow & glow — now uses Part 1 / Part 2 independent glow
  const getCalculatedTextShadow = (isCurrent: boolean, customColor?: string) => {
    if (hasChromatic3D && isCurrent) {
      return '-3px -1.5px 0px rgba(255, 0, 85, 0.95), 3px 1.5px 0px rgba(0, 240, 255, 0.95), 0 4px 14px rgba(0,0,0,0.9)';
    }

    if (isCurrent) {
      // Part 1 glow
      if (part1GlowEnabled && part1GlowIntensity > 0) {
        const hue = customColor || part1GlowColor;
        if (part1GlowMode === 'neon' && part1GlowIntensity > 15) {
          return `0 0 ${Math.round(part1GlowIntensity * 0.35)}px ${hue}, 0 0 ${part1GlowIntensity}px ${hue}, 0 0 ${Math.round(part1GlowIntensity * 1.5)}px ${hue}, 0 2px 10px rgba(0,0,0,0.95)`;
        }
        return `0 0 ${part1GlowIntensity}px ${hue}, 0 2px 10px rgba(0,0,0,0.9)`;
      }
      if (selectedPreset.dropShadow) {
        return '0 8px 24px rgba(0,0,0,0.98), 0 2px 6px rgba(0,0,0,0.8)';
      }
      return '0 2px 10px rgba(0,0,0,0.9)';
    } else {
      // Part 2 glow
      if (part2GlowEnabled && part2GlowIntensity > 0) {
        const hue = part2GlowColor;
        if (part2GlowMode === 'neon' && part2GlowIntensity > 10) {
          return `0 0 ${Math.round(part2GlowIntensity * 0.4)}px ${hue}, 0 0 ${part2GlowIntensity}px ${hue}, 0 2px 8px rgba(0,0,0,0.9)`;
        }
        return `0 0 ${part2GlowIntensity}px ${hue}, 0 2px 8px rgba(0,0,0,0.85)`;
      }
      return '0 2px 8px rgba(0,0,0,0.85)';
    }
  };

  // Text stroke style calculation
  const getStrokeClass = () => {
    if (strokeLevel === 'ultra') return 'text-stroke-ultra';
    if (strokeLevel === 'heavy') return 'text-stroke-black';
    if (strokeLevel === 'subtle') return 'text-stroke-subtle';
    return '';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-white flex flex-col selection:bg-[#FF1E1E] selection:text-white">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#0E0E14] z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#FF1E1E] to-[#FFE600] flex items-center justify-center font-black text-black text-lg shadow-[0_0_20px_rgba(255,30,30,0.4)]">
              V
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight">verbilo<span className="text-[#FF1E1E]">.ai</span></span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3.5 py-1.5 rounded-lg transition ${activeTab === 'studio' ? 'bg-[#FF1E1E] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Studio Editor
            </button>
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3.5 py-1.5 rounded-lg transition ${activeTab === 'landing' ? 'bg-[#FF1E1E] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              About Verbilo
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Backend Connection Status Badge */}
          <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${backendConnected === true
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : backendConnected === false
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-white/5 text-gray-400 border-white/10'
            }`}>
            <span className={`w-2 h-2 rounded-full ${backendConnected === true
                ? 'bg-emerald-400 animate-pulse'
                : backendConnected === false
                  ? 'bg-amber-400'
                  : 'bg-gray-500'
              }`} />
            {backendConnected === true ? 'Faster-Whisper Live' : backendConnected === false ? 'Offline Demo' : 'Connecting...'}
          </div>

          <button
            onClick={() => {
              setUploadedFile(null);
              setUploadedFileName('');
              setVideoSrc("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
              setWords(DEFAULT_SAMPLE_WORDS.hindi);
            }}
            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3.5 py-2 rounded-xl transition font-semibold"
          >
            Load Hindi Sample
          </button>
          <button
            onClick={exportSRT}
            className="bg-[#FF1E1E] text-white font-extrabold text-xs px-4 py-2 rounded-xl hover:bg-red-600 transition shadow-[0_0_20px_rgba(255,30,30,0.3)] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export .SRT
          </button>
        </div>
      </nav>

      {/* Main Studio Container */}
      {activeTab === 'studio' ? (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-64px)]">
          {/* Left Panel: Settings, Presets, Customizer */}
          <div className="w-full lg:w-96 border-r border-white/10 p-5 flex flex-col gap-4 bg-[#0D0D12] overflow-y-auto">

            {/* 1. Upload Video with Auto-Timing */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase font-extrabold text-gray-400 tracking-wider flex items-center justify-between">
                <span>1. Upload Reel / Video (9:16)</span>
                {uploadedFileName && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                )}
              </label>

              <label className="border border-dashed border-white/20 hover:border-[#FF1E1E] rounded-xl p-3.5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 bg-white/[0.02] relative group">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Loader2 className="w-6 h-6 text-[#FF1E1E] animate-spin" />
                    <span className="text-xs font-bold text-gray-200">Faster-Whisper syncing Hindi words...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#FF1E1E] transition" />
                    <span className="text-xs text-gray-200 font-semibold truncate max-w-[220px]">
                      {uploadedFileName || "Choose MP4 or MOV Reel"}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {uploadedFileName ? "Click to change video" : "Millisecond audio timestamping"}
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="video/*"
                  disabled={isGenerating}
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>

              {/* Real-time Status Message */}
              {transcriptionStatus && (
                <div className="text-[11px] font-semibold bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg text-red-300 flex items-center gap-1.5 animate-fadeIn">
                  <Sparkles className="w-3 h-3 text-[#FF1E1E]" />
                  <span>{transcriptionStatus}</span>
                </div>
              )}
            </div>

            {/* 2. Global & Regional Language Selector */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase font-extrabold text-gray-400 tracking-wider flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-[#FF1E1E]" /> 2. Audio Spoken Language
                </label>
                {detectedLanguage && (
                  <span className="text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                    Detected: {detectedLanguage.toUpperCase()}
                  </span>
                )}
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs font-bold text-gray-200 focus:outline-none focus:border-[#FF1E1E]"
              >
                {SUPPORTED_LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code} className="bg-neutral-900 text-white">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Re-Sync Button */}
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF1E1E] to-[#FF5500] text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition shadow-[0_0_20px_rgba(255,30,30,0.3)] disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Syncing Word Timestamps...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>{uploadedFile ? "Re-Transcribe Uploaded Video" : "Generate Captions (AI Sync)"}</span>
                </>
              )}
            </button>

            {/* 3. Subtitle Templates Selector (Pairs, Hindi, Verbilo, Glow) */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase font-extrabold text-gray-400 tracking-wider flex items-center gap-1">
                  <Palette className="w-3 h-3 text-[#FF1E1E]" /> 3. Subtitle Templates
                </label>
                <span className="text-[10px] text-gray-500 font-bold">{STYLE_PRESETS.length} Presets</span>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-bold">
                <button
                  onClick={() => setPresetCategory('creator-pairing')}
                  className={`py-1.5 rounded-lg transition text-[11px] flex items-center justify-center gap-1 ${presetCategory === 'creator-pairing' ? 'bg-[#FF1E1E] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Pairs
                </button>
                <button
                  onClick={() => setPresetCategory('hindi-styles')}
                  className={`py-1.5 rounded-lg transition text-[11px] flex items-center justify-center gap-1 ${presetCategory === 'hindi-styles' ? 'bg-[#FF1E1E] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  🇮🇳 Hindi
                </button>
                <button
                  onClick={() => setPresetCategory('verbilo-styles')}
                  className={`py-1.5 rounded-lg transition text-[11px] flex items-center justify-center gap-1 ${presetCategory === 'verbilo-styles' ? 'bg-[#FF1E1E] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Verbilo
                </button>
                <button
                  onClick={() => setPresetCategory('viral-glow')}
                  className={`py-1.5 rounded-lg transition text-[11px] flex items-center justify-center gap-1 ${presetCategory === 'viral-glow' ? 'bg-[#FF1E1E] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  Glow
                </button>
              </div>

              {/* Preset Cards List */}
              <div className="flex flex-col gap-2 max-h-[26vh] overflow-y-auto pr-1">
                {STYLE_PRESETS.filter(p => p.category === presetCategory).map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition relative overflow-hidden group ${isSelected
                          ? 'border-[#FF1E1E] bg-white/[0.08] shadow-[0_0_15px_rgba(255,30,30,0.15)]'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.primaryColor }} />
                          <span className="text-xs font-black text-gray-200">{preset.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {preset.badge && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                              {preset.badge}
                            </span>
                          )}
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-black font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Visual Mini Template Preview */}
                      <div className="bg-[#121217] rounded-lg p-2.5 border border-white/5 flex flex-col items-center justify-center text-center">
                        {preset.previewTop && (
                          <span className="text-[10px] text-white/70 font-light font-poppins leading-tight">
                            {preset.previewTop}
                          </span>
                        )}
                        <span
                          className="text-lg font-black leading-tight my-0.5"
                          style={{
                            color: preset.primaryColor,
                            fontFamily: isDevanagari(preset.previewMain) ? preset.hindiFont : preset.font,
                            fontStyle: preset.fontStyle || 'normal',
                            textTransform: preset.textTransform || 'uppercase',
                            textShadow: preset.chromatic3D
                              ? '-2px -1px 0 #FF0055, 2px 1px 0 #00F0FF'
                              : (preset.glowIntensity > 0 ? `0 0 12px ${preset.glowColor || preset.primaryColor}` : 'none')
                          }}
                        >
                          {preset.previewMain}
                        </span>
                        {preset.previewBottom && (
                          <span className="text-[10px] text-white/70 font-light font-poppins leading-tight">
                            {preset.previewBottom}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. CAPTION CUSTOMIZER (TWO DISTINCT PARTS: MAIN WORD + OTHER WORDS) */}
            <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase font-extrabold text-gray-400 tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#FF1E1E]" /> 4. Customize Captions
                </label>
                <span className="text-[10px] text-[#FF1E1E] font-bold">{selectedPreset.name}</span>
              </div>

              {/* A. WORDS PER LINE SELECTOR (1, 2, 3, or 4 words) */}
              <div className="flex flex-col gap-1.5 bg-white/[0.02] p-2.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
                    <AlignLeft className="w-3.5 h-3.5 text-[#FF1E1E]" /> Words Per Line
                  </span>
                  <span className="text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    {wordsPerLine} {wordsPerLine === 1 ? 'Word' : 'Words'} / Line
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setWordsPerLine(num)}
                      className={`py-2 px-1 rounded-lg text-xs font-black border transition flex items-center justify-center ${wordsPerLine === num
                          ? 'bg-[#FF1E1E] text-white border-[#FF1E1E] shadow-[0_0_12px_rgba(255,30,30,0.35)] scale-102'
                          : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <span>{num} {num === 1 ? 'Word' : 'Words'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* B. LAYOUT MODE: Stacked vs Inline */}
              <div className="flex flex-col gap-1.5 bg-white/[0.02] p-2.5 rounded-xl border border-white/10">
                <span className="text-[11px] font-bold text-gray-300">Layout Format</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLayoutMode('splash')}
                    className={`py-2 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 border transition ${layoutMode === 'splash'
                        ? 'bg-red-500/15 text-red-400 border-red-500'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                      }`}
                  >
                    <span>☲ Stacked</span>
                  </button>
                  <button
                    onClick={() => setLayoutMode('center')}
                    className={`py-2 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 border transition ${layoutMode === 'center'
                        ? 'bg-red-500/15 text-red-400 border-red-500'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                      }`}
                  >
                    <span>≡ Inline</span>
                  </button>
                </div>
              </div>

              {/* ═══ PART 1: MAIN WORD (HIGHLIGHT / PUNCH WORD) ═══ */}
              <div className="flex flex-col gap-2.5 bg-gradient-to-b from-red-500/[0.04] to-transparent p-3 rounded-xl border border-red-500/30">
                <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#FF1E1E]" /> PART 1: MAIN WORD
                  </span>
                  <span className="text-[9px] text-red-400 font-bold bg-red-500/15 px-2 py-0.5 rounded-md border border-red-500/30 uppercase tracking-wider">
                    Active / Highlight
                  </span>
                </div>

                {/* Unified Font Selector — ALL scripts in one dropdown */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-semibold">Font</label>
                  <select
                    value={primaryFont}
                    onChange={(e) => setPrimaryFont(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-bold text-white focus:outline-none focus:border-[#FF1E1E]"
                  >
                    <optgroup label="🔥 Viral Punch" className="bg-neutral-900">
                      {ALL_FONTS.filter(f => f.category === 'punch').map(f => (
                        <option key={f.id} value={f.font} className="bg-neutral-900 text-white">{f.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🇮🇳 Hindi / Devanagari" className="bg-neutral-900">
                      {ALL_FONTS.filter(f => f.category === 'hindi').map(f => (
                        <option key={f.id} value={f.font} className="bg-neutral-900 text-white">{f.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🇧🇩 Bengali / বাংলা" className="bg-neutral-900">
                      {ALL_FONTS.filter(f => f.category === 'bengali').map(f => (
                        <option key={f.id} value={f.font} className="bg-neutral-900 text-white">{f.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="✨ Clean Sans" className="bg-neutral-900">
                      {ALL_FONTS.filter(f => f.category === 'clean').map(f => (
                        <option key={f.id} value={f.font} className="bg-neutral-900 text-white">{f.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🎨 Artistic" className="bg-neutral-900">
                      {ALL_FONTS.filter(f => f.category === 'artistic').map(f => (
                        <option key={f.id} value={f.font} className="bg-neutral-900 text-white">{f.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Main Word Color */}
                <div className="flex flex-col gap-1.5 pt-1.5 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300 font-semibold">Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-white text-center focus:outline-none focus:border-[#FF1E1E]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {VIRAL_COLORS.map(c => (
                      <button
                        key={c.hex}
                        onClick={() => {
                          setPrimaryColor(c.hex);
                          if (part1GlowEnabled) setPart1GlowColor(c.hex);
                        }}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        className={`w-5 h-5 rounded-md shrink-0 border transition ${primaryColor === c.hex ? 'border-white scale-110 shadow-sm' : 'border-black/50 hover:scale-105'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Part 1 Glow Controls */}
                <div className="flex flex-col gap-1.5 pt-1.5 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-300">Glow</span>
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      {(['neon', 'soft', 'off'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => {
                            setPart1GlowMode(mode);
                            setPart1GlowEnabled(mode !== 'off');
                            if (mode !== 'off' && part1GlowIntensity === 0) setPart1GlowIntensity(22);
                            if (mode === 'off') setPart1GlowIntensity(0);
                          }}
                          className={`px-2 py-0.5 rounded border transition capitalize ${part1GlowMode === mode ? 'bg-[#FF1E1E] text-white border-[#FF1E1E]' : 'bg-white/5 text-gray-400 border-white/10'}`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                  {part1GlowEnabled && (
                    <div className="flex items-center gap-2">
                      <input
                        type="range" min={0} max={60} value={part1GlowIntensity}
                        onChange={(e) => setPart1GlowIntensity(Number(e.target.value))}
                        className="flex-1 accent-[#FF1E1E] cursor-pointer"
                      />
                      <input
                        type="color" value={part1GlowColor}
                        onChange={(e) => setPart1GlowColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-gray-400 font-mono w-8 text-right">{part1GlowIntensity}px</span>
                    </div>
                  )}
                </div>

                {/* Word Scale */}
                <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[11px]">
                  <span className="text-gray-400">Scale</span>
                  <div className="flex items-center gap-1 font-bold text-xs">
                    {[1.15, 1.35, 1.55].map(scale => (
                      <button
                        key={scale}
                        onClick={() => setPunchScale(scale)}
                        className={`px-2 py-0.5 rounded border transition ${punchScale === scale ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-white/5 text-gray-400 border-white/10'
                          }`}
                      >
                        {scale === 1.15 ? 'Normal' : scale === 1.35 ? 'Large' : 'Mega Big'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ═══ PART 2: OTHER WORDS (SUPPORTING) ═══ */}
              <div className="flex flex-col gap-2.5 bg-white/[0.02] p-3 rounded-xl border border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-black text-gray-200 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-gray-400" /> PART 2: OTHER WORDS
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold bg-white/5 px-2 py-0.5 rounded-md border border-white/10 uppercase tracking-wider">
                    Supporting
                  </span>
                </div>

                {/* Unified Font Selector for Part 2 */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 font-semibold">Font</label>
                  <select
                    value={contextFont}
                    onChange={(e) => setContextFont(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-bold text-white focus:outline-none focus:border-[#FF1E1E]"
                  >
                    <optgroup label="✨ Clean Sans" className="bg-neutral-900">
                      {ALL_FONTS.filter(f => f.category === 'clean').map(f => (
                        <option key={f.id} value={f.font} className="bg-neutral-900 text-white">{f.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🔥 Viral Punch" className="bg-neutral-900">
                      {ALL_FONTS.filter(f => f.category === 'punch').map(f => (
                        <option key={f.id} value={f.font} className="bg-neutral-900 text-white">{f.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🇮🇳 Hindi / Devanagari" className="bg-neutral-900">
                      {ALL_FONTS.filter(f => f.category === 'hindi').map(f => (
                        <option key={f.id} value={f.font} className="bg-neutral-900 text-white">{f.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🇧🇩 Bengali / বাংলা" className="bg-neutral-900">
                      {ALL_FONTS.filter(f => f.category === 'bengali').map(f => (
                        <option key={f.id} value={f.font} className="bg-neutral-900 text-white">{f.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🎨 Artistic" className="bg-neutral-900">
                      {ALL_FONTS.filter(f => f.category === 'artistic').map(f => (
                        <option key={f.id} value={f.font} className="bg-neutral-900 text-white">{f.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Color */}
                <div className="flex flex-col gap-1.5 pt-1.5 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300 font-semibold">Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-white text-center focus:outline-none focus:border-[#FF1E1E]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {CONTEXT_COLORS.map(c => (
                      <button
                        key={c.hex}
                        onClick={() => setSecondaryColor(c.hex)}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        className={`w-5 h-5 rounded-md shrink-0 border transition ${secondaryColor === c.hex ? 'border-white scale-110 shadow-sm' : 'border-white/20 hover:scale-105'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Weight */}
                <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[11px]">
                  <span className="text-gray-400">Weight</span>
                  <div className="flex items-center gap-1 font-bold text-xs">
                    {[
                      { label: 'Light', w: 300 },
                      { label: 'Regular', w: 400 },
                      { label: 'Medium', w: 500 },
                      { label: 'Bold', w: 700 }
                    ].map(item => (
                      <button
                        key={item.w}
                        onClick={() => setContextFontWeight(item.w)}
                        className={`px-2 py-0.5 rounded border transition ${contextFontWeight === item.w ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10'
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Part 2 Glow Controls */}
                <div className="flex flex-col gap-1.5 pt-1.5 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-300">Glow</span>
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      {(['neon', 'soft', 'off'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => {
                            setPart2GlowMode(mode);
                            setPart2GlowEnabled(mode !== 'off');
                            if (mode !== 'off' && part2GlowIntensity === 0) setPart2GlowIntensity(14);
                            if (mode === 'off') setPart2GlowIntensity(0);
                          }}
                          className={`px-2 py-0.5 rounded border transition capitalize ${part2GlowMode === mode ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10'}`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                  {part2GlowEnabled && (
                    <div className="flex items-center gap-2">
                      <input
                        type="range" min={0} max={40} value={part2GlowIntensity}
                        onChange={(e) => setPart2GlowIntensity(Number(e.target.value))}
                        className="flex-1 accent-white cursor-pointer"
                      />
                      <input
                        type="color" value={part2GlowColor}
                        onChange={(e) => setPart2GlowColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-gray-400 font-mono w-8 text-right">{part2GlowIntensity}px</span>
                    </div>
                  )}
                </div>

                {/* Dimming */}
                <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[11px]">
                  <span className="text-gray-400">Dimming</span>
                  <div className="flex items-center gap-1 font-bold text-xs">
                    <button
                      onClick={() => setEmphasisMode('emphasize')}
                      className={`px-2 py-0.5 rounded border transition ${emphasisMode === 'emphasize' ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10'
                        }`}
                    >
                      Subtle (85%)
                    </button>
                    <button
                      onClick={() => setEmphasisMode('spotlight')}
                      className={`px-2 py-0.5 rounded border transition ${emphasisMode === 'spotlight' ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10'
                        }`}
                    >
                      Spotlight (40%)
                    </button>
                  </div>
                </div>
              </div>

              {/* EFFECTS & POSITION */}
              <div className="flex flex-col gap-2.5 bg-white/[0.02] p-2.5 rounded-xl border border-white/10">
                <span className="text-[11px] font-bold text-gray-300">EFFECTS & POSITION</span>

                {/* 3D, Pill, Stroke Toggles */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setHasChromatic3D(!hasChromatic3D)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition ${hasChromatic3D ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-white/5 text-gray-400 border-white/10'}`}
                  >
                    3D {hasChromatic3D ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => setHasPillBox(!hasPillBox)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition ${hasPillBox ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10'}`}
                  >
                    Pill {hasPillBox ? 'ON' : 'OFF'}
                  </button>
                  <select
                    value={strokeLevel}
                    onChange={(e) => setStrokeLevel(e.target.value as any)}
                    className="bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white px-1.5 py-1.5 focus:outline-none focus:border-[#FF1E1E]"
                  >
                    <option value="none" className="bg-neutral-900">Stroke: Off</option>
                    <option value="subtle" className="bg-neutral-900">Stroke: Subtle</option>
                    <option value="heavy" className="bg-neutral-900">Stroke: Heavy</option>
                    <option value="ultra" className="bg-neutral-900">Stroke: Ultra</option>
                  </select>
                </div>

                {/* Font Size */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-semibold w-12">Size</span>
                  <input type="range" min={24} max={65} value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="flex-1 accent-[#FF1E1E] cursor-pointer"
                  />
                  <span className="text-[10px] text-white font-mono w-10 text-right">{fontSize}px</span>
                </div>

                {/* Y Position */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-semibold w-12">Y Pos</span>
                  <input type="range" min={20} max={90} value={yPosition}
                    onChange={(e) => setYPosition(Number(e.target.value))}
                    className="flex-1 accent-[#FF1E1E] cursor-pointer"
                  />
                  <span className="text-[10px] text-white font-mono w-10 text-right">{yPosition}%</span>
                </div>
              </div>

              {/* ═══ WORDS PER LINE SELECTOR (1, 2, 3, or 4 Words) ═══ */}
              <div className="flex flex-col gap-2 bg-white/[0.02] p-2.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
                    <AlignLeft className="w-3.5 h-3.5 text-[#FF1E1E]" /> WORDS PER LINE
                  </span>
                  <span className="text-[10px] text-[#FF1E1E] font-bold bg-[#FF1E1E]/10 border border-[#FF1E1E]/20 px-2 py-0.5 rounded-md">
                    {wordsPerLine === 1 ? '1 Word (Fast Flash)' : `${wordsPerLine} Words / Chunk`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => setWordsPerLine(num)}
                      className={`py-2 rounded-lg text-xs font-bold border transition flex flex-col items-center justify-center gap-0.5 ${wordsPerLine === num
                        ? 'bg-[#FF1E1E] text-white border-[#FF1E1E] shadow-[0_0_12px_rgba(255,30,30,0.35)]'
                        : 'bg-white/5 text-gray-400 hover:text-white border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm font-black">{num}</span>
                      <span className="text-[9px] uppercase tracking-wider">{num === 1 ? 'Word' : 'Words'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel: Multi-Format Video Player with Dynamic Aspect Ratio */}
          <div className="flex-1 bg-black flex flex-col items-center justify-center p-3 lg:p-5 relative overflow-hidden">
            {/* Aspect Ratio Selector Toolbar */}
            <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5 bg-white/5 p-1.5 rounded-xl border border-white/10 backdrop-blur-md z-30">
              <span className="text-[11px] font-bold text-gray-400 px-2 flex items-center gap-1">
                Video Format:
              </span>
              {[
                { id: '9:16', label: '9:16 Reel / Story', icon: '📱' },
                { id: '16:9', label: '16:9 YouTube', icon: '🖥️' },
                { id: '1:1', label: '1:1 Square', icon: '⬛' },
                { id: '4:5', label: '4:5 Feed', icon: '📸' },
                { id: 'original', label: 'Fit Video', icon: '📐' }
              ].map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${aspectRatio === ratio.id
                      ? 'bg-[#FF1E1E] text-white shadow-[0_0_12px_rgba(255,30,30,0.3)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <span>{ratio.icon}</span>
                  <span>{ratio.label}</span>
                </button>
              ))}

              <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />

              <button
                onClick={() => setVideoFit(videoFit === 'cover' ? 'contain' : 'cover')}
                className="text-[11px] font-semibold text-gray-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition"
              >
                {videoFit === 'cover' ? 'Crop to Fill' : 'Fit Entire'}
              </button>
            </div>

            <div
              className={`relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-950 flex items-center justify-center transition-all duration-200 ${aspectRatio === '9:16'
                  ? 'h-[75vh] aspect-[9/16]'
                  : aspectRatio === '16:9'
                    ? 'w-full max-w-[840px] aspect-[16/9] max-h-[70vh]'
                    : aspectRatio === '1:1'
                      ? 'h-[70vh] aspect-square'
                      : aspectRatio === '4:5'
                        ? 'h-[75vh] aspect-[4/5]'
                        : 'max-h-[75vh] max-w-[85vw]'
                }`}
              style={aspectRatio === 'original' ? { aspectRatio: videoNativeAspect } : undefined}
            >
              <video
                ref={videoRef}
                src={videoSrc}
                playsInline
                loop
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
                className={`w-full h-full cursor-pointer ${videoFit === 'cover' ? 'object-cover' : 'object-contain'}`}
              />

              {/* AI Processing Overlay Indicator */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-40 pointer-events-none">
                  <div className="w-14 h-14 rounded-2xl bg-[#FF1E1E]/20 border border-[#FF1E1E] flex items-center justify-center mb-4">
                    <Loader2 className="w-7 h-7 text-[#FF1E1E] animate-spin" />
                  </div>
                  <h4 className="text-base font-extrabold text-white mb-1">Faster-Whisper AI Word Sync</h4>
                  <p className="text-xs text-gray-300 max-w-xs font-medium">
                    Performing acoustic alignment & generating Devanagari Hindi captions...
                  </p>
                </div>
              )}

              {/* SUBTITLE OVERLAY RENDERING (TWO-PART STYLING: MAIN WORD + OTHER WORDS) */}
              {activeWordItem && activeChunk.length > 0 && (
                <div
                  className="absolute w-full px-6 text-center pointer-events-none transition-all duration-75 select-none"
                  style={{ top: `${yPosition}%` }}
                >
                  {/* LAYOUT A: SPLASH (Stacked Mode) */}
                  {layoutMode === 'splash' ? (
                    <div className="inline-flex flex-col items-center justify-center px-4 py-2">
                      {wordsPerLine === 1 ? (
                        /* Single Word Rapid Flash */
                        <div
                          className={`transition-transform duration-75 inline-block font-black my-1 ${emphasisMode === 'emphasize' ? 'scale-120' : 'scale-100'
                            } ${getStrokeClass()}`}
                          style={{
                            fontFamily: getResolvedFont(activeWordItem.word, true),
                            fontWeight: 900,
                            fontStyle: selectedPreset.fontStyle || 'normal',
                            fontSize: `${Math.round(fontSize * punchScale * 1.15)}px`,
                            textTransform: isDevanagari(activeWordItem.word) ? 'none' : textTransform,
                            letterSpacing: selectedPreset.letterSpacing || 'normal',
                            color: hasPillBox ? '#000000' : (activeWordItem.customColor || primaryColor),
                            backgroundColor: hasPillBox ? pillBgColor : 'transparent',
                            padding: hasPillBox ? '4px 14px' : '0',
                            borderRadius: hasPillBox ? '12px' : '0',
                            textShadow: hasPillBox ? 'none' : getCalculatedTextShadow(true, activeWordItem.customColor)
                          }}
                        >
                          {activeWordItem.word}
                        </div>
                      ) : (
                        /* Stacked Multi-Word Display (2, 3, or 4 words) */
                        <div className="flex flex-col items-center justify-center gap-1">
                          {activeChunk.map((c) => {
                            const isCurrent = c.isCurrent;
                            const wordFont = getResolvedFont(c.item.word, isCurrent);
                            const effectiveColor = isCurrent
                              ? (hasPillBox ? '#000000' : (c.item.customColor || primaryColor))
                              : (c.item.customColor || secondaryColor);

                            return (
                              <div
                                key={c.index}
                                className={`transition-all duration-75 leading-tight ${isCurrent ? 'font-black scale-110 z-10' : (emphasisMode === 'spotlight' ? 'opacity-40 font-normal' : 'opacity-85 font-normal')
                                  } ${isCurrent ? getStrokeClass() : ''}`}
                                style={{
                                  fontFamily: wordFont,
                                  fontWeight: isCurrent ? 900 : (contextFontWeight || 400),
                                  fontSize: isCurrent ? `${Math.round(fontSize * punchScale)}px` : `${Math.round(fontSize * 0.78)}px`,
                                  color: effectiveColor,
                                  textTransform: isDevanagari(c.item.word) ? 'none' : textTransform,
                                  backgroundColor: isCurrent && hasPillBox ? pillBgColor : 'transparent',
                                  padding: isCurrent && hasPillBox ? '2px 10px' : '0',
                                  borderRadius: isCurrent && hasPillBox ? '8px' : '0',
                                  textShadow: isCurrent && hasPillBox ? 'none' : getCalculatedTextShadow(isCurrent, c.item.customColor)
                                }}
                              >
                                {c.item.word}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* LAYOUT B: CENTER (Inline Continuous Line) */
                    <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-3 py-1.5 font-black">
                      {activeChunk.map((c) => {
                        const isCurrent = c.isCurrent;
                        const wordFont = getResolvedFont(c.item.word, isCurrent);
                        const effectiveColor = isCurrent
                          ? (hasPillBox ? '#000000' : (c.item.customColor || primaryColor))
                          : (c.item.customColor || secondaryColor);

                        return (
                          <span
                            key={c.index}
                            className={`transition-all duration-75 inline-block ${isCurrent
                                ? (emphasisMode === 'emphasize' ? 'scale-115 z-10' : 'scale-105 z-10')
                                : (emphasisMode === 'spotlight' ? 'opacity-40 font-normal' : 'opacity-85 font-normal')
                              } ${isCurrent ? getStrokeClass() : ''}`}
                            style={{
                              fontFamily: wordFont,
                              fontWeight: isCurrent ? 900 : (contextFontWeight || 400),
                              fontStyle: selectedPreset.fontStyle || 'normal',
                              fontSize: `${isCurrent ? Math.round(fontSize * punchScale) : Math.round(fontSize * 0.88)}px`,
                              textTransform: isDevanagari(c.item.word) ? 'none' : textTransform,
                              color: effectiveColor,
                              backgroundColor: isCurrent && hasPillBox ? pillBgColor : 'transparent',
                              padding: isCurrent && hasPillBox ? '2px 10px' : '0',
                              borderRadius: isCurrent && hasPillBox ? '8px' : '0',
                              textShadow: isCurrent && hasPillBox ? 'none' : getCalculatedTextShadow(isCurrent, c.item.customColor)
                            }}
                          >
                            {c.item.word}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Floating Player Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Video Timeline Scrubber */}
              <div className="absolute bottom-3 left-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 flex items-center gap-3">
                <span className="text-[10px] font-mono text-gray-300">{currentTime.toFixed(1)}s</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 15}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = Number(e.target.value);
                      setCurrentTime(Number(e.target.value));
                    }
                  }}
                  className="flex-1 accent-[#FF1E1E] cursor-pointer"
                />
                <span className="text-[10px] font-mono text-gray-400">{duration.toFixed(1)}s</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Word-by-Word Timeline Editor */}
          <div className="w-full lg:w-96 border-l border-white/10 p-5 flex flex-col justify-between bg-[#0D0D12]">
            <div className="flex flex-col gap-3 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-gray-200">Transcript Editor</h3>
                  <span className="text-[10px] text-gray-500">Edit text, timestamps & colors</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[#FF1E1E] font-mono font-bold bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                    {words.length}w
                  </span>
                </div>
              </div>

              {/* Quick Script Conversion Tools (Hindi Devanagari <-> Hinglish Roman) */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 text-[11px] font-bold">
                <button
                  onClick={convertScriptToHindi}
                  title="Transliterate to Devanagari Hindi"
                  className="py-1.5 px-2 bg-white/5 hover:bg-white/10 rounded-lg text-emerald-400 flex items-center justify-center gap-1 transition"
                >
                  <span>🇮🇳 हिन्दी</span>
                </button>
                <button
                  onClick={convertScriptToHinglish}
                  title="Transliterate to Roman Hinglish"
                  className="py-1.5 px-2 bg-white/5 hover:bg-white/10 rounded-lg text-sky-400 flex items-center justify-center gap-1 transition"
                >
                  <span>🔤 Hinglish</span>
                </button>
                <button
                  onClick={autoAddEmojis}
                  title="Auto-insert viral emojis"
                  className="py-1.5 px-2 bg-white/5 hover:bg-white/10 rounded-lg text-yellow-400 flex items-center justify-center gap-1 transition"
                >
                  <Smile className="w-3.5 h-3.5" /> <span>Emojis</span>
                </button>
              </div>

              {/* Word List */}
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[62vh] pr-1">
                {words.map((item, idx) => {
                  const isCurrent = currentTime >= item.start && currentTime <= item.end;
                  const wordHasHindi = isDevanagari(item.word);
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex flex-col gap-1.5 transition ${isCurrent
                          ? 'border-[#FF1E1E] bg-white/10 shadow-[0_0_15px_rgba(255,30,30,0.15)]'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={item.word}
                          onChange={(e) => updateWordText(idx, e.target.value)}
                          className={`bg-transparent font-bold text-sm focus:outline-none flex-1 text-white ${wordHasHindi ? 'text-base' : ''
                            }`}
                          style={{
                            fontFamily: primaryFont,
                            color: item.customColor || undefined
                          }}
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.1"
                            value={item.start}
                            onChange={(e) => updateWordTiming(idx, parseFloat(e.target.value) || 0, item.end)}
                            className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[10px] text-gray-300 font-mono text-center focus:outline-none focus:border-[#FF1E1E]"
                          />
                          <span className="text-[10px] text-gray-400 font-mono">s</span>
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = item.start;
                                videoRef.current.play();
                                setIsPlaying(true);
                              }
                            }}
                            className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-gray-200 font-bold"
                          >
                            Play
                          </button>
                          <button
                            onClick={() => removeWord(idx)}
                            className="text-red-400 hover:text-red-300 text-xs px-1.5 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Quick Word Custom Highlight Color Picker */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                        <span className="text-gray-500">Highlight Color:</span>
                        <div className="flex items-center gap-1">
                          {[
                            { name: 'Default', hex: undefined },
                            { name: 'Red', hex: '#FF1E1E' },
                            { name: 'Lime', hex: '#CCFF00' },
                            { name: 'Cyan', hex: '#00F0FF' },
                            { name: 'Yellow', hex: '#FFE600' }
                          ].map((c, ci) => (
                            <button
                              key={ci}
                              onClick={() => setWordColorOverride(idx, c.hex)}
                              title={c.name}
                              className={`w-3.5 h-3.5 rounded-full border ${!c.hex
                                  ? 'bg-transparent border-gray-500'
                                  : (item.customColor === c.hex ? 'border-white scale-125' : 'border-black/50')
                                }`}
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={addWord}
                className="w-full py-2 rounded-xl border border-dashed border-white/20 hover:border-white/40 text-xs font-bold text-gray-300 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Word
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={exportSRT}
                  className="py-3 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-gray-200 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export .SRT
                </button>
                <button
                  onClick={handleRenderMP4}
                  disabled={isRendering}
                  className="py-3 rounded-xl bg-[#FF1E1E] text-white font-extrabold text-xs hover:bg-red-600 transition flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,30,30,0.3)] disabled:opacity-50"
                >
                  {isRendering ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Burning MP4...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-3.5 h-3.5" />
                      <span>Render MP4</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Landing Page Mode */
        <div className="flex-1 overflow-y-auto">
          <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#FF1E1E] mb-8">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Faster-Whisper: Millisecond Word Precision & Font Pairs
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
              AI Auto-Captions That Make Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1E1E] via-[#FFE600] to-[#00F0FF]">Reels Go Viral</span>
            </h1>

            <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Create Alex Hormozi and Verbilo-style animated kinetic subtitles in seconds. High-contrast font pairs with punchy highlight words and clean supporting fonts.
            </p>

            <button
              onClick={() => setActiveTab('studio')}
              className="px-8 py-4 rounded-full bg-[#FF1E1E] text-white font-extrabold text-base hover:bg-red-600 transition shadow-[0_0_30px_rgba(255,30,30,0.4)] hover:scale-105"
            >
              Open Studio Now Free →
            </button>
          </section>

          <section className="py-16 border-y border-white/10 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h2 className="text-xs uppercase tracking-widest font-extrabold text-gray-400 mb-8">
                Global & Regional Language Support with Dedicated Typography
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SUPPORTED_LANGUAGES.slice(0, 8).map((item) => (
                  <div key={item.code} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
                    <span className="text-xs font-extrabold text-[#FF1E1E] block mb-1">{item.label}</span>
                    <span className="text-[11px] text-gray-400 block font-mono">Script: {item.script}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
