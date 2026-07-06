import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score

from sklearn.tree import DecisionTreeClassifier
from sklearn.tree import plot_tree

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import accuracy_score


# Load Dataset

df = pd.read_csv("Task 5\heart.csv")

print(df.head())


# Features & Target

X = df.drop("target", axis=1)

y = df["target"]


# Train-Test Split


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Decision Tree

tree = DecisionTreeClassifier(
    max_depth=4,
    random_state=42
)

tree.fit(X_train, y_train)

tree_pred = tree.predict(X_test)

tree_accuracy = accuracy_score(
    y_test,
    tree_pred
)

print("Decision Tree Accuracy:", tree_accuracy)


# Visualize Tree

plt.figure(figsize=(18,10))

plot_tree(
    tree,
    feature_names=X.columns,
    class_names=["No Disease","Disease"],
    filled=True
)

plt.savefig("Output Figure_1.png")

plt.show()

# Random Forest

forest = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

forest.fit(X_train, y_train)

forest_pred = forest.predict(X_test)

forest_accuracy = accuracy_score(
    y_test,
    forest_pred
)

print("Random Forest Accuracy:", forest_accuracy)


# Feature Importance

importance = pd.Series(
    forest.feature_importances_,
    index=X.columns
)

importance.sort_values().plot(
    kind="barh",
    figsize=(10,6)
)

plt.title("Feature Importance")

plt.tight_layout()

plt.savefig("Output Figure_2.png")

plt.show()


# Cross Validation

scores = cross_val_score(
    forest,
    X,
    y,
    cv=5
)

print("Cross Validation Scores")

print(scores)

print("Average Accuracy:", scores.mean())


# Accuracy Comparison

plt.bar(
    ["Decision Tree","Random Forest"],
    [tree_accuracy, forest_accuracy]
)

plt.ylabel("Accuracy")

plt.title("Model Comparison")

plt.savefig("Output Figure_3.png")

plt.show()

print("Task 5 Completed Successfully!")