const verifyApiUrl = 'api/authentication/login.php';
const codeInput = document.getElementById('code');
const verifyButton = document.getElementById('verify-button');
const codeInfo = document.getElementById('code-info');
const emailInfo = document.getElementById('email-info');

const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session_id');

const verifyCode = async () => {
    const code = codeInput.value;

    try {
        const response = await fetch(verifyApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id: sessionId, code }),
        });

        if (!response.ok) {
            throw new Error('Hálózati hiba: ' + response.statusText);
        }

        const data = await response.json();
        console.log('Verify response:', data);

        if (data.success) {
            codeInfo.classList.add('bg-green');
            codeInfo.textContent = 'Sikeres hitelesítés!';
            
            const pendingLogin = sessionStorage.getItem('pending_login');
            let username = '';
            let password = '';
            if (pendingLogin) {
                const pendingData = JSON.parse(pendingLogin);
                username = pendingData.username || '';
                password = pendingData.password || '';
                sessionStorage.removeItem('pending_login');
            }

            const updatedUserData = {
                user_ID: data.userData.user_ID,
                token: data.userData.token,
                username: username,
                password: password,
                coins: 0
            };
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            setTimeout(() => {
                console.log('Átirányítás a todo.html-re...');
                window.location.href = "./todo.html";
            }, 2000);
        } else {
            codeInfo.classList.add('bg-red');
            codeInfo.textContent = data.error || 'Érvénytelen kód!';
        }
    } catch (error) {
        console.error('Hiba:', error);
        codeInfo.classList.add('bg-red');
        codeInfo.textContent = 'Hiba történt a kód ellenőrzése során: ' + error.message;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (sessionId) {
        emailInfo.classList.add('bg-green');
        emailInfo.textContent = 'A kódot elküldtük az e-mail címedre. Kérjük, ellenőrizd a postafiókodat!';
    } else {
        emailInfo.classList.add('bg-red');
        emailInfo.textContent = 'Hiba: Érvénytelen session.';
    }

    document.getElementById('verify-2fa-form').addEventListener('submit', function(event) {
        event.preventDefault();
        verifyCode();
    });
});