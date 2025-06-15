document.addEventListener('DOMContentLoaded', function () {
  let users = [];
  try {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      users = Array.isArray(parsedUsers) ? parsedUsers : [];
    }
  } catch (e) {
    console.error('Error fetching users from localStorage:', e);
  }

  const toastElement = document.getElementById('validationToast');
  const toast = new bootstrap.Toast(toastElement);

  if (users.length === 0) {
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

  window.login = function (event) {
    event.preventDefault();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const email = emailInput.value;
    const password = passwordInput.value;
    let errors = [];

    if (!email.trim()) {
      errors.push("Email must be fill");
    } else if (!emailInput.checkValidity()) {
      errors.push("Invalid Email");
    }

    if (!password) {
      errors.push("Password must be fill");
    } else if (password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (errors.length > 0) {
      toastElement.querySelector('.toast-body').innerHTML = errors.join("<br>");
      toast.show();
    } else {
      if (!Array.isArray(users)) {
        toastElement.querySelector('.toast-body').innerHTML = "User Data invalid";
        toast.show();
        return;
      }
      const user = users.find(user => user.email === email);
      if (!user) {
        toastElement.querySelector('.toast-body').innerHTML = "Email is NOT exist!";
        toast.show();
      } else if (user.password !== password) {
        toastElement.querySelector('.toast-body').innerHTML = "Password is incorrect";
        toast.show();
      } else if (user.status === "Blocked") {
        toastElement.querySelector('.toast-body').innerHTML = "Account is blocked!";
        toast.show();
      } else {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('currentUserId', user.id);
        window.location.href = "../pages/user_manager.html";
      }
    }
  };
});