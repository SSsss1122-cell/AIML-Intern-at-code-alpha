# ---------- preprocess.py ----------
import re
import string

def clean_text(text: str) -> str:
    """Basic text cleaning: lowercasing, remove punctuation/numbers, reduce whitespace."""
    text = text.lower()
    # Remove URLs
    text = re.sub(r'http\S+|www.\S+', '', text)
    # Remove punctuation and numbers
    text = re.sub(f'[{re.escape(string.punctuation)}0-9]', ' ', text)
    # Collapse multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text