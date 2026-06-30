import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


df = pd.read_csv("Task 2\Titanic-Dataset.csv")

print(df.head())

print(df.info())

print(df.isnull().sum())

print(df.describe())

print(df.median(numeric_only=True))

df.hist(figsize=(12,8))

plt.suptitle("Histogram of Numerical Features")

plt.show()


plt.figure(figsize=(12,5))

plt.subplot(1,2,1)

sns.boxplot(y=df["Age"])

plt.title("Age")

plt.subplot(1,2,2)

sns.boxplot(y=df["Fare"])

plt.title("Fare")

plt.show()


numeric_df = df.select_dtypes(include="number")
plt.figure(figsize=(8,6))

sns.heatmap(numeric_df.corr(), annot=True, cmap="coolwarm")

plt.title("Correlation Matrix")

plt.savefig("Output Figure_2.png")

plt.show()


sns.pairplot(df[["Age","Fare","Pclass","Survived"]])

plt.savefig("Output Figure_3.png")

plt.show()


sns.countplot(x="Survived", data=df)

plt.title("Survival Count")

plt.show()

sns.countplot(x="Sex", hue="Survived", data=df)

plt.title("Survival by Gender")

plt.show()

sns.countplot(x="Pclass", hue="Survived", data=df)

plt.title("Survival by Passenger Class")

plt.show()


print("EDA Completed Successfully!")