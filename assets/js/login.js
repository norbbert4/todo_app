// apiUrl dinamikus beállítása
const apiUrl = location.hostname === 'localhost' ? 'http://localhost/todo_app/api/' : 'https://todoapp.norbbert4.hu/api/';

const loginApiUrl = `${apiUrl}authentication/login.php`; // Dinamikusan beállítva
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginInfo = document.getElementById('login-info');
const loginForm = document.getElementById('login-form');

let userData = { user_ID: 0, token: '', username: '', password: '' };
if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));

// Globális változó az időzítő tárolására
let messageTimeout = null;

// Segédfüggvény az üzenet megjelenítésére
const showMessage = (message, type) => {
    if (loginInfo) {
        // Előző időzítő törlése, ha van
        if (messageTimeout) {
            clearTimeout(messageTimeout);
            messageTimeout = null;
        }

        // Üzenet beállítása és osztály hozzáadása
        loginInfo.textContent = message;
        loginInfo.className = ''; // Reseteljük az osztályokat
        loginInfo.classList.add(type); // Pl. bg-red, bg-green

        // Üzenet megjelenítése
        loginInfo.style.display = 'block';

        // 5 másodperc várakozás, majd elrejtés
        messageTimeout = setTimeout(() => {
            loginInfo.style.display = 'none';
            messageTimeout = null;
        }, 5000); // 5 másodperc várakozás
    }
};

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
                username: data.userData.user_name || username,
                password: password,
                coins: data.userData.coins || 0
            };
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            userData = updatedUserData;
            showMessage('Sikeres bejelentkezés!', 'bg-green');
            setTimeout(() => {
                console.log('Átirányítás a todo.html-re...');
                window.location.href = "todo.html";
            }, 2000);
        } else if (data.error === '2FA required') {
            showMessage('Kétfaktoros hitelesítés szükséges! Átirányítunk...', 'bg-yellow');
            sessionStorage.setItem('pending_login', JSON.stringify({ username, password }));
            setTimeout(() => {
                console.log('Átirányítás a verify_2fa.html-re...');
                window.location.href = `verify_2fa.html?session_id=${data.session_id}`;
            }, 2000);
        } else {
            const errorMessage = data.error?.message || 'Hiba történt a bejelentkezés során.';
            showMessage(errorMessage, 'bg-red');
        }
    } catch (error) {
        console.error('Hiba a bejelentkezés során:', error);
        const errorMessage = 'Hiba történt a bejelentkezés során: ' + error.message;
        showMessage(errorMessage, 'bg-red');
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