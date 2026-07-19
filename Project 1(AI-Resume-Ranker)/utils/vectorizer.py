from sklearn.feature_extraction.text import TfidfVectorizer


def vectorize_text(job_description, resume_text):
    """
    Convert Job Description and Resume into TF-IDF vectors.
    """

    vectorizer = TfidfVectorizer()

    vectors = vectorizer.fit_transform([
        job_description,
        resume_text
    ])

    return vectors