(function () {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = './login.html';
    }
})();