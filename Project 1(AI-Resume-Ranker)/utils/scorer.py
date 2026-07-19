# ---------- scorer.py ----------
from typing import List
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_ats_score(resume_skills: List[str], job_keywords: List[str], resume_text: str) -> int:
    """
    Compute an ATS compatibility score based on:
    - Keyword match ratio
    - Resume length (> 300 chars)
    - Presence of standard sections (education, experience)
    """
    # Keyword match
    if not job_keywords:
        keyword_score = 0
    else:
        matches = set(resume_skills) & set(job_keywords)
        keyword_score = (len(matches) / len(job_keywords)) * 60  # up to 60 points

    # Formatting checks
    format_score = 0
    # Length check (a good resume is usually > 500 characters)
    if len(resume_text) > 500:
        format_score += 10
    # Section headers (simple checks)
    if re.search(r'\b(education|academic)\b', resume_text, re.IGNORECASE):
        format_score += 10
    if re.search(r'\b(experience|work|employment)\b', resume_text, re.IGNORECASE):
        format_score += 10
    if re.search(r'\b(skills|technologies)\b', resume_text, re.IGNORECASE):
        format_score += 10

    total = min(100, int(keyword_score + format_score))
    return total

def calculate_similarity(resume_text: str, job_text: str) -> float:
    """Cosine similarity between resume and job description using TF-IDF vectors."""
    if not resume_text.strip() or not job_text.strip():
        return 0.0
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        vectors = vectorizer.fit_transform([resume_text, job_text])
        similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
        return round(similarity * 100, 1)  # as percentage
    except:
        return 0.0

def score_experience(resume_text: str) -> int:
    """Heuristic experience score based on presence of quantified achievements, action verbs, etc."""
    score = 50  # base
    # Quantified achievements (e.g., increased by X%, managed Y people)
    if re.search(r'\b(\d+%|\d+ people|\d+ million|\d+ thousand)\b', resume_text, re.IGNORECASE):
        score += 30
    # Action verbs (simplified)
    action_verbs = ['managed', 'led', 'developed', 'implemented', 'designed', 'created', 'improved']
    for verb in action_verbs:
        if re.search(r'\b' + verb + r'\b', resume_text, re.IGNORECASE):
            score += 2
    return min(100, score)

def score_education(resume_text: str) -> int:
    """Education score based on degree presence and GPA."""
    score = 70
    if re.search(r'\b(bachelor|master|phd|b\.tech|m\.tech|b\.s\.|m\.s\.|ph\.d\.)\b', resume_text, re.IGNORECASE):
        score += 20
    if re.search(r'\bgpa\b.*\d\.\d', resume_text, re.IGNORECASE):
        score += 10
    return min(100, score)