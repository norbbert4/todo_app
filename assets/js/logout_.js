const userData = JSON.parse(localStorage.getItem('userData'));
localStorage.clear();
window.location.href = "https://todoapp.norbbert4.hu/api/authentication/logout.php?userid="+userData.user_ID;
