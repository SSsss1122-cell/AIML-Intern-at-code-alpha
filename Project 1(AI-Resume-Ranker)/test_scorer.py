from utils.scorer import calculate_score

job_description = """
Python Machine Learning Flask SQL
"""

resume = """
Python Flask SQL HTML CSS Machine Learning
"""

score = calculate_score(job_description, resume)

print("Resume Match Score:")
print(f"{score}%")