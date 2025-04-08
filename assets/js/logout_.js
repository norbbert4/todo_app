const userData = JSON.parse(localStorage.getItem('userData')) || {};
if (!userData.user_ID) {
    console.error("User ID not found. Cannot log out.");
    // Optionally redirect to login page
    window.location.href = "/index.html";
} else {
    const apiUrl = location.hostname === 'localhost' ? 'http://localhost/todo_app/api/' : 'https://todoapp.norbbert4.hu/api/';
    window.location.href = `${apiUrl}authentication/logout.php?userid=${userData.user_ID}`;
}