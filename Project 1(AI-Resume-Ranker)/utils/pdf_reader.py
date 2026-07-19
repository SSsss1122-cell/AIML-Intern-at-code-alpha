# ---------- pdf_reader.py ----------
import fitz  # PyMuPDF

def extract_text_from_pdf(filepath: str) -> str:
    """Extract all text from a PDF file using PyMuPDF."""
    doc = fitz.open(filepath)
    full_text = []
    for page in doc:
        full_text.append(page.get_text())
    doc.close()
    return "\n".join(full_text)