

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import ConfusionMatrixDisplay


df = pd.read_csv("Iris.csv")

print(df.head())


df.drop("Id", axis=1, inplace=True)

X = df.drop("Species", axis=1)
y = df["Species"]



scaler = StandardScaler()

X = scaler.fit_transform(X)



X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)



accuracy = []

for k in range(1,21):

    model = KNeighborsClassifier(n_neighbors=k)

    model.fit(X_train, y_train)

    pred = model.predict(X_test)

    accuracy.append(
        accuracy_score(y_test,pred)
    )



best_k = accuracy.index(max(accuracy))+1

print("Best K =", best_k)



model = KNeighborsClassifier(
    n_neighbors=best_k
)

model.fit(X_train,y_train)

y_pred = model.predict(X_test)

print("Accuracy =",accuracy_score(y_test,y_pred))



cm = confusion_matrix(y_test,y_pred)

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=model.classes_
)

disp.plot()

plt.savefig("Output Figure_1.png")

plt.show()



plt.figure(figsize=(8,5))

plt.plot(
    range(1,21),
    accuracy,
    marker="o"
)

plt.xlabel("K Value")

plt.ylabel("Accuracy")

plt.title("Accuracy vs K")

plt.grid()

plt.savefig("Output Figure_2.png")

plt.show()



sns.pairplot(
    df,
    hue="Species"
)

plt.savefig("Output Figure_3.png")

plt.show()

print("Task 6 Completed Successfully!")