# Task 3: Linear Regression

# Objective

The objective of this task is to implement **Simple and Multiple Linear Regression** using a House Price Prediction dataset. The model is trained to predict house prices based on different input features, and its performance is evaluated using standard regression metrics.



# Dataset

* **Dataset Name:** House Price Prediction Dataset (Housing.csv)
* **Source:** Kaggle
* **Link:** https://www.kaggle.com/datasets/harishkumardatalab/housing-price-prediction


# Tools and Libraries Used

* Python
* Pandas
* Matplotlib
* Scikit-learn



# Steps Performed

1. Imported the required Python libraries.
2. Loaded the House Price Prediction dataset.
3. Explored the dataset and identified input features and target variable.
4. Converted categorical features into numerical values using one-hot encoding.
5. Split the dataset into training and testing sets.
6. Trained a Linear Regression model using Scikit-learn.
7. Predicted house prices on the test dataset.
8. Evaluated the model using:

   * Mean Absolute Error (MAE)
   * Mean Squared Error (MSE)
   * R² Score
9. Visualized the relationship between actual and predicted house prices.
10. Analyzed the regression coefficients to understand the influence of different features.


# Output Files

* **Output Figure_1.png** – Actual vs Predicted House Prices
* **Output Figure_2.png** – Top Feature Coefficients

---

# Model Evaluation Metrics

The following metrics were used to evaluate the regression model:

* **Mean Absolute Error (MAE):** Measures the average absolute difference between actual and predicted values.
* **Mean Squared Error (MSE):** Measures the average squared prediction error.
* **R² Score:** Indicates how well the regression model explains the variation in house prices.



# Key Observations

* The Linear Regression model successfully predicts house prices based on the available features.
* Lower MAE and MSE values indicate better prediction accuracy.
* An R² Score closer to **1** indicates a better-fitting model.
* Regression coefficients help identify which features have the greatest impact on house prices.
* Visualization of actual versus predicted values provides a clear understanding of the model's performance.



# Learning Outcomes

Through this task, I learned:

* The fundamentals of Linear Regression.
* The difference between training and testing datasets.
* How to build a regression model using Scikit-learn.
* How to evaluate regression models using MAE, MSE, and R² Score.
* How to interpret regression coefficients.
* How to visualize prediction results and analyze model performance.



# Conclusion

Linear Regression is one of the most fundamental supervised machine learning algorithms used for predicting continuous values. By training and evaluating the model on a House Price Prediction dataset, I gained practical experience in regression modeling, model evaluation, and interpretation of results. This task strengthened my understanding of predictive analytics and the complete machine learning workflow.


