const apiUrl = 'http://localhost/todo_app/api/';

const main = document.querySelector('main');
const aside = document.querySelector('aside');
const nav = document.querySelector('nav');
const userInfo = document.querySelector('#user-info');
const usernameSpan = document.querySelector('#username');
const coinCountSpan = document.querySelector('#coin-count');
if (!coinCountSpan) {
    console.error('A coinCountSpan elem nem található a DOM-ban!');
}
let userData = { user_ID: 0, token: '-', username: 'Ismeretlen felhasználó', coins: 0 };
if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));

const check = async () => {
    if (userData.token.length > 0 && userData.user_ID > 0) {
        try {
            const response = await fetch(`${apiUrl}authentication/login.php?token=${userData.token}&user_id=${userData.user_ID}`);
            const data = await response.json();
            if (data.success === true) {
                aside.innerHTML = '';
                aside.remove();
                if (userInfo) {
                    userData.username = data.username || 'Ismeretlen felhasználó';
                    userData.coins = data.coins || 0;
                    usernameSpan.textContent = userData.username;
                    coinCountSpan.textContent = userData.coins;
                    localStorage.setItem('userData', JSON.stringify(userData));
                    await getSkins();
                } else {
                    console.error('A userInfo elem nem található a DOM-ban!');
                }
            } else {
                console.error('Autentikációs hiba:', data.message);
                localStorage.removeItem('userData');
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Hiba az autentikáció során:', error);
            localStorage.removeItem('userData');
            window.location.href = 'index.html';
        }
    } else {
        console.warn('Nincs érvényes token vagy user_ID, átirányítás a bejelentkező oldalra.');
        window.location.href = 'index.html';
    }
};

// Várjuk meg, amíg a DOM betöltődik
document.addEventListener('DOMContentLoaded', () => {
    check();
});


async function getSkins() {
    const get_apiUrl = `${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=skins`;
    console.log('GET kérés URL:', get_apiUrl); // Naplózás a hibakereséshez
    try {
        const res = await fetch(get_apiUrl);
        const resjson = await res.json();
        //console.log('GET válasz:', resjson); // Naplózás a hibakereséshez
        let skins = [];
        if (resjson.type === 'result') {
            skins = resjson.body;
        } else {
            console.error('Hiba a skinek lekérdezésekor:', resjson.message);
            console.log(resjson.message);
            /*if (resjson.message === 'Sikertelen autentikáció.') {
                localStorage.removeItem('userData');
                window.location.href = 'index.html';
            }*/
        }

        // default skin box
        let skinsContent = `
                <div onclick="changeSkin('default', '0')" title="alapértelmezett" class="unlocked">
                    <h3>Default</h3>
                    <h5>default</h5>
                </div>`;

        skins.forEach((skin, index) => {
                skinsContent += `
                <div ${ skin.unlock_date ? 'onclick="changeSkin(\''+skin.css_file+'\', '+skin.skinID+')" title="feloldva" class="unlocked"' : 'class="locked" title="nincs feloldva"' }>
                    <h3>${skin.skin_name}</h3>
                    <h5>${skin.css_file}</h5>
                    <h6>${ skin.unlock_date ? skin.unlock_date : "nincs feloldva" }</h6>
                </div>`;
        });
       
        main.innerHTML = skinsContent; // Biztosítjuk, hogy a skin lista frissüljön
    } catch (error) {
        console.error('Hiba az API hívás során:', error);
        //localStorage.removeItem('userData');
        window.location.href = 'index.html';
    }
}


const changeSkin = async (skinDirector, skinID) => {
    const skinLink = document.querySelector('#skinlink');
    const res = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=skins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skinID })
    });
    if (res.ok) {
        // sikerült a mentés, lecserélem a css-t
        skinLink.setAttribute('href', './assets/css/'+skinDirector+'/'+pageCSS);
    } else {
        console.error('Mentés sikertelen:', await res.json());
        // Sikertelen mentés üzenet (API hiba esetén)
    }
}

getSkins();
