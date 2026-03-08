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

const issuesContainer = document.getElementById("issuesContainer");
const loader = document.getElementById("loader");

let allIssues = [];

async function loadIssues() {

  try {

    loader.classList.remove("hidden");

    const response = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues"
    );

    const data = await response.json();

    if (Array.isArray(data)) {
      allIssues = data;
    } else if (Array.isArray(data.data)) {
      allIssues = data.data;
    }

    console.log("All Issues:", allIssues);

  } catch (error) {

    console.error("Error loading issues", error);

  } finally {

    loader.classList.add("hidden");

  }

}