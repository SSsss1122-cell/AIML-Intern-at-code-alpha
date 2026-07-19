const button = document.querySelector(".start-btn");

button.addEventListener("mousemove", () => {

    button.style.boxShadow = "0 0 35px #3B82F6";

});

button.addEventListener("mouseleave", () => {

    button.style.boxShadow = "none";

});