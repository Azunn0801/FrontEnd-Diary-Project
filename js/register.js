console.log("register.js loaded");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let users = JSON.parse(localStorage.getItem("users"));
if (!users) {
  fetch('../database/users.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Cannot load User Data');
      }
      return response.json();
    })
    .then(data => {
      users = Array.isArray(data) ? data : [];
      localStorage.setItem('users', JSON.stringify(users));
    })
    .catch(error => {
      toastElement.querySelector('.toast-body').innerHTML = 'Error loading user data: ' + error.message;
      toast.show();
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const toastElement = document.getElementById('validationToast');
  const toast = new bootstrap.Toast(toastElement);

  const firstNameInput = document.getElementById('first-name');
  const lastNameInput = document.getElementById('last-name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPwdInput = document.getElementById('confirm-password');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let errors = [];

    if (!firstNameInput.value.trim()) errors.push("First name is required");
    if (!lastNameInput.value.trim()) errors.push("Last name is required");

    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      errors.push("Email is required");
    } else if (!emailRegex.test(emailVal)) {
      errors.push("Email is invalid");
    }

    const pwd = passwordInput.value;
    if (!pwd) {
      errors.push("Password is required");
    } else if (pwd.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (!confirmPwdInput.value) {
      errors.push("Confirm password is required");
    } else if (confirmPwdInput.value !== pwd) {
      errors.push("Passwords do not match");
    }

    if (errors.length) {
      toastElement.querySelector('.toast-body').innerHTML = errors.join("<br>");
      toast.show();
      return;
    }

    console.log({
      first: firstNameInput.value,
      last: lastNameInput.value,
      mail: emailVal,
      pass: pwd,
      confirm: confirmPwdInput.value
    });

    const user = {
      id: users.length + 1,
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailVal,
      status: "Active",
      password: pwd,
      avatar: '../assets/images/user.png'
    };
    console.log("Thêm user:", user);

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("Users hiện tại:", users);

    window.location.href = "../pages/login.html";
  });
});
