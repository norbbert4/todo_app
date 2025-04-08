const verifyApiUrl = 'api/authentication/login.php';
const codeInput = document.getElementById('code');
const verifyButton = document.getElementById('verify-button');
const codeInfo = document.getElementById('code-info');

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
            showMessage(codeInfo, 'Sikeres hitelesítés!', 'green');
            
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
            }, 2000); // Redirect after 2 seconds
        } else {
            showMessage(codeInfo, data.error || 'Érvénytelen kód!', 'red');
        }
    } catch (error) {
        console.error('Hiba:', error);
        showMessage(codeInfo, 'Hiba történt a kód ellenőrzése során: ' + error.message, 'red');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('verify-2fa-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent page reload
        verifyCode();
    });
});