
const apiUrl = 'https://todoapp.norbbert4.hu/api/authentication/forgotpassword.php';
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const getButton = document.getElementById('get-button');
const postButton = document.getElementById('post-button');
const regInfo = document.getElementById('reg-info');
const regForm = document.getElementById('reg-form');

const getForm = document.getElementById('get-form');
const postForm = document.getElementById('post-form');

const userIdInput = document.getElementById('userid');


const forgotpassword = async () => {
    // eltároljuk egy-egy változóban az input mezők értékét
    const email = emailInput.value;
    const username = usernameInput.value;
    // fetch-el meghívjuk a login.php-t
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username }), // a header body-jába egy json-sztringet készítünk a két adatból
    })
    .then(response => response.json())
    .then(data => {
        if (data.success == true) {
            // feldobunk egy üzenetet
            regInfo.classList.add('bg-green');
            regInfo.textContent = 'Sikeres jelszó kérés!';
            // itt felhívjuk a figyelmet arra, hogy nézze meg az emailjét
            getForm.classList.add('hidden');
            postForm.classList.remove('hidden');
            userIdInput.value = data.userData.user_ID;
            //setTimeout(()=>{
                //window.location.href = "./";
            //}, 2000);
        } else {
            // sikertelen bejelentkezés során feldobunk egy üzenetet
            regInfo.classList.add('bg-red');            
            regInfo.textContent = data.error.message;
        }
    })
    .catch(error => console.error('Hiba:', error));
}


const newPassword = async () => {
    // eltároljuk egy-egy változóban az input mezők értékét
    const password = passwordInput.value;
    const user_ID = userIdInput.value;

    // fetch-el meghívjuk a login.php-t
    fetch(`${apiUrl}?newpw=1`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, user_ID }), // a header body-jába egy json-sztringet készítünk a két adatból
    })
    .then(response => response.json())
    .then(data => {
        if (data.success == true) {
            // feldobunk egy üzenetet
            regInfo.classList.add('bg-green');
            regInfo.textContent = 'Sikeres jelszó módosítás!';
            // majd újratöltjük az oldalt a loginra
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
getForm.addEventListener('submit', function(event) {
    event.preventDefault();
    forgotpassword();
});

// figyeljük az űrlap végrehajtását
postForm.addEventListener('submit', function(event) {
    event.preventDefault();
    newPassword();
});
