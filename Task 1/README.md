Task 1: Data Cleaning & Preprocessing

Objective

The objective of this task is to clean and preprocess the Titanic dataset to make it suitable for machine learning. This involves handling missing values, encoding categorical data, scaling numerical features, and detecting and removing outliers.

Dataset

* **Dataset Name:** Titanic Dataset
* **Source:** Kaggle
* **Link:** https://www.kaggle.com/datasets/yasserh/titanic-dataset

Tools and Libraries Used

* Python
* Pandas
* NumPy
* Matplotlib
* Seaborn
* Scikit-learn

Performed

1. Imported the required Python libraries.
2. Loaded the Titanic dataset using Pandas.
3. Explored the dataset using:

   * `head()`
   * `info()`
   * `isnull().sum()`
4. Handled missing values:

   * Filled missing values in the **Age** column using the median.
   * Filled missing values in the **Embarked** column using the mode.
   * Dropped the **Cabin** column due to a large number of missing values.
5. Converted categorical features into numerical values using **Label Encoding**.
6. Standardized numerical features (**Age** and **Fare**) using **StandardScaler**.
7. Visualized outliers using boxplots.
8. Removed outliers from the **Fare** column using the **Interquartile Range (IQR)** method.
9. Saved the cleaned dataset as **Cleaned_Titanic.csv**.

Output Files

* Titanic_Dataset.csv – Preprocessed dataset ready for machine learning.
* Output Figure_1.png – Boxplots showing outliers before preprocessing.

Key Observations

* The **Age** column contained missing values, which were replaced with the median.
* The **Embarked** column had a small number of missing values, which were filled with the most frequent value.
* The **Cabin** column contained a large number of missing values and was removed.
* The **Sex** and **Embarked** columns were successfully converted into numerical values.
* The **Age** and **Fare** features were standardized for improved model performance.
* Outliers were detected in the **Fare** column and removed using the IQR method.

Learning Outcomes

Through this task, I learned:

* How to inspect and understand a raw dataset.
* How to identify and handle missing values.
* How to encode categorical features into numerical values.
* How to standardize numerical features for machine learning.
* How to detect and remove outliers using boxplots and the IQR method.
* How proper data preprocessing improves the quality of machine learning datasets.

Conclusion

Data cleaning and preprocessing are essential steps in any machine learning workflow. By handling missing values, encoding categorical variables, scaling numerical features, and removing outliers, the dataset becomes more consistent and suitable for model training. These preprocessing techniques improve data quality and contribute to more reliable machine learning results.


