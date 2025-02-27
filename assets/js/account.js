// DOM elemek elérése
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('toggle-password');
const profileInfo = document.getElementById('profile-info');

// Felhasználói adatok a localStorage-ból
let userData = { user_ID: 0, token: '' };
if (localStorage.getItem('userData') !== null) {
    userData = JSON.parse(localStorage.getItem('userData'));
}

const apiUrl = 'http://localhost/todo_app/api/authentication/profile.php';

// Profil adatok lekérése
const fetchProfile = async () => {
    if (!userData.token || userData.token.length === 0) {
        profileInfo.classList.add('bg-red');
        profileInfo.textContent = 'Nincs bejelentkezve felhasználó! Kérlek, jelentkezz be.';
        setTimeout(() => {
            window.location.href = './index.html';
        }, 2000);
        return;
    }

    try {
        const response = await fetch(`${apiUrl}?userid=${userData.user_ID}&token=${userData.token}`);
        const data = await response.json();

        if (data.success) {
            emailInput.value = data.userData.email;
            usernameInput.value = data.userData.username;
            passwordInput.value = data.userData.password;
        } else {
            profileInfo.classList.add('bg-red');
            profileInfo.textContent = data.message;
            setTimeout(() => {
                window.location.href = './index.html';
            }, 2000);
        }
    } catch (error) {
        console.error('Hiba:', error);
        profileInfo.classList.add('bg-red');
        profileInfo.textContent = 'Hiba történt az adatok lekérése közben.';
    }
};

// Jelszó mutatása/elrejtése
togglePasswordButton.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordButton.textContent = 'Jelszó elrejtése';
    } else {
        passwordInput.type = 'password';
        togglePasswordButton.textContent = 'Jelszó mutatása';
    }
});

// Inicializálás
fetchProfile();