const loginApiUrl = 'api/authentication/login.php';
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginInfo = document.getElementById('login-info');
const loginForm = document.getElementById('login-form');

let userData = { user_ID: 0, token: '', username: '', password: '' };
if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));

const check = async () => {
    if (userData.token.length > 0 && userData.user_ID > 0) {
        try {
            const response = await fetch(`${loginApiUrl}?token=${userData.token}&user_id=${userData.user_ID}`);
            const data = await response.json();
            if (data.success === true) {
                console.log('Token ellenőrzés sikeres, átirányítás a todo.html-re...');
                window.location.href = "todo.html";
            } else {
                console.log(data.message);
                localStorage.removeItem('userData');
            }
        } catch (error) {
            console.error('Hiba a token ellenőrzése során:', error);
            localStorage.removeItem('userData');
        }
    }
};

const login = async (event) => {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch(loginApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Hálózati hiba: ' + response.statusText);
        }

        const data = await response.json();
        console.log('Login válasz:', data);

        if (data.success === true) {
            const updatedUserData = {
                user_ID: data.userData.user_ID,
                token: data.userData.token,
                username: data.userData.user_name || username, // API válaszból vagy inputból
                password: password,
                coins: data.userData.coins || 0
            };
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            userData = updatedUserData; // Frissítjük a globális userData-t
            if (loginInfo) {
                loginInfo.classList.add('bg-green');
                loginInfo.textContent = 'Sikeres bejelentkezés!';
            }
            setTimeout(() => {
                console.log('Átirányítás a todo.html-re...');
                window.location.href = "todo.html";
            }, 2000);
        } else if (data.error === '2FA required') {
            if (loginInfo) {
                loginInfo.classList.add('bg-yellow');
                loginInfo.textContent = 'Kétfaktoros hitelesítés szükséges! Átirányítunk...';
            }
            sessionStorage.setItem('pending_login', JSON.stringify({ username, password }));
            setTimeout(() => {
                console.log('Átirányítás a verify_2fa.html-re...');
                window.location.href = `verify_2fa.html?session_id=${data.session_id}`;
            }, 2000);
        } else {
            const errorMessage = data.error?.message || 'Hiba történt a bejelentkezés során.';
            if (loginInfo) {
                loginInfo.classList.add('bg-red');
                loginInfo.textContent = errorMessage;
            }
        }
    } catch (error) {
        console.error('Hiba a bejelentkezés során:', error);
        const errorMessage = 'Hiba történt a bejelentkezés során: ' + error.message;
        if (loginInfo) {
            loginInfo.classList.add('bg-red');
            loginInfo.textContent = errorMessage;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    } else {
        console.error('A loginForm elem nem található a DOM-ban.');
    }
    check();
});