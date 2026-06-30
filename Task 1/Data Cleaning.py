# -------------------------------
# CodeAlpha Task 1
# Data Cleaning & Preprocessing
# -------------------------------

# Import Libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler

# -------------------------------
# Load Dataset
# -------------------------------

df = pd.read_csv("Titanic-Dataset.csv")

# -------------------------------
# Explore Dataset
# -------------------------------

print("First 5 Rows")
print(df.head())

print("\nDataset Information")
print(df.info())

print("\nMissing Values")
print(df.isnull().sum())

# -------------------------------
# Handle Missing Values
# -------------------------------

# Fill Age with Median
df["Age"].fillna(df["Age"].median(), inplace=True)

# Fill Embarked with Mode
df["Embarked"].fillna(df["Embarked"].mode()[0], inplace=True)

# Drop Cabin column because it has too many missing values
df.drop("Cabin", axis=1, inplace=True)

# Check Again
print("\nMissing Values After Cleaning")
print(df.isnull().sum())

# -------------------------------
# Encode Categorical Columns
# -------------------------------

encoder = LabelEncoder()

df["Sex"] = encoder.fit_transform(df["Sex"])
df["Embarked"] = encoder.fit_transform(df["Embarked"])

# -------------------------------
# Feature Scaling
# -------------------------------

scaler = StandardScaler()

columns = ["Age", "Fare"]

df[columns] = scaler.fit_transform(df[columns])

# -------------------------------
# Boxplots Before Removing Outliers
# -------------------------------

plt.figure(figsize=(10,4))

plt.subplot(1,2,1)
sns.boxplot(y=df["Age"])
plt.title("Age")

plt.subplot(1,2,2)
sns.boxplot(y=df["Fare"])
plt.title("Fare")

plt.tight_layout()
plt.show()

# -------------------------------
# Remove Outliers (IQR Method)
# -------------------------------

Q1 = df["Fare"].quantile(0.25)
Q3 = df["Fare"].quantile(0.75)

IQR = Q3 - Q1

lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR

df = df[(df["Fare"] >= lower) & (df["Fare"] <= upper)]

# -------------------------------
# Final Dataset
# -------------------------------

print("\nFinal Shape:", df.shape)

print("\nFirst 5 Rows After Preprocessing")
print(df.head())

# -------------------------------
# Save Cleaned Dataset
# -------------------------------

df.to_csv("Cleaned_Titanic.csv", index=False)

print("\nCleaned dataset saved successfully!")