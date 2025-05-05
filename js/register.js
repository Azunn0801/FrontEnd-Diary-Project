console.log("register.js loaded ✅");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initUsers = [
  { id: 1, firstname: "Lê", lastname: "Minh Thu", email: "minhthu@gmail.com", password: "123456" },
  { id: 2, firstname: "Vũ", lastname: "Hồng Vân", email: "hongvan@yahoo.com", password: "abc123" }
];

let users = JSON.parse(localStorage.getItem("users"));
if (!users) {
  users = initUsers;
  localStorage.setItem("users", JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', () => {
  const form         = document.querySelector('form');
  const toastElement = document.getElementById('validationToast');
  const toast        = new bootstrap.Toast(toastElement);

  const firstNameInput  = document.getElementById('first-name');
  const lastNameInput   = document.getElementById('last-name');
  const emailInput      = document.getElementById('email');
  const passwordInput   = document.getElementById('password');
  const confirmPwdInput = document.getElementById('confirm-password');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let errors = [];

    if (!firstNameInput.value.trim()) errors.push("First name is required");
    if (!lastNameInput.value.trim())  errors.push("Last name is required");

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
      first:   firstNameInput.value,
      last:    lastNameInput.value,
      mail:    emailVal,
      pass:    pwd,
      confirm: confirmPwdInput.value
    });

    const user = {
      id: users.length + 1,
      firstname: firstNameInput.value.trim(),
      lastname:  lastNameInput.value.trim(),
      email:     emailVal,
      status: "Hoạt động",
      password:  pwd
    };
    console.log("Thêm user:", user);

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("Users hiện tại:", users);

    window.location.href = "../pages/login.html";
  });
});
