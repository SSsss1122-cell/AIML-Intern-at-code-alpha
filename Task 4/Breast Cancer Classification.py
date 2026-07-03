
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    confusion_matrix,
    ConfusionMatrixDisplay,
    classification_report,
    precision_score,
    recall_score,
    roc_auc_score,
    RocCurveDisplay
)

# Load Dataset

df = pd.read_csv("Task 4\data.csv")

print(df.head())

# Remove unnecessary columns
df.drop(columns=["id", "Unnamed: 32"], inplace=True)

# Convert diagnosis
df["diagnosis"] = df["diagnosis"].map({
    "M":1,
    "B":0
})


# Features and Target

X = df.drop("diagnosis", axis=1)
y = df["diagnosis"]


# Train Test Split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Standardization

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)

X_test = scaler.transform(X_test)


# Logistic Regression Model

model = LogisticRegression(max_iter=1000)

model.fit(X_train, y_train)


# Predictions

y_pred = model.predict(X_test)

# Evaluation

print(classification_report(y_test, y_pred))

print("Precision :", precision_score(y_test, y_pred))

print("Recall :", recall_score(y_test, y_pred))

print("ROC AUC :", roc_auc_score(y_test, y_pred))


# Confusion Matrix

cm = confusion_matrix(y_test, y_pred)

disp = ConfusionMatrixDisplay(cm)

disp.plot()

plt.savefig("Output Figure_1.png")

plt.show()


# ROC Curve

RocCurveDisplay.from_estimator(
    model,
    X_test,
    y_test
)

plt.savefig("Output Figure_2.png")

plt.show()


# Sigmoid Curve

import numpy as np

x = np.linspace(-10,10,200)

y = 1/(1+np.exp(-x))

plt.plot(x,y)

plt.title("Sigmoid Function")

plt.xlabel("x")

plt.ylabel("Probability")

plt.grid()

plt.savefig("Output Figure_3.png")

plt.show()

print("Task 4 Completed Successfully!")