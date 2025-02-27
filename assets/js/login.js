const loginApiUrl = 'http://localhost/todo_app/api/authentication/login.php';
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const loginInfo = document.getElementById('login-info');

let userData = { user_ID: 0, token: '' };
if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));

const check = async () => {
    if (userData.token.length > 0) {
        fetch(`${loginApiUrl}?token=${userData.token}&user_id=${userData.user_ID}`)
        .then(response => response.json())
        .then(data => {
            if (data.success == true) {
                window.location.href = "todo.html";
            } else {
                console.log(data.message);
            }
        })
    }
}

const login = async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    console.log('Bejelentkezési adatok:', { username, password }); // Debug

    fetch(loginApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success == true) {
            const updatedUserData = {
                user_ID: data.userData.user_ID,
                token: data.userData.token,
                username: username, // Beírt felhasználónév
                password: password // Beírt plaintext jelszó
            };
            console.log('Mentett userData:', updatedUserData); // Debug
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            loginInfo.classList.add('bg-green');
            loginInfo.textContent = 'Sikeres bejelentkezés!';
            setTimeout(() => {
                window.location.href = "todo.html";
            }, 2000);
        } else {
            loginInfo.classList.add('bg-red');
            loginInfo.textContent = data.error.message;
        }
    })
    .catch(error => console.error('Hiba:', error));
}

loginButton.addEventListener('click', login);
check();