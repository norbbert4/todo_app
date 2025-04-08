// diagram.js

//const apiUrl = 'http://localhost/todo_app/api/';

const apiUrl = (location.hostname === 'localhost')
    ? 'http://localhost/todo_app/api/'
    : `${location.protocol}//${location.hostname}/api/`;


let userData = { user_ID: 0, token: '-', username: '', coins: 0 };
if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));

const userInfo = document.querySelector('#user-info');
const usernameSpan = document.querySelector('#username');
const coinCountSpan = document.querySelector('#coin-count');
const chartContainer = document.querySelector('.chart-container');
const canvas = document.getElementById('todoChart');

// Debug: Ellenőrizzük a userData tartalmát
console.log('userData a betöltéskor:', userData);

// Felhasználónév és coinok megjelenítése
const check = async () => {
    if (userData.token.length > 0) {
        try {
            const response = await fetch(`${apiUrl}authentication/login.php?token=${userData.token}&user_id=${userData.user_ID}`);
            const data = await response.json();
            console.log('Check API válasz:', JSON.stringify(data, null, 2)); // Debug: Részletes válasz
            if (data.success === true) {
                const username = data.username || userData.username || 'Ismeretlen felhasználó';
                const coins = data.coins || 0; // Mindig az API-tól kérjük a coin-okat
                userData.username = username;
                userData.coins = coins;
                localStorage.setItem('userData', JSON.stringify(userData));
                if (userInfo && usernameSpan && coinCountSpan) {
                    usernameSpan.textContent = username;
                    coinCountSpan.textContent = coins;
                } else {
                    console.error('A userInfo, usernameSpan vagy coinCountSpan elem nem található a DOM-ban!');
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
        console.log('Nincs token, átirányítás...');
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
    }
};

// Teendők lekérdezése és diagram renderelése
const fetchAndRenderChart = async () => {
    // Módosítva: Az API végpontot a todo.js alapján állítjuk be
    const getApiUrl = `${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&nocache=${Date.now()}`;
    try {
        const res = await fetch(getApiUrl);
        if (!res.ok) {
            throw new Error(`HTTP hiba! Státusz: ${res.status}`);
        }
        const resjson = await res.json();
        console.log('Teendők API válasz:', JSON.stringify(resjson, null, 2)); // Debug: Részletes válasz
        let todos = [];

        if (resjson.type === 'result') {
            todos = resjson.body || [];
        } else {
            console.error('Hiba a teendők lekérdezésekor:', resjson.message);
            renderNoTodosMessage();
            return;
        }

        let completed = 0;
        let pending = 0;

        todos.forEach(todo => {
            console.log('Todo elem:', todo); // Debug: Ellenőrizzük a todo objektumokat
            if (todo.completed === 1 || todo.completed === "1") {
                completed++;
            } else {
                pending++;
            }
        });

        console.log('Completed:', completed, 'Pending:', pending); // Debug: Ellenőrizzük a számolást

        const todoData = {
            completed: completed,
            pending: pending
        };

        if (completed + pending === 0) {
            console.log('Nincs teendő, renderNoTodosMessage hívása');
            renderNoTodosMessage();
        } else {
            console.log('Teendők vannak, renderChart és renderLegend hívása');
            renderChart(todoData);
            renderLegend(todoData);
        }
    } catch (error) {
        console.error('Hiba az API hívás során:', error);
        renderNoTodosMessage();
    }
};

function renderNoTodosMessage() {
    if (chartContainer) {
        chartContainer.innerHTML = '<p style="color:rgb(255, 0, 0); font-size: 1.2rem; text-align: center;">Nincs teendő</p>';
    } else {
        console.error('A chartContainer elem nem található a DOM-ban!');
    }
    const legendContent = document.getElementById('legend-content');
    const totalCount = document.getElementById('total-count');
    if (legendContent && totalCount) {
        legendContent.innerHTML = '';
        totalCount.textContent = '0 teendő';
    } else {
        console.error('A legendContent vagy totalCount elem nem található a DOM-ban!');
    }
}

function renderChart(todoData) {
    if (!canvas) {
        console.error('A todoChart canvas elem nem található a DOM-ban!');
        return;
    }
    const ctx = canvas.getContext('2d');
    const total = todoData.completed + todoData.pending;

    const todoChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Nincs kész', 'Kész'],
            datasets: [{
                data: [todoData.pending, todoData.completed],
                backgroundColor: [
                    '#aa3910',
                    '#068148'
                ],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(39, 39, 39, 0.95)',
                    titleFont: { family: 'Roboto', size: 14 },
                    bodyFont: { family: 'Roboto', size: 12 },
                    cornerRadius: 10,
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} teendő (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '50%'
        }
    });
}

function renderLegend(todoData) {
    const legendContent = document.getElementById('legend-content');
    const totalCount = document.getElementById('total-count');
    const total = todoData.completed + todoData.pending;

    if (legendContent && totalCount) {
        const data = [
            { label: 'Nincs kész', count: todoData.pending },
            { label: 'Kész', count: todoData.completed }
        ];

        let tableContent = '';
        data.forEach(item => {
            const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
            tableContent += `
                <tr>
                    <td>${item.label}</td>
                    <td>${item.count} teendő</td>
                    <td>${percentage}%</td>
                </tr>
            `;
        });

        legendContent.innerHTML = tableContent;
        totalCount.textContent = `${total} teendő`;
    } else {
        console.error('A legendContent vagy totalCount elem nem található a DOM-ban!');
    }
}

// Várjuk meg, amíg a DOM betöltődik
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded esemény kiváltva');
    check();
    fetchAndRenderChart();
});