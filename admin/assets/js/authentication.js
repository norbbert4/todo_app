export const auth = () => {

    const htmlBody = document.querySelector('body');
    const loggedUser = document.querySelector('.logged');
    
    let userData = { token: '' };
    if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));
    
    if (userData.token.length > 0) {
    
        fetch('../api/authentication/authentication.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // ha van jogosultságunk, akkor ...
                console.log('Sikeres autentikáció');
                htmlBody.setAttribute('style', 'display: grid;');
                loggedUser.textContent = userData.user_name;
            } else {
                // ha nincs jogosultságunk, akkor ...
                console.log('Sikertelen autentikáció');
                htmlBody.setAttribute('style', 'display: grid;');
                htmlBody.innerHTML = '<div style="color: red;">Nincs jogosultságod az oldal megtekintéséhez!</div>';
            }
        })
        .catch(error => console.error('Hiba:', error));
    
    } else {
        htmlBody.setAttribute('style', 'display: grid;');
        htmlBody.innerHTML = '<div style="color: red;">Nincs jogosultságod az oldal megtekintéséhez!</div>';
    }
}
