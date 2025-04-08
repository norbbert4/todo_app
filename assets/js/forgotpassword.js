document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost/todo_app/api/'
        : 'https://todoapp.norbbert4.hu/api/';

    const form = document.getElementById('forgot-password-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const forgotInfo = document.getElementById('forgot-info');

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
            forgotInfo.innerHTML = '<p class="text-success">Email elküldve! Ellenőrizd a postafiókodat.</p>';
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