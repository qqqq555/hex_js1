let apiUrl = `https://todoo.5xcamp.us`;
let token = "";

function toggleForms() {
    const loginForm = document.querySelector('.card').style;
    const registerForm = document.getElementById('register-form').style;
    if (loginForm.display === 'none') {
        loginForm.display = 'block';
        registerForm.display = 'none';
    } else {
        loginForm.display = 'none';
        registerForm.display = 'block';
    }
};

function signUp(email, nickname, password){
    axios.post(`${apiUrl}/users`,{
        "user": {
            "email": email,
            "nickname": nickname,
            "password": password
        }
    })
    .then(response => {
        console.log('User created successfully:', response);
        alert('註冊成功！');
        window.location.href = 'index.html'; 
    }).catch(error => {
        if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
            alert('電子信箱已被使用');
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
    });
};
function logIn(email, password){
    axios.post(`${apiUrl}/users/sign_in`,{
        "user": {
            "email": email,
            "password": password
        }
    })
    .then(response => {
        console.log('Log in successfully:', response);
        alert('登入成功！');
        token = response.headers.authorization;
        localStorage.setItem('token', token); 
        localStorage.setItem('apiUrl', apiUrl); 
        window.location.href = 'todo.html'; 
    }).catch(error => {
        if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
            if (error.response.data.errors) {
                alert('Error: ' + JSON.stringify(error.response.data.errors));
            }
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
    });
};

document.addEventListener('DOMContentLoaded', function() {
    var registerForm = document.getElementById('register-form');
    if (registerForm) {
    registerForm.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        var email = document.getElementById('new-email').value;
        var nickname = document.getElementById('nickname').value;
        var password = document.getElementById('new-password').value;
        var passwordCheck = document.getElementById('password-check').value;

        if (password !== passwordCheck) {
            alert('兩次密碼不一致！');

        } else if(password.length < 6){
            alert('密碼至少6個字元！');
        } else{
            signUp(email, nickname, password);
        }
    });}
    var loginForm = document.querySelector('.card-body form');
    if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        logIn(email, password);
    });}
});
