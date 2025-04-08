document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost/todo_app/api/'
        : 'https://todoapp.norbbert4.hu/api/';

    const form = document.getElementById('forgot-password-form');
    const forgotInfo = document.getElementById('forgot-info');

    // Globális változó az időzítő tárolására
    let messageTimeout = null;

    // Segédfüggvény az üzenet megjelenítésére
    const showMessage = (message, type) => {
        if (forgotInfo) {
            // Előző időzítő törlése, ha van
            if (messageTimeout) {
                clearTimeout(messageTimeout);
                messageTimeout = null;
            }

            // Üzenet beállítása és osztály hozzáadása
            forgotInfo.textContent = message;
            forgotInfo.className = ''; // Reseteljük az osztályokat
            forgotInfo.classList.add(type); // Pl. bg-red, bg-green

            // Üzenet megjelenítése
            forgotInfo.style.display = 'block';

            // 5 másodperc várakozás, majd elrejtés
            messageTimeout = setTimeout(() => {
                forgotInfo.style.display = 'none';
                messageTimeout = null;
            }, 5000); // 5 másodperc várakozás
        }
    };

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;

            fetch(`${apiUrl}authentication/forgotpassword.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP hiba! Státusz: ${response.status}`);
                }
                // Logoljuk a nyers választ
                return response.text().then(text => {
                    console.log('Nyers válasz:', text);
                    return JSON.parse(text); // Próbáljuk meg JSON-ként értelmezni
                });
            })
            .then(data => {
                if (data.success) {
                    showMessage('Email elküldve! Ellenőrizd a postafiókodat.', 'bg-green');
                } else {
                    showMessage(data.error.message, 'bg-red');
                }
            })
            .catch(error => {
                showMessage(`Hiba történt a kérés során: ${error.message}`, 'bg-red');
                console.error('Hiba:', error);
            });
        });
    } else {
        console.error('Az űrlap nem található! Ellenőrizd az id="forgot-password-form" azonosítót.');
    }
});