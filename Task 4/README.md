# Task 4: Classification with Logistic Regression

# Objective

The objective of this task is to build a **binary classification model** using **Logistic Regression** to classify breast cancer tumors as **Malignant (M)** or **Benign (B)**. The model is trained, tested, and evaluated using various classification metrics and visualizations.

# Dataset

* **Dataset Name:** Breast Cancer Wisconsin Dataset
* **Source:** Kaggle
* **Link:** https://www.kaggle.com/datasets/uciml/breast-cancer-wisconsin-data

# Tools and Libraries Used

* Python
* Pandas
* Matplotlib
* Seaborn
* Scikit-learn

# Steps Performed

1. Imported the required Python libraries.
2. Loaded the Breast Cancer Wisconsin dataset.
3. Removed unnecessary columns (`id` and `Unnamed: 32`).
4. Converted the target variable (`diagnosis`) into numerical values:

   * **Malignant (M) → 1**
   * **Benign (B) → 0**
5. Selected input features and target variable.
6. Split the dataset into training and testing sets.
7. Standardized numerical features using **StandardScaler**.
8. Trained a **Logistic Regression** model using Scikit-learn.
9. Predicted the class labels for the test dataset.
10. Evaluated the model using:

    * Confusion Matrix
    * Precision
    * Recall
    * ROC-AUC Score
    * Classification Report
11. Visualized:

    * Confusion Matrix
    * ROC Curve
    * Sigmoid Function

# Output Files

* **Output Figure_1.png** – Confusion Matrix
* **Output Figure_2.png** – ROC Curve
* **Output Figure_3.png** – Sigmoid Function

# Model Evaluation Metrics

The Logistic Regression model was evaluated using the following metrics:

* **Confusion Matrix:** Displays the number of correct and incorrect predictions.
* **Precision:** Measures the accuracy of positive predictions.
* **Recall:** Measures the model's ability to identify actual positive cases.
* **ROC-AUC Score:** Evaluates the model's ability to distinguish between the two classes.
* **Classification Report:** Provides Precision, Recall, F1-Score, and Support for each class.

# Key Observations

* The dataset represents a binary classification problem with two classes: **Malignant** and **Benign**.
* Standardizing the features improves the performance of the Logistic Regression model.
* The confusion matrix clearly shows correctly and incorrectly classified samples.
* The ROC Curve demonstrates the classifier's ability to distinguish between the two classes.
* A higher ROC-AUC score indicates better classification performance.
* The sigmoid function converts linear outputs into probabilities ranging between **0** and **1**, enabling binary classification.

# Learning Outcomes

Through this task, I learned:

* The fundamentals of Logistic Regression.
* The difference between regression and classification problems.
* How to preprocess data for binary classification.
* How to standardize numerical features.
* How to train and evaluate a Logistic Regression model.
* How to interpret the Confusion Matrix, Precision, Recall, and ROC-AUC Score.
* The importance of the sigmoid function in Logistic Regression.

# Conclusion

Logistic Regression is one of the most widely used supervised machine learning algorithms for binary classification. By implementing this model on the Breast Cancer Wisconsin dataset, I learned how to preprocess data, train a classifier, evaluate its performance using multiple metrics, and interpret the results through visualizations. This task strengthened my understanding of classification techniques and model evaluation in machine learning.

