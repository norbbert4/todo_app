
const apiUrl = 'https://todoapp.norbbert4.hu/api/authentication/registration.php';
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const regButton = document.getElementById('reg-button');
const regInfo = document.getElementById('reg-info');
const regForm = document.getElementById('reg-form');


const registration = async () => {
    // eltároljuk egy-egy változóban az input mezők értékét
    const email = emailInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;

    // fetch-el meghívjuk a login.php-t
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }), // a header body-jába egy json-sztringet készítünk a két adatból
    })
    .then(response => response.json())
    .then(data => {
        if (data.success == true) {
            // feldobunk egy üzenetet
            regInfo.classList.add('bg-green');
            regInfo.textContent = 'Sikeres regisztráció!';
            // majd újratöltjük az oldalt a dashboard.html-lel
            setTimeout(()=>{
                window.location.href = "./";
            }, 2000);
        } else {
            // sikertelen bejelentkezés során feldobunk egy üzenetet
            regInfo.classList.add('bg-red');            
            regInfo.textContent = data.error.message;
        }
    })
    .catch(error => console.error('Hiba:', error));
}



// figyeljük az űrlap végrehajtását
regForm.addEventListener('submit', function(event) {
    event.preventDefault();
    registration();
});
