Task 2: Exploratory Data Analysis (EDA)


Objective

The objective of this task is to perform **Exploratory Data Analysis (EDA)** on the Titanic dataset to understand the data through descriptive statistics and visualizations. EDA helps identify patterns, relationships, trends, missing values, and outliers before building machine learning models.

Dataset

* **Dataset Name:** Titanic Dataset
* **Source:** Kaggle
* **Link:** https://www.kaggle.com/datasets/yasserh/titanic-dataset

Tools and Libraries Used

* Python
* Pandas
* Matplotlib
* Seaborn

Steps Performed

1. Imported the required Python libraries.
2. Loaded the Titanic dataset using Pandas.
3. Explored the dataset using:

   * `head()`
   * `info()`
   * `describe()`
   * `isnull().sum()`
4. Generated summary statistics such as:

   * Mean
   * Median
   * Standard Deviation
   * Minimum and Maximum values
5. Created histograms to understand the distribution of numerical features.
6. Visualized outliers using boxplots.
7. Generated a correlation matrix (heatmap) to identify relationships between numerical features.
8. Created a pairplot to visualize relationships among important numerical variables.
9. Used count plots to analyze:

   * Survival count
   * Survival by gender
   * Survival by passenger class

Output Files

* Output Figure_1.png – Histograms and Boxplots
* Output Figure_2.png – Correlation Matrix (Heatmap)
* Output Figure_3.png – Pairplot

Key Observations

* The **Age** column contains missing values.
* The **Fare** feature is right-skewed and contains several outliers.
* Female passengers had a higher survival rate than male passengers.
* First-class passengers had a better chance of survival compared to third-class passengers.
* Passenger class and fare show a noticeable relationship with survival.
* Correlation analysis helps identify relationships among numerical features.

Learning Outcomes

Through this task, I learned:

* How to perform Exploratory Data Analysis (EDA).
* How to generate descriptive statistics.
* How to visualize data using histograms, boxplots, heatmaps, and pairplots.
* How to identify missing values, outliers, and feature relationships.
* How to draw meaningful insights from visualizations before building machine learning models.

Conclusion

Exploratory Data Analysis is an essential step in the machine learning workflow. It provides a deeper understanding of the dataset, helps identify data quality issues, and supports informed feature selection and preprocessing. The visualizations and statistical summaries obtained from the Titanic dataset provide valuable insights that can improve the performance and reliability of machine learning models.


