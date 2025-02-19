
const loginApiUrl = 'http://localhost/todo_app/api/authentication/login.php';
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const loginInfo = document.getElementById('login-info');

let userData = { user_ID: 0, token: '' };
if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));

const check = async () => {
    if (userData.token.length > 0) {
        fetch(`${loginApiUrl}?token=${userData.token}&user_id=${userData.user_ID}`)
        .then(response => response.json())
        .then(data => {
            if (data.success == true) {
                window.location.href = "todo.html";
            } else {
                console.log(data.message);
            }
        })
    }
}


// bejelentkező függvény
const login = async () => {
    // eltároljuk egy-egy változóban az input mezők értékét
    const username = usernameInput.value;
    const password = passwordInput.value;

    // fetch-el meghívjuk a login.php-t
    fetch(loginApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // a header body-jába egy json-sztringet készítünk a két adatból
    })
    .then(response => response.json())
    .then(data => {
        if (data.success == true) {
            // sikeres bejelentkezés esetén mentjük az adatokat a localStorage-be
            localStorage.setItem('userData', JSON.stringify(data.userData));
            // feldobunk egy üzenetet
            loginInfo.classList.add('bg-green');
            loginInfo.textContent = 'Sikeres bejelentkezés!';
            // majd újratöltjük az oldalt a dashboard.html-lel
            setTimeout(()=>{
                window.location.href = "todo.html";
            }, 2000);
        } else {
            // sikertelen bejelentkezés során feldobunk egy üzenetet
            loginInfo.classList.add('bg-red');
            
            loginInfo.textContent = data.error.message;
            
            //loginInfo.textContent = 'Hibás felhasználónév vagy jelszó!';
        }
    })
    .catch(error => console.error('Hiba:', error));
}



// figyeljük a gombon a kattintást
loginButton.addEventListener('click', login);

check();