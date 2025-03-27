const apiUrl = 'api/authentication/registration.php';
const verifyApiUrl = 'api/authentication/verify_code.php';
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const regButton = document.getElementById('reg-button');
const regInfo = document.getElementById('reg-info');
const regForm = document.getElementById('reg-form');
const codeField = document.getElementById('codeField');
const codeInfo = document.getElementById('code-info');
const verifyButton = document.getElementById('verify-button');

const registration = async () => {
    const email = emailInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Ellenőrizzük, hogy az e-mail cím tartalmaz-e "@" jelet
    if (!email.includes('@')) {
        regInfo.classList.add('bg-red');
        regInfo.textContent = 'Az e-mail címnek tartalmaznia kell egy "@" jelet!';
        return; // Kilépünk, nem küldjük el a kérést
    }

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Hálózati hiba: ' + response.statusText);
        }
        return response.text();
    })
    .then(text => {
        console.log('Nyers válasz a registration.php-től:', text);
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error('A válasz nem JSON formátumú: ' + text);
        }
    })
    .then(data => {
        if (data.success && data.step === 'verify_code') {
            regInfo.classList.add('bg-green');
            regInfo.textContent = data.message;
            setTimeout(() => {
                window.location.href = "/todo_app/verify_code.html"; // Abszolút útvonal
            }, 2000);
        } else if (!data.success) {
            regInfo.classList.add('bg-red');
            regInfo.textContent = data.error.message;
        }
    })
    .catch(error => {
        console.error('Hiba:', error);
        regInfo.classList.add('bg-red');
        regInfo.textContent = 'Hiba történt a regisztráció során: ' + error.message;
    });
};

const verifyCode = async () => {
    const code = codeField.value;

    fetch(verifyApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Hálózati hiba: ' + response.statusText);
        }
        return response.text();
    })
    .then(text => {
        console.log('Nyers válasz a verify_code.php-től:', text);
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error('A válasz nem JSON formátumú: ' + text);
        }
    })
    .then(data => {
        if (data.success) {
            codeInfo.classList.add('bg-green');
            codeInfo.textContent = data.message;
            setTimeout(() => {
                window.location.href = "./index.html";
            }, 2000);
        } else {
            codeInfo.classList.add('bg-red');
            codeInfo.textContent = data.error.message;
        }
    })
    .catch(error => {
        console.error('Hiba:', error);
        codeInfo.classList.add('bg-red');
        codeInfo.textContent = 'Hiba történt a kód ellenőrzése során: ' + error.message;
    });
};

document.addEventListener('DOMContentLoaded', () => {
    if (regForm) {
        regForm.addEventListener('submit', function(event) {
            event.preventDefault();
            registration();
        });
    }

    if (verifyButton) {
        verifyButton.addEventListener('click', function() {
            verifyCode();
        });
    }
});