document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost/todo_app/api/authentication/resetpassword.php'
        : 'https://todoapp.norbbert4.hu/api/authentication/resetpassword.php';

    const form = document.getElementById('reset-password-form');
    const resetInfo = document.getElementById('reset-info');

    // Segédfüggvény az üzenet megjelenítésére animáció nélkül
    const showMessage = (message, type) => {
        resetInfo.textContent = message;
        resetInfo.className = `bg-${type}`; // pl. bg-danger, bg-success
        resetInfo.style.display = 'block';

        setTimeout(() => {
            resetInfo.style.display = 'none';
        }, 5000); // 5 másodperc megjelenítés
    };

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const token = document.getElementById('token').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Jelszó egyezés ellenőrzése
            if (newPassword !== confirmPassword) {
                showMessage('A jelszavak nem egyeznek.', 'danger');
                return;
            }

            // Jelszó követelmények ellenőrzése kliensoldalon
            if (newPassword.length < 8 || 
                !/[a-z]/.test(newPassword) || 
                !/[A-Z]/.test(newPassword) || 
                !/[0-9]/.test(newPassword)) {
                showMessage('A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell kisbetűt, nagybetűt és számot.', 'danger');
                return;
            }

            // API kérés küldése
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: token, newPassword: newPassword })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP hiba! Státusz: ${response.status} - ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        showMessage('Jelszó sikeresen frissítve! Most már bejelentkezhetsz.', 'success');
                        setTimeout(() => {
                            window.location.href = '../../index.html';
                        }, 2000); // Átirányítás 2 másodperc után
                    } else {
                        showMessage(data.error.message, 'danger');
                    }
                })
                .catch(error => {
                    showMessage(`Hiba történt a kérés során: ${error.message}`, 'danger');
                    console.error('Hiba részletei:', error);
                });
        });
    } else {
        console.error('Az űrlap nem található! Ellenőrizd az id="reset-password-form" azonosítót.');
    }
});