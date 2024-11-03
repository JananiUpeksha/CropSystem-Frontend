document.getElementById('showSignUp').addEventListener('click', function () {
    document.getElementById('login').classList.add('d-none');
    document.getElementById('signup').classList.remove('d-none');
});

document.getElementById('showLogin').addEventListener('click', function () {
    document.getElementById('signup').classList.add('d-none');
    document.getElementById('login').classList.remove('d-none');
});

document.getElementById('loginBtn').addEventListener('click', function () {
    document.getElementById('login').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
});

document.getElementById('signUpBtn').addEventListener('click', function () {
    // Here you can handle the signup functionality (e.g., form validation, saving data)
    alert('Sign up functionality not implemented yet.');
});
