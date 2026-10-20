import re

EMOJI_TRIGGERS = {
    "viral": "🔥",
    "aag": "🔥",
    "trending": "📈",
    "views": "👀",
    "followers": "👥",
    "money": "💰",
    "paisa": "💰",
    "crore": "💸",
    "lakh": "💵",
    "growth": "🚀",
    "boost": "🚀",
    "secret": "🤫",
    "raaz": "🤫",
    "shock": "🤯",
    "sach": "⚡",
    "best": "💯",
    "mast": "💯",
    "zabardast": "🔥",
    "super": "✨",
    "namaste": "🙏",
    "bhai": "🤝",
    "dosto": "🙌",
    "reel": "📱",
    "target": "🎯",
    "win": "🏆",
    "success": "👑",
}

# Phonetic character mapping from Devanagari to Roman Hinglish
DEV_TO_ROMAN = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah',
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', '्': '', 'ः': 'h'
}

COMMON_DEV_WORDS = {
    "नमस्ते": "Namaste",
    "दोस्तों": "Dosto",
    "दोस्तों,": "Dosto,",
    "क्या": "Kya",
    "हाल": "Haal",
    "है": "Hai",
    "आज": "Aaj",
    "हम": "Hum",
    "सीखेंगे": "Seekhenge",
    "बात": "Baat",
    "करेंगे": "Karenge",
    "वायरल": "Viral",
    "कैप्शन": "Caption",
    "कैसे": "Kaise",
    "बनाएं": "Banaye",
    "वीडियो": "Video",
    "फॉलोअर्स": "Followers",
    "करोड़": "Crore",
    "लाख": "Lakh",
    "रुपए": "Rupaye",
    "सुपर": "Super",
    "शानदार": "Shandar",
    "देखो": "Dekho",
    "सुनो": "Suno",
    "अगर": "Agar",
    "आप": "Aap",
    "भी": "Bhi",
    "चाहते": "Chahte",
    "हो": "Ho",
    "बनाना": "Banana",
    "बनाते": "Banate",
    "हैं": "Hain",
    "हैं!": "Hain!",
    "सब": "Sab",
    "भारत": "Bharat",
    "शुरू": "Shuru",
    "करो": "Karo",
    "शेयर": "Share",
    "लाइक": "Like",
    "कमेंट": "Comment",
}

# Reverse dictionary for Hinglish -> Devanagari
ROMAN_TO_DEV_MAP = {
    v.lower().strip(",!?."): k.strip(",!?.")
    for k, v in COMMON_DEV_WORDS.items()
}
# Extra phonetic mappings for creator slang
ROMAN_TO_DEV_MAP.update({
    "namaste": "नमस्ते",
    "namaskar": "नमस्कार",
    "dosto": "दोस्तों",
    "dost": "दोस्त",
    "bhai": "भाई",
    "aaj": "आज",
    "hum": "हम",
    "kya": "क्या",
    "haal": "हाल",
    "hai": "है",
    "hain": "हैं",
    "seekhenge": "सीखेंगे",
    "seekho": "सीखो",
    "viral": "वायरल",
    "reels": "रील्स",
    "reel": "रील",
    "caption": "कैप्शन",
    "captions": "कैप्शन",
    "kaise": "कैसे",
    "banaye": "बनाएं",
    "banate": "बनाते",
    "banana": "बनाना",
    "karenge": "करेंगे",
    "karo": "करो",
    "dekho": "देखो",
    "suno": "सुनो",
    "paisa": "पैसा",
    "crore": "करोड़",
    "lakh": "लाख",
    "rupaye": "रुपए",
    "shandar": "शानदार",
    "mast": "मस्त",
    "sab": "सब",
    "sabko": "सबको",
    "video": "वीडियो",
    "followers": "फॉलोअर्स",
    "views": "व्यूज",
    "growth": "ग्रोथ",
    "secret": "सीक्रेट",
    "raaz": "राज़",
    "target": "टारगेट",
    "love": "लव",
    "super": "सुपर",
    "best": "बेस्ट"
})

DEV_CONSONANTS = set("कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़")
DEV_MATRAS = set("ािीुूृेैोौंँः्")

def transliterate_devanagari_to_hinglish(text: str) -> str:
    """
    Intelligently converts Devanagari Hindi text to clean, natural Hinglish.
    Preserves English words, numbers, and Bengali script.
    Uses dictionary match first, then schwa-aware phonetic transliteration.
    """
    if not text:
        return text

    # If already Bengali script, keep as-is (do not transliterate Bengali to Roman Hindi)
    if bool(re.search(r'[\u0980-\u09FF]', text)):
        return text

    words = text.split()
    converted_words = []
    
    for word in words:
        clean_word = re.sub(r'[^\w\s]', '', word)
        punct_before = "".join([c for c in word[:2] if not c.isalnum() and not '\u0900' <= c <= '\u097F'])
        punct_after = "".join([c for c in word[-2:] if not c.isalnum() and not '\u0900' <= c <= '\u097F'])

        if clean_word in COMMON_DEV_WORDS:
            converted = punct_before + COMMON_DEV_WORDS[clean_word] + punct_after
        elif clean_word.lower() in [k.lower() for k in COMMON_DEV_WORDS.values()]:
            converted = word
        else:
            chars = []
            n = len(word)
            for i, ch in enumerate(word):
                if ch in DEV_TO_ROMAN:
                    roman_equiv = DEV_TO_ROMAN[ch]
                    chars.append(roman_equiv)
                    # Inherent 'a' for consonants if followed by consonant
                    if ch in DEV_CONSONANTS:
                        next_ch = word[i + 1] if i + 1 < n else None
                        if next_ch:
                            if next_ch not in DEV_MATRAS and next_ch in DEV_CONSONANTS:
                                chars.append('a')
                        elif n <= 2:
                            chars.append('a')
                else:
                    chars.append(ch)
            converted = "".join(chars).capitalize() if chars else word
            
        converted_words.append(converted)

    return " ".join(converted_words)

def transliterate_hinglish_to_devanagari(text: str) -> str:
    """Converts Hinglish Roman text to Devanagari Hindi."""
    if not text:
        return text

    words = text.split()
    converted_words = []

    for word in words:
        clean_word = re.sub(r'[^\w\s]', '', word).lower()
        punct = "".join([c for c in word if not c.isalnum()])

        if clean_word in ROMAN_TO_DEV_MAP:
            converted = ROMAN_TO_DEV_MAP[clean_word] + punct
        else:
            converted = word

        converted_words.append(converted)

    return " ".join(converted_words)

def enrich_with_emojis(word: str) -> str:
    """Appends viral emojis to trigger words."""
    clean = re.sub(r'[^\w]', '', word.lower())
    if clean in EMOJI_TRIGGERS:
        emoji = EMOJI_TRIGGERS[clean]
        if emoji not in word:
            return f"{word} {emoji}"
    return word


# ============================================================
# URDU (Perso-Arabic Script) → DEVANAGARI HINDI CONVERTER
# ============================================================
# Faster-Whisper base model frequently misclassifies spoken Hindi
# as Urdu, outputting Perso-Arabic text. This converts it to
# proper Devanagari Hindi.

def is_urdu_arabic(text: str) -> bool:
    """Returns True if text contains any Urdu/Arabic script characters."""
    return bool(re.search(r'[\u0600-\u06FF]', text))


# Word-level dictionary: common Urdu words → Devanagari Hindi
URDU_TO_HINDI_WORDS = {
    # Conjunctions & Particles
    'و': 'और', 'اور': 'और', 'پھر': 'फिर', 'تو': 'तो', 'کہ': 'कि',
    'لیکن': 'लेकिन', 'مگر': 'मगर', 'اگر': 'अगर', 'کیونکہ': 'क्योंकि',
    'یا': 'या', 'نہ': 'न', 'بس': 'बस', 'صرف': 'सिर्फ', 'سے': 'से',
    'کے': 'के', 'کا': 'का', 'کی': 'की', 'پر': 'पर', 'میں': 'में',
    'کو': 'को', 'نے': 'ने', 'تک': 'तक', 'بھی': 'भी',

    # Pronouns
    'میں': 'मैं', 'ہم': 'हम', 'تم': 'तुम', 'آپ': 'आप', 'وہ': 'वह',
    'یہ': 'यह', 'اس': 'उस', 'ان': 'उन', 'جو': 'जो', 'کون': 'कौन',
    'کوئی': 'कोई', 'کچھ': 'कुछ', 'سب': 'सब', 'سبھی': 'सभी',
    'خود': 'खुद', 'اپنا': 'अपना', 'اپنی': 'अपनी', 'اپنے': 'अपने',
    'میرا': 'मेरा', 'میری': 'मेरी', 'میرے': 'मेरे',
    'تیرا': 'तेरा', 'تیری': 'तेरी', 'تیرے': 'तेरे',
    'اسکا': 'उसका', 'اسکی': 'उसकी', 'اسکے': 'उसके',
    'انکا': 'उनका', 'انکی': 'उनकी', 'انکے': 'उनके',
    'ہمارا': 'हमारा', 'ہماری': 'हमारी', 'ہمارے': 'हमारे',
    'تمہارا': 'तुम्हारा', 'تمہاری': 'तुम्हारी', 'تمہارے': 'तुम्हारे',

    # Verbs – To Be / Auxiliaries
    'ہے': 'है', 'ہیں': 'हैं', 'ہو': 'हो', 'ہوں': 'हूँ',
    'تھا': 'था', 'تھی': 'थी', 'تھے': 'थे',
    'ہوگا': 'होगा', 'ہوگی': 'होगी', 'ہوگے': 'होगे',
    'رہا': 'रहा', 'رہی': 'रही', 'رہے': 'रहे',
    'گیا': 'गया', 'گئی': 'गई', 'گئے': 'गए',

    # Common Verbs
    'کر': 'कर', 'کرو': 'करो', 'کرنا': 'करना', 'کرتا': 'करता',
    'کرتی': 'करती', 'کرتے': 'करते', 'کریں': 'करें', 'کیا': 'किया',
    'جاؤ': 'जाओ', 'جاتا': 'जाता', 'جانا': 'जाना', 'جاتی': 'जाती',
    'آؤ': 'आओ', 'آنا': 'आना', 'آیا': 'आया', 'آئی': 'आई',
    'دیکھو': 'देखो', 'دیکھا': 'देखा', 'دیکھنا': 'देखना',
    'سنو': 'सुनो', 'سنا': 'सुना', 'سننا': 'सुनना',
    'بولو': 'बोलो', 'بولا': 'बोला', 'بولنا': 'बोलना',
    'لینا': 'लेना', 'لیا': 'लिया', 'لی': 'ली', 'لے': 'ले',
    'دینا': 'देना', 'دیا': 'दिया', 'دی': 'दी', 'دے': 'दे',
    'مل': 'मिल', 'ملا': 'मिला', 'ملی': 'मिली',
    'سوچ': 'सोच', 'سوچا': 'सोचा', 'سوچنا': 'सोचना',
    'مان': 'मान', 'مانا': 'माना', 'ماننا': 'मानना',
    'سمجھ': 'समझ', 'سمجھا': 'समझा', 'سمجھنا': 'समझना',
    'کہا': 'कहा', 'کہنا': 'कहना', 'بتاؤ': 'बताओ', 'بتایا': 'बताया',
    'پوچھا': 'पूछा', 'پوچھنا': 'पूछना', 'جانتا': 'जानता', 'جانتے': 'जानते',
    'چاہتا': 'चाहता', 'چاہتی': 'चाहती', 'چاہتے': 'चाहते', 'چاہیے': 'चाहिए',
    'سکتا': 'सकता', 'سکتی': 'सकती', 'سکتے': 'सकते',
    'لگتا': 'लगता', 'لگتی': 'लगती', 'لگتے': 'लगते', 'لگا': 'लगा',
    'پڑا': 'पड़ा', 'پڑی': 'पड़ी', 'پڑے': 'पड़े',
    'رکھو': 'रखो', 'رکھا': 'रखा', 'رکھنا': 'रखना',
    'چلو': 'चलो', 'چلا': 'चला', 'چلنا': 'चलना',
    'بیٹھو': 'बैठो', 'بیٹھا': 'बैठा', 'اٹھو': 'उठो', 'اٹھا': 'उठा',
    'لگاؤ': 'लगाओ', 'لگایا': 'लगाया',

    # Question Words
    'کیا': 'क्या', 'کب': 'कब', 'کہاں': 'कहाँ', 'کیسے': 'कैसे',
    'کیوں': 'क्यों', 'کتنا': 'कितना', 'کتنی': 'कितनी', 'کدھر': 'किधर',

    # Adverbs / Modifiers
    'بہت': 'बहुत', 'ہمیشہ': 'हमेशा', 'کبھی': 'कभी',
    'ابھی': 'अभी', 'اب': 'अब', 'پہلے': 'पहले', 'بعد': 'बाद',
    'ہاں': 'हाँ', 'نہیں': 'नहीं', 'شاید': 'शायद', 'ضرور': 'ज़रूर',
    'اچھا': 'अच्छा', 'برا': 'बुरा', 'بڑا': 'बड़ा', 'چھوٹا': 'छोटा',
    'نیا': 'नया', 'پرانا': 'पुराना', 'خوش': 'खुश',
    'صحیح': 'सही', 'غلط': 'गलत', 'سچ': 'सच', 'جھوٹ': 'झूठ',

    # Time
    'آج': 'आज', 'کل': 'कल', 'دن': 'दिन', 'رات': 'रात',
    'صبح': 'सुबह', 'شام': 'शाम', 'وقت': 'वक्त', 'ابھی': 'अभी',

    # Nouns – Common
    'بات': 'बात', 'کام': 'काम', 'دل': 'दिल', 'نام': 'नाम',
    'گھر': 'घर', 'دنیا': 'दुनिया', 'زندگی': 'ज़िंदगी', 'لوگ': 'लोग',
    'آدمی': 'आदमी', 'عورت': 'औरत', 'بچہ': 'बच्चा', 'بچے': 'बच्चे',
    'دوست': 'दोस्त', 'یار': 'यार', 'بھائی': 'भाई', 'بہن': 'बहन',
    'راستہ': 'रास्ता', 'منزل': 'मंज़िल', 'خواب': 'ख्वाब',
    'محبت': 'मोहब्बत', 'پیار': 'प्यार', 'یاد': 'याद', 'بھول': 'भूल',
    'جواب': 'जवाब', 'سوال': 'सवाल', 'مطلب': 'मतलब', 'وجہ': 'वजह',
    'کوشش': 'कोशिश', 'کامیابی': 'कामयाबी', 'رنگ': 'रंग',
    'پانی': 'पानी', 'کھانا': 'खाना', 'چائے': 'चाय',
    'ساتھ': 'साथ', 'پاس': 'पास', 'دور': 'दूर',
    'ہر': 'हर', 'ہار': 'हार', 'جیت': 'जीत',

    # Numbers
    'ایک': 'एक', 'دو': 'दो', 'تین': 'तीन', 'چار': 'चार', 'پانچ': 'पाँच',
    'چھ': 'छह', 'سات': 'सात', 'آٹھ': 'आठ', 'نو': 'नौ', 'دس': 'दस',
    'سو': 'सौ', 'ہزار': 'हज़ार', 'لاکھ': 'लाख', 'کروڑ': 'करोड़',

    # Creator / Social Media Hindi
    'ویڈیو': 'वीडियो', 'فالوورز': 'फॉलोअर्स', 'ویوز': 'व्यूज',
    'لائیک': 'लाइक', 'شیئر': 'शेयर', 'کمنٹ': 'कमेंट', 'سبسکرائب': 'सब्सक्राइब',
}

# Character-level fallback: Urdu single chars → Devanagari
_URDU_ASPIRATE_COMPOUNDS = [
    ('بھ', 'भ'), ('پھ', 'फ'), ('تھ', 'थ'), ('ٹھ', 'ठ'), ('جھ', 'झ'),
    ('چھ', 'छ'), ('دھ', 'ध'), ('ڈھ', 'ढ'), ('کھ', 'ख'), ('گھ', 'घ'),
    ('ڑھ', 'ढ़'),
]
_URDU_CHAR_MAP = {
    'ا': 'अ', 'آ': 'आ', 'ب': 'ब', 'پ': 'प', 'ت': 'त', 'ٹ': 'ट',
    'ث': 'स', 'ج': 'ज', 'چ': 'च', 'ح': 'ह', 'خ': 'ख़', 'د': 'द',
    'ڈ': 'ड', 'ذ': 'ज़', 'ر': 'र', 'ڑ': 'ड़', 'ز': 'ज़', 'ژ': 'झ़',
    'س': 'स', 'ش': 'श', 'ص': 'स', 'ض': 'ज़', 'ط': 'त', 'ظ': 'ज़',
    'ع': 'अ', 'غ': 'ग़', 'ف': 'फ़', 'ق': 'क़', 'ک': 'क', 'گ': 'ग',
    'ل': 'ल', 'م': 'म', 'ن': 'न', 'ں': 'ं', 'و': 'व', 'ہ': 'ह',
    'ھ': 'ह', 'ء': '', 'ی': 'य', 'ے': 'े', 'ئ': 'ई', 'ۂ': 'ह',
    'ۃ': 'त', 'ؤ': 'ओ', 'أ': 'अ', 'إ': 'इ', 'ۓ': 'े',
    '\u064e': 'अ', '\u064f': 'उ', '\u0650': 'इ',  # Arabic diacritics
    '\u0651': '', '\u0652': '',  # shadda, sukun
}


def _transliterate_urdu_chars(word: str) -> str:
    """Character-level Urdu → Devanagari fallback for unknown words."""
    s = word
    # Replace aspirate compounds first (بھ → भ, etc.)
    for urdu_comp, dev_comp in _URDU_ASPIRATE_COMPOUNDS:
        s = s.replace(urdu_comp, dev_comp)
    out = []
    for ch in s:
        out.append(_URDU_CHAR_MAP.get(ch, ch))
    return ''.join(out)


def convert_urdu_to_hindi(word: str) -> str:
    """
    Converts a single Urdu-script word to Devanagari Hindi.
    Uses word-level dictionary first, then character-level transliteration.
    """
    if not is_urdu_arabic(word):
        return word  # Not Urdu, return as-is

    # Strip punctuation for lookup, preserve it for output
    punct_before = ''
    punct_after = ''
    core = word
    while core and not core[0].isalnum() and not ('\u0600' <= core[0] <= '\u06FF') and not ('\u0900' <= core[0] <= '\u097F'):
        punct_before += core[0]
        core = core[1:]
    while core and not core[-1].isalnum() and not ('\u0600' <= core[-1] <= '\u06FF') and not ('\u0900' <= core[-1] <= '\u097F'):
        punct_after = core[-1] + punct_after
        core = core[:-1]

    if not core:
        return word

    # Try exact word lookup
    if core in URDU_TO_HINDI_WORDS:
        return punct_before + URDU_TO_HINDI_WORDS[core] + punct_after

    # Fallback: character-level transliteration
    converted = _transliterate_urdu_chars(core)
    return punct_before + converted + punct_after


def convert_urdu_sentence_to_hindi(text: str) -> str:
    """Converts an entire Urdu sentence to Devanagari Hindi."""
    if not text or not is_urdu_arabic(text):
        return text
    words = text.split()
    return ' '.join(convert_urdu_to_hindi(w) for w in words)
