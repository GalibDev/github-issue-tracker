const loginForm = document.getElementById("loginForm");
const loginPage = document.getElementById("loginPage");
const mainPage = document.getElementById("mainPage");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", function (e) {

  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "admin123") {

    errorMsg.textContent = "";

    loginPage.classList.add("hidden");
    mainPage.classList.remove("hidden");

  } else {

    errorMsg.textContent = "Invalid username or password";

  }

});