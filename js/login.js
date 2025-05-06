const users = JSON.parse(localStorage.getItem("users"))

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form')
  const toastElement = document.getElementById('validationToast')
  const toast = new bootstrap.Toast(toastElement)

  form.addEventListener('submit', function (event) {
    event.preventDefault()
    let errors = []

    const email = document.getElementById('email')
    const password = document.getElementById('password')

    if (!email.value.trim()) {
      errors.push("Email is required")
    } else if (!email.checkValidity()) {
      errors.push("Email is invalid")
    }

    if (!password.value) {
      errors.push("Password is required")
    } else if (password.value.length < 6) {
      errors.push("Password must be at least 6 characters")
    }

    if (errors.length > 0) {
      toastElement.querySelector('.toast-body').innerHTML = errors.join("<br>")
      toast.show()
    } else {
      const user = users.find(user => user.email === email.value && user.password === password.value)
      if (!user) {
        toastElement.querySelector('.toast-body').innerHTML = "Invalid email or password"
        toast.show()
      }
      else {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = "../pages/dashboard.html"
      }
    }
  })
})
