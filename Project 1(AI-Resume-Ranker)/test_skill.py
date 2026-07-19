from utils.skill_extractor import extract_skills, compare_skills

resume_text = """
Python Java GitHub FastAPI Machine Learning
"""

job_description = """
Software Engineer

HTML
CSS
Java
Python
JS
"""

resume_skills = extract_skills(resume_text)
job_skills = extract_skills(job_description)

matched, missing = compare_skills(job_skills, resume_skills)

print("Resume Skills :", resume_skills)
print("Job Skills :", job_skills)
print("Matched :", matched)
print("Missing :", missing)