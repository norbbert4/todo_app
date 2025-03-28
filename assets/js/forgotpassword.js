document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('forgot-password-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const forgotInfo = document.getElementById('forgot-info');

            fetch('https://todoapp.norbbert4.hu/api/authentication/forgotpassword.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    forgotInfo.innerHTML = `<p class="text-success">Email elküldve! Ellenőrizd a postafiókodat.</p>`;
                } else {
                    forgotInfo.innerHTML = `<p class="text-danger">${data.error.message}</p>`;
                }
            })
            .catch(error => {
                forgotInfo.innerHTML = `<p class="text-danger">Hiba történt a kérés során: ${error.message}</p>`;
                console.error('Hiba:', error);
            });
        });
    } else {
        console.error('Az űrlap nem található! Ellenőrizd az id="forgot-password-form" azonosítót.');
    }
});