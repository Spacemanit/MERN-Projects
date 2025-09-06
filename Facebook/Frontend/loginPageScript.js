let divEmail = document.querySelector('#divEmail');
let divPassword = document.querySelector('#divPassword');
let loginButton = document.querySelector('#loginbutton');
let divUsername = document.querySelector('#divUsername');
let signupButton = document.getElementById('signupButton');
let newUserButton = document.getElementById('newUserButton');

const ip = location.origin;


document.addEventListener('DOMContentLoaded', () => {
    window.onload = function () {
        divUsername.style.display = "none";
    }

    newUserButton.addEventListener("click", () => {
        document.getElementById("gridd").classList.replace("grid-rows-3", "grid-rows-4")
        divUsername.style.display = "block"

        newUserButton.style.display = "none";
        signupButton.style.display = "block";
    });

    loginButton.addEventListener('click', (e) => {
        const data = { email: divEmail.value, password: divPassword.value }
        fetch(`${ip}/login`, {
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
                    localStorage.setItem('token', data.token)
                    location = 'home.html'
                } else {
                    alert(data.message);
                }
                console.log(data)
            })
            .catch(error => console.error('Error:', error));
    });

    signupButton.addEventListener('click', (e) => {
        const data = { email: divEmail.value, password: divPassword.value, username: divUsername.value };
        fetch(`${ip}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.message === 'Succesfully signed up') {
                    location.reload(); // Reload to go back to the login screen
                }
            })
            .catch(error => console.error('Error:', error));
    });
})