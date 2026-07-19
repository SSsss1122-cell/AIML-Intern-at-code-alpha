# ---------- skill_extractor.py ----------
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
import re

# Predefined comprehensive skill list (can be expanded or loaded from DB)
DEFAULT_SKILLS = {
    'python', 'java', 'sql', 'machine learning', 'deep learning', 'tensorflow',
    'pytorch', 'nlp', 'flask', 'django', 'react', 'angular', 'vue', 'node.js',
    'javascript', 'typescript', 'html', 'css', 'docker', 'kubernetes', 'aws',
    'azure', 'gcp', 'ci/cd', 'git', 'rest api', 'graphql', 'mongodb',
    'postgresql', 'redis', 'agile', 'scrum', 'leadership', 'communication',
    'problem solving', 'critical thinking', 'project management'
}

class SkillExtractor:
    def __init__(self, skills_set: set = None):
        self.skills = skills_set or DEFAULT_SKILLS

    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text using simple matching against a known list."""
        found = []
        text_lower = text.lower()
        for skill in self.skills:
            # Use word boundaries for single-word skills, substring for multi-word
            if ' ' in skill:
                pattern = re.escape(skill)
            else:
                pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found.append(skill)
        return found

    def extract_keywords(self, text: str, top_n: int = 25) -> List[str]:
        """Extract important keywords using TF-IDF (top unigrams and bigrams)."""
        if not text.strip():
            return []
        vectorizer = TfidfVectorizer(stop_words='english', max_features=5000, ngram_range=(1, 2))
        try:
            tfidf_matrix = vectorizer.fit_transform([text])
            feature_names = vectorizer.get_feature_names_out()
            # Sum TF-IDF scores across the single document (it's a 1xN matrix)
            scores = tfidf_matrix.toarray()[0]
            # Get indices of top_n scores
            top_indices = scores.argsort()[-top_n:][::-1]
            keywords = [feature_names[i] for i in top_indices]
            return keywords
        except ValueError:
            return []