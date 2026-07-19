from utils.vectorizer import vectorize_text

job_description = """
Python Machine Learning Flask SQL
"""

resume = """
Python Flask SQL HTML CSS Machine Learning
"""

vectors = vectorize_text(job_description, resume)

print("Shape of TF-IDF Matrix:")
print(vectors.shape)

print("\nTF-IDF Matrix:")
print(vectors.toarray())