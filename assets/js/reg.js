// apiUrl dinamikus beállítása
const apiUrl = location.hostname === 'localhost' ? 'http://localhost/todo_app/api/authentication/registration.php' : 'https://todoapp.norbbert4.hu/api/authentication/registration.php';
const verifyApiUrl = location.hostname === 'localhost' ? 'http://localhost/todo_app/api/authentication/verify_code.php' : 'https://todoapp.norbbert4.hu/api/authentication/verify_code.php';

const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const enable2FAInput = document.getElementById('enable_2fa');
const regButton = document.getElementById('reg-button');
const regInfo = document.getElementById('reg-info');
const regForm = document.getElementById('reg-form');
const codeField = document.getElementById('codeField');
const verifyButton = document.getElementById('verify-button');
const codeInfo = document.getElementById('code-info');

// Globális változó az időzítő tárolására
let messageTimeout = null;

// Segédfüggvény az üzenet megjelenítésére animáció nélkül
const showMessage = (element, message, type) => {
    if (element) {
        // Előző időzítő törlése, ha van
        if (messageTimeout) {
            clearTimeout(messageTimeout);
            messageTimeout = null;
        }

        // Üzenet beállítása és osztály hozzáadása
        element.textContent = message;
        element.className = ''; // Reseteljük az osztályokat
        element.classList.add(type); // Pl. bg-red, bg-green

        // Üzenet megjelenítése animáció nélkül
        element.style.display = 'block';

        // 5 másodperc várakozás, majd elrejtés
        messageTimeout = setTimeout(() => {
            element.style.display = 'none';
            messageTimeout = null;
        }, 5000); // 5 másodperc várakozás
    }
};

const registration = async (event) => {
    event.preventDefault();
    const email = emailInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;
    const enable_2fa = enable2FAInput.checked;

    // Ellenőrizzük, hogy az e-mail cím tartalmaz-e "@" jelet
    if (!email.includes('@')) {
        showMessage(regInfo, 'Az e-mail címnek tartalmaznia kell egy "@" jelet!', 'bg-red');
        return;
    }

    // Jelszó követelmények ellenőrzése kliensoldalon
    if (password.length < 8 || 
        !/[a-z]/.test(password) || 
        !/[A-Z]/.test(password) || 
        !/[0-9]/.test(password)) {
        showMessage(regInfo, 'A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell kisbetűt, nagybetűt és számot.', 'bg-red');
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password, enable_2fa }),
        });

        if (!response.ok) {
            throw new Error('Hálózati hiba: ' + response.statusText);
        }

        const text = await response.text();
        console.log('Nyers válasz a registration.php-től:', text);
        const data = JSON.parse(text);

        if (data.success && data.step === 'verify_code') {
            showMessage(regInfo, data.message, 'bg-green');
            const redirectUrl = window.location.hostname === 'localhost' ? 
                '/todo_app/verify_code.html' : 
                'https://todoapp.norbbert4.hu/verify_code.html';
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000);
        } else if (!data.success) {
            showMessage(regInfo, data.error.message, 'bg-red');
        }
    } catch (error) {
        console.error('Hiba:', error);
        showMessage(regInfo, 'Hiba történt a regisztráció során: ' + error.message, 'bg-red');
    }
};

const verifyCode = async () => {
    const code = codeField.value;

    try {
        const response = await fetch(verifyApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            throw new Error('Hálózati hiba: ' + response.statusText);
        }

        const text = await response.text();
        console.log('Nyers válasz a verify_code.php-től:', text);
        const data = JSON.parse(text);

        if (data.success) {
            showMessage(codeInfo, data.message, 'bg-green');
            setTimeout(() => {
                window.location.href = "./index.html";
            }, 2000);
        } else {
            showMessage(codeInfo, data.error.message, 'bg-red');
        }
    } catch (error) {
        console.error('Hiba:', error);
        showMessage(codeInfo, 'Hiba történt a kód ellenőrzése során: ' + error.message, 'bg-red');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (regForm) {
        regForm.addEventListener('submit', registration);
    } else {
        console.log('A regForm elem nem található a DOM-ban.');
    }

    if (verifyButton) {
        verifyButton.addEventListener('click', verifyCode);
    }
});