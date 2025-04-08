// API URL dinamikus beállítása
const apiUrl = location.hostname === 'localhost' ? 'http://localhost/todo_app/api/' : 'https://todoapp.norbbert4.hu/api/';
const deleteAccountApiUrl = `${apiUrl}authentication/delete_account.php`;

// Űrlap és üzenetdoboz elemek
const deleteForm = document.getElementById('delete-account-form');
const deleteInfo = document.getElementById('delete-info');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

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

// Fiók törlési kérés indítása
const requestDeleteAccount = async (event) => {
    event.preventDefault(); // Megakadályozzuk az űrlap alapértelmezett küldését

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch(deleteAccountApiUrl, {
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

        if (data.success) {
            showMessage(deleteInfo, data.message, 'bg-green');
        } else if (data.error === 'confirmation_required') {
            showMessage(deleteInfo, 'Ellenőrző e-mailt küldtünk! Kérjük, kattints az e-mailben található linkre a törlés véglegesítéséhez.', 'bg-yellow');
        } else {
            showMessage(deleteInfo, data.error.message, 'bg-red');
        }
    } catch (error) {
        console.error('Hiba:', error);
        showMessage(deleteInfo, 'Hiba történt a fiók törlése során: ' + error.message, 'bg-red');
    }
};

// Eseménykezelő hozzáadása az űrlaphoz
document.addEventListener('DOMContentLoaded', () => {
    if (deleteForm) {
        deleteForm.addEventListener('submit', requestDeleteAccount);
    } else {
        console.log('A delete-account-form elem nem található a DOM-ban.');
    }
});