
const fullnameInput = document.getElementById('fullname');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const regButton = document.getElementById('reg-button');
const regInfo = document.getElementById('reg-info');


const registration = async () => {
    // eltároljuk egy-egy változóban az input mezők értékét
    const fullname = fullnameInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;

    // fetch-el meghívjuk a login.php-t
    fetch('/todo_app/api/authentication/registration.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname, username, password }), // a header body-jába egy json-sztringet készítünk a két adatból
    })
    .then(response => response.json())
    .then(data => {
        if (data.success == true) {
            // feldobunk egy üzenetet
            regInfo.classList.add('bg-green');
            regInfo.textContent = 'Sikeres regisztráció!';
            // majd újratöltjük az oldalt a dashboard.html-lel
            setTimeout(()=>{
                window.location.href = "index.html";
            }, 2000);
        } else {
            // sikertelen bejelentkezés során feldobunk egy üzenetet
            regInfo.classList.add('bg-red');            
            regInfo.textContent = data.error.message;
        }
    })
    .catch(error => console.error('Hiba:', error));
}



// figyeljük a gombon a kattintást
regButton.addEventListener('click', registration);
