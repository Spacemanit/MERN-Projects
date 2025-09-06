let divEmail = document.querySelector('#divEmail');
let divPassword = document.querySelector('#divPassword');
let loginButton = document.querySelector('#loginbutton');
let divUsername = document.querySelector('#divUsername');
let signupButton = document.getElementById('signupButton');
let newUserButton = document.getElementById('newUserButton');

const ip = location.origin;

window.onload = function() {
    divUsername.style.display = "none";
}

newUserButton.addEventListener("click", () => {
    document.getElementById("gridd").classList.replace("grid-rows-3", "grid-rows-4")
    divUsername.style.display = "block"

    newUserButton.style.display = "none";
    signupButton.style.display = "block";
});

loginButton.addEventListener('click', (e) => {
    const data = { email: divEmail.value, pass: divPassword.value }
    fetch(`${ip}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message == 'Login Successful') {
                console.log(data);
                localStorage.setItem('username', data.username)
                location = 'chat.html'
            } else {
                alert(data.message);
            }
            console.log(data)
        })
        .catch(error => console.error('Error:', error));
});

signupButton.addEventListener('click', (e) => {
    const data = { email: divEmail.value, pass: divPassword.value, username: divUsername.value };
    fetch(`${ip}/user/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message === 'Sign Up Successful') {
                location.reload(); // Reload to go back to the login screen
            }
        })
        .catch(error => console.error('Error:', error));
});