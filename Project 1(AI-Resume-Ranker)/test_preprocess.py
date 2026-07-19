from utils.preprocess import preprocess_text

sample_text = """
I have developed Machine Learning Projects using Python and TensorFlow.
"""

clean_text = preprocess_text(sample_text)

print("Original Text:")
print(sample_text)

print("\nCleaned Text:")
print(clean_text)