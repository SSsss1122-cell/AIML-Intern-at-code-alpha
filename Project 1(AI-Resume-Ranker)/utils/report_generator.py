# ---------- report_generator.py ----------
from typing import List, Dict, Any
import random

def generate_report(
    resume_text: str,
    job_text: str,
    resume_skills: List[str],
    job_keywords: List[str],
    ats_score: int,
    similarity: float,
    experience_score: int,
    education_score: int,
    matched_skills: List[str],
    missing_skills: List[str]
) -> Dict[str, Any]:
    """Assemble all analysis results into a dictionary for the template."""

    # Strengths and weaknesses (rule-based)
    strengths = []
    weaknesses = []

    if len(resume_text) > 500:
        strengths.append("Detailed resume content")
    else:
        weaknesses.append("Resume is too short; add more details")

    if re.search(r'\b\d+%|\bincreased\b|\breduced\b', resume_text, re.IGNORECASE):
        strengths.append("Quantified achievements present")
    else:
        weaknesses.append("Missing measurable achievements (numbers, percentages)")

    if re.search(r'\b(led|managed|coordinated|supervised)\b', resume_text, re.IGNORECASE):
        strengths.append("Strong action verbs used")
    else:
        weaknesses.append("Use more impactful action verbs")

    if matched_skills:
        strengths.append(f"Key skills matched: {', '.join(matched_skills[:5])}")
    if missing_skills:
        weaknesses.append(f"Missing critical keywords: {', '.join(missing_skills[:5])}")

    # Suggestions (static + dynamic)
    suggestions = []
    if ats_score < 80:
        suggestions.append("Improve keyword match by tailoring your resume to the job description.")
    if 'aws' in missing_skills or 'azure' in missing_skills:
        suggestions.append("Consider adding cloud platform certifications (AWS/Azure).")
    if not re.search(r'\b(project|portfolio)\b', resume_text, re.IGNORECASE):
        suggestions.append("Add a dedicated 'Projects' section to showcase practical work.")
    suggestions.append("Ensure your resume uses standard section titles (Experience, Education, Skills).")

    # Career roles (sample based on skills)
    career_roles = ['Software Engineer']
    if 'machine learning' in resume_skills or 'tensorflow' in resume_skills:
        career_roles.append('AI Engineer')
    if 'sql' in resume_skills:
        career_roles.append('Data Engineer')
    if 'react' in resume_skills:
        career_roles.append('Frontend Developer')

    # Salary range (fake estimate)
    salary_range = {
        'entry': 90000,
        'mid': 120000,
        'senior': 150000
    }

    # Roadmap (generic)
    roadmap = [
        "Update resume with missing keywords and quantified achievements.",
        "Earn a cloud certification (AWS Solutions Architect recommended).",
        "Build a portfolio project showcasing Docker & CI/CD.",
        "Practice system design and behavioral interviews.",
        "Network on LinkedIn with recruiters in target companies."
    ]

    report = {
        'ats_score': ats_score,
        'job_match': similarity,
        'skills_found': resume_skills,
        'missing_skills': missing_skills,
        'matched_keywords': matched_skills,
        'missing_keywords': missing_skills,
        'strengths': strengths,
        'weaknesses': weaknesses,
        'suggestions': suggestions,
        'experience_score': experience_score,
        'education_score': education_score,
        'project_score': 78,  # could be calculated
        'certifications': [],  # detect if needed
        'career_roles': career_roles,
        'salary_range': salary_range,
        'roadmap': roadmap
    }
    return report

import re  # needed for report_generator