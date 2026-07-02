import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score

# Load Dataset
df = pd.read_csv("Task 3\Housing.csv")

# Display Dataset
print(df.head())

# Convert Categorical Columns
df = pd.get_dummies(df, drop_first=True)

# Features and Target
X = df.drop("price", axis=1)
y = df["price"]

# Split Dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# Train Model
model = LinearRegression()

model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Evaluation
print("Mean Absolute Error:", mean_absolute_error(y_test, y_pred))
print("Mean Squared Error:", mean_squared_error(y_test, y_pred))
print("R2 Score:", r2_score(y_test, y_pred))

# Actual vs Predicted Plot
plt.figure(figsize=(8,6))

plt.scatter(y_test, y_pred)

plt.xlabel("Actual Price")

plt.ylabel("Predicted Price")

plt.title("Actual vs Predicted House Prices")

plt.savefig("Output Figure_1.png")

plt.show()

# Regression Coefficients
coef = pd.DataFrame({
    "Feature": X.columns,
    "Coefficient": model.coef_
})

coef = coef.sort_values(by="Coefficient", ascending=False)

print(coef)

coef.head(10).plot(
    x="Feature",
    y="Coefficient",
    kind="bar",
    figsize=(10,5)
)

plt.title("Top Feature Coefficients")

plt.tight_layout()

plt.savefig("Output Figure_2.png")

plt.show()

print("Task 3 Completed Successfully!")