// DOM elemek elérése
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('toggle-password');
const resetPasswordButton = document.getElementById('x');
const profileInfo = document.getElementById('profile-info');

// Felhasználói adatok a localStorage-ból
let userData = { user_ID: 0, token: '', username: '', password: '' };
if (localStorage.getItem('userData') !== null) {
    userData = JSON.parse(localStorage.getItem('userData'));
    console.log('Betöltött userData:', userData); // Debug
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
        console.log('API válasz:', data); // Debug

        if (data.success) {
            emailInput.value = data.userData.email || 'Nincs email'; // Email az API-ból
            // Felhasználónév: először a localStorage-ból, ha nincs, akkor az API user_name-jéből
            usernameInput.value = userData.username || data.userData.user_name || 'Nincs felhasználónév';
            // Jelszó: localStorage-ból, mert az API hash-elt értéket ad
            passwordInput.value = userData.password || 'Nincs jelszó';
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

// Jelszó visszaállítás (placeholder)
resetPasswordButton.addEventListener('click', () => {
    profileInfo.classList.add('bg-green');
    profileInfo.textContent = 'Jelszó visszaállítás még nem implementálva!';
    setTimeout(() => {
        profileInfo.textContent = '';
        profileInfo.classList.remove('bg-green');
    }, 2000);
});

// Inicializálás
fetchProfile();