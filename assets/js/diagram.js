document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost/todo_app/api/';
    let userData = { user_ID: 0, token: '-', username: '' };
    if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));

    const userInfo = document.querySelector('#user-info');
    const chartContainer = document.querySelector('.chart-container');
    const canvas = document.getElementById('todoChart');

    // Felhasználónév megjelenítése
    async function displayUserInfo() {
        if (userData.token.length > 0) {
            try {
                const response = await fetch(`${apiUrl}authentication/login.php?token=${userData.token}&user_id=${userData.user_ID}`);
                const data = await response.json();
                if (data.success === true) {
                    const username = userData.username || data.username || 'Ismeretlen felhasználó';
                    if (userInfo) {
                        userInfo.textContent = username;
                    }
                } else {
                    console.error('Autentikációs hiba:', data.message);
                    localStorage.removeItem('userData');
                    window.location.href = 'login.html';
                }
            } catch (error) {
                console.error('Hiba az autentikáció során:', error);
            }
        }
    }

    // Teendők lekérdezése és diagram renderelése
    async function fetchAndRenderChart() {
        const getApiUrl = `${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos`;
        try {
            const res = await fetch(getApiUrl);
            const resjson = await res.json();
            let todos = [];

            if (resjson.type === 'result') {
                todos = resjson.body;
            } else {
                console.error('Hiba a teendők lekérdezésekor:', resjson.message);
                if (resjson.message === 'Sikertelen autentikáció.') {
                    localStorage.removeItem('userData');
                    window.location.href = 'login.html';
                }
                renderNoTodosMessage();
                return;
            }

            // Teendők állapotának kiszámítása (csak Kész és Nincs kész)
            let completed = 0;
            let pending = 0;

            todos.forEach(todo => {
                if (todo.completed === 1 || todo.completed === "1") {
                    completed++;
                } else {
                    pending++;
                }
            });

            const todoData = {
                completed: completed,
                pending: pending
            };

            if (completed + pending === 0) {
                renderNoTodosMessage();
            } else {
                renderChart(todoData);
                renderLegend(todoData);
            }
        } catch (error) {
            console.error('Hiba az API hívás során:', error);
            localStorage.removeItem('userData');
            window.location.href = 'index.html';
            renderNoTodosMessage();
        }
    }

    // "Nincs teendő" üzenet renderelése
    function renderNoTodosMessage() {
        chartContainer.innerHTML = '<p style="color: #c0c0c0; font-size: 1.2rem; text-align: center;">Nincs teendő</p>';
        const legendContent = document.getElementById('legend-content');
        const totalCount = document.getElementById('total-count');
        legendContent.innerHTML = '';
        totalCount.textContent = '0 teendő';
    }

    // Diagram renderelése Chart.js-vel (csak Kész és Nincs kész)
    function renderChart(todoData) {
        const ctx = document.getElementById('todoChart').getContext('2d');
        const total = todoData.completed + todoData.pending;

        const todoChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Nincs kész', 'Kész'],
                datasets: [{
                    data: [todoData.pending, todoData.completed],
                    backgroundColor: [
                        '#aa3910', // Sötétpiros - Nincs kész
                        '#068148'  // Sötétzöld - Kész
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

    // Táblázat renderelése a diagram alatt (csak Kész és Nincs kész)
    function renderLegend(todoData) {
        const legendContent = document.getElementById('legend-content');
        const totalCount = document.getElementById('total-count');
        const total = todoData.completed + todoData.pending;

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
    }

    // Inicializálás
    displayUserInfo();
    fetchAndRenderChart();
});