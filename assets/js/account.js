// account.js

// DOM elemek elérése
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('profile-username'); // Módosítva: 'username' helyett 'profile-username'
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('toggle-password');
const resetPasswordButton = document.getElementById('x');
const profileInfo = document.getElementById('profile-info');
const userInfo = document.querySelector('#user-info'); // Felhasználói info a nav-ban
const userCoinContainer = document.querySelector('.user-coin-container');
const usernameSpan = document.querySelector('#username');
const coinCountSpan = document.querySelector('#coin-count');

// Felhasználói adatok a localStorage-ból
let userData = { user_ID: 0, token: '-', username: 'Ismeretlen felhasználó', coins: 0, password: '' };
if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));

const apiUrl = 'https://todoapp.norbbert4.hu/api/';

// Autentikáció ellenőrzése és felhasználó nevének megjelenítése a nav-ban
const check = async () => {
    if (userData.token.length > 0) {
        try {
            const response = await fetch(`${apiUrl}authentication/login.php?token=${userData.token}&user_id=${userData.user_ID}`);
            const data = await response.json();
            if (data.success === true) {
                const username = data.username || userData.username || 'Ismeretlen felhasználó';
                const coins = userData.coins !== undefined ? userData.coins : (data.coins || 0);
                userData.username = username;
                userData.coins = coins;
                localStorage.setItem('userData', JSON.stringify(userData));
                if (userInfo && usernameSpan && coinCountSpan) {
                    usernameSpan.textContent = username;
                    coinCountSpan.textContent = coins;
                } else {
                    console.error('A userInfo, usernameSpan vagy coinCountSpan elem nem található a DOM-ban!');
                }
                console.log('Autentikáció sikeres:', data);
            } else {
                console.log('Autentikáció sikertelen:', data);
                localStorage.removeItem('userData');
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Hiba az autentikáció során:', error);
            localStorage.removeItem('userData');
            window.location.href = 'index.html';
        }
    } else {
        console.log('Nincs token, átirányítás...');
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
    }
};

// Profil adatok lekérése
const fetchProfile = async () => {
    if (!userData.token || userData.token.length === 0) {
        if (profileInfo) {
            profileInfo.classList.add('bg-red');
            profileInfo.textContent = 'Nincs bejelentkezve felhasználó! Kérlek, jelentkezz be.';
            setTimeout(() => {
                window.location.href = './index.html';
            }, 2000);
        }
        return;
    }

    try {
        const response = await fetch(`${apiUrl}authentication/profile.php?userid=${userData.user_ID}&token=${userData.token}`);
        const data = await response.json();
        console.log('Profil API válasz:', data); // Debug

        if (data.success) {
            if (emailInput && usernameInput && passwordInput) {
                emailInput.value = data.userData.email || 'Nincs email'; // Email az API-ból
                // Felhasználónév: API-ból, ha nincs, akkor localStorage-ból
                usernameInput.value = data.userData.username || userData.username || 'Nincs felhasználónév';
                // Jelszó: localStorage-ból, mert az API hash-elt értéket ad
                passwordInput.value = userData.password || 'Nincs jelszó';
            } else {
                console.error('Az emailInput, usernameInput vagy passwordInput elem nem található a DOM-ban!');
            }
        } else {
            if (profileInfo) {
                profileInfo.classList.add('bg-red');
                profileInfo.textContent = data.message;
                setTimeout(() => {
                    window.location.href = './index.html';
                }, 2000);
            }
        }
    } catch (error) {
        console.error('Hiba:', error);
        if (profileInfo) {
            profileInfo.classList.add('bg-red');
            profileInfo.textContent = 'Hiba történt az adatok lekérése közben.';
        }
    }
};

// Jelszó mutatása/elrejtése
const setupTogglePassword = () => {
    if (togglePasswordButton && passwordInput) {
        togglePasswordButton.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                togglePasswordButton.textContent = 'Jelszó elrejtése';
            } else {
                passwordInput.type = 'password';
                togglePasswordButton.textContent = 'Jelszó mutatása';
            }
        });
    } else {
        console.error('A togglePasswordButton vagy passwordInput elem nem található a DOM-ban!');
    }
};

// Jelszó visszaállítás (placeholder)
const setupResetPassword = () => {
    if (resetPasswordButton && profileInfo) {
        resetPasswordButton.addEventListener('click', () => {
            profileInfo.classList.add('bg-green');
            profileInfo.textContent = 'Jelszó visszaállítás még nem implementálva!';
            setTimeout(() => {
                profileInfo.textContent = '';
                profileInfo.classList.remove('bg-green');
            }, 2000);
        });
    } else {
        console.error('A resetPasswordButton vagy profileInfo elem nem található a DOM-ban!');
    }
};

// Várjuk meg, amíg a DOM betöltődik
document.addEventListener('DOMContentLoaded', () => {
    check();
    fetchProfile();
    setupTogglePassword();
    setupResetPassword();
});