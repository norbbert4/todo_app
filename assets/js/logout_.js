const userData = JSON.parse(localStorage.getItem('userData'));
localStorage.clear();
window.location.href = "http://localhost/todo_app/api/authentication/logout.php?userid="+userData.user_ID;
