const userData = JSON.parse(localStorage.getItem('userData'));
localStorage.clear();
window.location.href = "../api/authentication/logout.php?userid="+userData.user_ID;