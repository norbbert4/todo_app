document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reset-password-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const token = document.getElementById('token').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const resetInfo = document.getElementById('reset-info');

            if (newPassword !== confirmPassword) {
                resetInfo.innerHTML = '<p class="text-danger">A jelszavak nem egyeznek.</p>';
                return;
            }

            fetch('https://todoapp.norbbert4.hu/api/authentication/reset_password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: token, newPassword: newPassword })
            })
            .then(response => {
                console.log('Válasz státusza:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP hiba! Státusz: ${response.status} - ${response.statusText}`);
                }
                return response.text();
            })
            .then(text => {
                console.log('Nyers válasz:', text);
                try {
                    const data = JSON.parse(text);
                    if (data.success) {
                        resetInfo.innerHTML = '<p class="text-success">Jelszó sikeresen frissítve! Most már bejelentkezhetsz.</p>';
                    } else {
                        resetInfo.innerHTML = `<p class="text-danger">${data.error.message}</p>`;
                    }
                } catch (error) {
                    throw new Error(`A szerver válasza nem JSON formátumú: ${text}`);
                }
            })
            .catch(error => {
                resetInfo.innerHTML = `<p class="text-danger">Hiba történt a kérés során: ${error.message}</p>`;
                console.error('Hiba részletei:', error);
            });
        });
    } else {
        console.error('Az űrlap nem található! Ellenőrizd az id="reset-password-form" azonosítót.');
    }
});