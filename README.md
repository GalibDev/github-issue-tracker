# GitHub Issues Tracker

This project is a simple **GitHub Issues Tracker** built using **HTML, CSS, and Vanilla JavaScript**.
The application allows users to log in, view issues, search issues, filter issues by status, and see detailed information in a modal.

---

## 🔗 Live Project

**🌐 Live Site:**
https://galibdev.github.io/github-issue-tracker/

**📂 GitHub Repository:**
https://github.com/GalibDev/github-issue-tracker

---

## 🚀 Features

* Login page with demo credentials
* Fetch issues from API
* Display issues in card layout
* Filter issues by **All / Open / Closed**
* Search issues by keyword
* Loading spinner while fetching data
* Issue details modal on card click
* Responsive design for mobile devices

---

## 🔑 Demo Credentials

Username: **admin**
Password: **admin123**

---

## 🛠 Technologies Used

* HTML
* CSS
* JavaScript (Vanilla)

---

# Questions & Answers

## 1️⃣ What is the difference between var, let, and const?

`var`, `let`, and `const` are used to declare variables in JavaScript.

**var**

* Function scoped
* Can be re-declared
* Can be updated

Example:

```javascript
var x = 10;
var x = 20;
```

**let**

* Block scoped
* Cannot be re-declared in the same scope
* Can be updated

Example:

```javascript
let x = 10;
x = 20;
```

**const**

* Block scoped
* Cannot be re-declared
* Cannot be updated

Example:

```javascript
const x = 10;
```

---

## 2️⃣ What is the spread operator (...)?

The spread operator (`...`) is used to expand elements of an array or object.

Example:

```javascript
const arr1 = [1,2,3];
const arr2 = [...arr1,4,5];
```

Example with object:

```javascript
const obj1 = {name:"John"};
const obj2 = {...obj1, age:25};
```

---

## 3️⃣ What is the difference between map(), filter(), and forEach()?

These methods are used to loop through arrays.

**map()**

* Creates a new array
* Transforms each element

Example:

```javascript
const numbers = [1,2,3];
const doubled = numbers.map(n => n*2);
```

**filter()**

* Creates a new array
* Returns elements that match a condition

Example:

```javascript
const numbers = [1,2,3,4];
const even = numbers.filter(n => n%2 === 0);
```

**forEach()**

* Loops through array
* Does not return a new array

Example:

```javascript
numbers.forEach(n => console.log(n));
```

---

## 4️⃣ What is an arrow function?

Arrow functions are a shorter way to write functions in JavaScript.

Example:

```javascript
const add = (a,b) => {
  return a + b;
}
```

Short version:

```javascript
const add = (a,b) => a + b;
```

Arrow functions make code cleaner and shorter.

---

## 5️⃣ What are template literals?

Template literals allow us to write strings with embedded variables using backticks.

Example:

```javascript
const name = "John";
const message = `Hello ${name}`;
```

Output:

```
Hello John
```

Template literals are useful for creating dynamic strings.
