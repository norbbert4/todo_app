const apiUrl = 'http://localhost/todo_app/api/';

const dateObject = { date: '' };
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
if (params.hasOwnProperty("date")) dateObject.date = params.date;

const todoInput = document.querySelector('main header input[name="todo"]');
const saveButton = document.querySelector('main header button');
const header = document.querySelector('main header h1');
const todoTable = document.querySelector('#todo-content');
const todayTodoCount = document.querySelector('#today-todo-count');
const main = document.querySelector('main');
const aside = document.querySelector('aside');
const nav = document.querySelector('nav');
const todoInputContainer = document.querySelector('#todo-input-container');
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
                    await renderTable();
                } else {
                    console.error('A userInfo elem nem található a DOM-ban!');
                }
            } else {
                console.error('Autentikációs hiba:', data.message);
                localStorage.removeItem('userData');
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Hiba az autentikáció során:', error);
            localStorage.removeItem('userData');
            window.location.href = 'login.html';
        }
    } else {
        console.warn('Nincs érvényes token vagy user_ID, átirányítás a bejelentkező oldalra.');
        window.location.href = 'login.html';
    }
};

// Várjuk meg, amíg a DOM betöltődik
document.addEventListener('DOMContentLoaded', () => {
    check();
});

// Időválasztó inicializálása
function initializeTimePicker() {
    const timePicker = document.getElementById('time-picker');
    const hourSelect = document.createElement('select');
    hourSelect.name = 'start_hour';
    hourSelect.id = 'start-hour';
    const defaultHourOption = document.createElement('option');
    defaultHourOption.value = '';
    defaultHourOption.disabled = true;
    defaultHourOption.selected = true;
    defaultHourOption.textContent = 'Óra';
    hourSelect.appendChild(defaultHourOption);
    for (let i = 0; i <= 23; i++) {
        const option = document.createElement('option');
        option.value = i.toString().padStart(2, '0');
        option.textContent = i.toString().padStart(2, '0');
        hourSelect.appendChild(option);
    }
    const colon = document.createElement('span');
    colon.textContent = ':';
    const minuteSelect = document.createElement('select');
    minuteSelect.name = 'start_minute';
    minuteSelect.id = 'start-minute';
    const defaultMinuteOption = document.createElement('option');
    defaultMinuteOption.value = '';
    defaultMinuteOption.disabled = true;
    defaultMinuteOption.selected = true;
    defaultMinuteOption.textContent = 'Perc';
    minuteSelect.appendChild(defaultMinuteOption);
    for (let i = 0; i < 60; i += 5) {
        const option = document.createElement('option');
        option.value = i.toString().padStart(2, '0');
        option.textContent = i.toString().padStart(2, '0');
        minuteSelect.appendChild(option);
    }
    timePicker.appendChild(hourSelect);
    timePicker.appendChild(colon);
    timePicker.appendChild(minuteSelect);
}

initializeTimePicker();
const startHourSelect = document.querySelector('select[name="start_hour"]');
const startMinuteSelect = document.querySelector('select[name="start_minute"]');

// Inicializáláskor alapból elrejtjük az űrlapot
todoInputContainer.style.display = 'none';
saveButton.style.display = 'none';

// Segédfüggvény az üzenet megjelenítéséhez
function showMessage(button, message) {
    // Az üzenetet a "Teendő" oszlop (második oszlop) fölé helyezzük
    const row = button.closest('tr'); // A gombot tartalmazó sor
    const todoCell = row.querySelector('td:nth-child(2)'); // A második oszlop (Teendő oszlop)

    // Ellenőrizzük, hogy van-e már üzenet, ha igen, eltávolítjuk
    const existingMessage = todoCell.querySelector('.error-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Új üzenet elem létrehozása
    const messageElement = document.createElement('span');
    messageElement.classList.add('error-message');
    messageElement.textContent = message;

    // Üzenet hozzáadása a "Teendő" oszlophoz
    todoCell.appendChild(messageElement);

    // 3 másodperc után eltűnik az üzenet
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}
// Segédfüggvények
const createTableRow = (todo, index) => {
    const startTimeDisplay = (!todo.start_time || todo.start_time === '00:00:00') ? '-' : todo.start_time;
    return `<tr data-id="${todo.id}">
                <td class="state-${todo.completed}">${index + 1}</td>
                <td class="state-${todo.completed}">${todo.title}</td>
                <td class="state-${todo.completed}">${todo.date.substring(0, 10)}</td>
                <td class="state-${todo.completed}">${startTimeDisplay}</td>
                <td class="action-cell">
                    <button type="button" class="state-button-k state-k-button_${todo.completed}" data-action="complete" data-id="${todo.id}">•</button>
                    <button type="button" class="state-button-m state-m-button_${todo.completed}" data-action="uncomplete" data-id="${todo.id}">«</button>
                    <button type="button" class="delete-button" data-action="delete" data-id="${todo.id}">Ø</button>
                </td>
            </tr>`;
};

todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        saveTodo();
    }
});

todoTable.addEventListener('click', async (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const id = button.getAttribute('data-id');
    const action = button.getAttribute('data-action');

    if (action === 'delete') {
        await deleteTodo(id);
    } else if (action === 'complete') {
        await todoState(id, 1, button);
    } else if (action === 'uncomplete') {
        await todoState(id, 0, button);
    }
});

async function deleteTodo(dID) {
    try {
        const res = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&entityid=${dID}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            console.log(`Teendő ${dID} törölve`);
            await renderTable();
        } else {
            console.error('Törlés sikertelen:', await res.json());
        }
    } catch (error) {
        console.error('Hiba a DELETE kérés során:', error);
    }
}

// Fő függvények
async function saveTodo() {
    const title = todoInput.value.trim();
    const start_hour = startHourSelect.value;
    const start_minute = startMinuteSelect.value;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const date = dateObject.date === 'today' ? today : (dateObject.date || today);

    if (title.length === 0) {
        console.error("A teendő címe nem lehet üres!");
        return;
    }

    const todoData = {
        title,
        date
    };

    if (start_hour && start_minute && start_hour !== '' && start_minute !== '') {
        todoData.start_time = `${start_hour}:${start_minute}`;
    }

    console.log("Mentés adatai:", todoData);

    try {
        const res = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todoData)
        });

        if (res.ok) {
            todoInput.value = '';
            startHourSelect.value = '';
            startMinuteSelect.value = '';
            await renderTable();
        } else {
            console.error('Mentés sikertelen:', await res.json());
        }
    } catch (error) {
        console.error('Hiba a mentés során:', error);
    }
}

async function renderTable() {
    const get_apiUrl = `${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&nocache=${Date.now()}`;
    console.log('GET kérés URL:', get_apiUrl); // Naplózás a hibakereséshez
    try {
        const res = await fetch(get_apiUrl, { cache: 'no-store' });
        const resjson = await res.json();
        console.log('GET válasz:', resjson); // Naplózás a hibakereséshez
        let todos = [];
        if (resjson.type === 'result') {
            todos = resjson.body;
            console.log('Frissített teendők:', todos);
        } else {
            console.error('Hiba a teendők lekérdezésekor:', resjson.message);
            if (resjson.message === 'Sikertelen autentikáció.') {
                localStorage.removeItem('userData');
                window.location.href = 'login.html';
            }
            if (todayTodoCount) {
                todayTodoCount.textContent = 'Teendőid száma: 0';
            }
            todoTable.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #c0c0c0;">Nincs teendő</td></tr>';
        }

        let todosToRender = [];
        let todoCountValue = 0;
        const today = new Date().toISOString().split('T')[0];

        if (dateObject.date === '') {
            todosToRender = todos;
            header.textContent = 'Összes teendőim';
            todoCountValue = todos.length;
            todoInputContainer.style.display = 'none';
            saveButton.style.display = 'none';
        } else if (dateObject.date === 'today') {
            todosToRender = todos.filter(todo => todo.date.substring(0, 10) === today);
            header.textContent = 'Mai teendőim';
            todoCountValue = todosToRender.length;
            todoInputContainer.style.display = 'flex';
            saveButton.style.display = 'block';
            todoInput.placeholder = 'Mi lesz a mai teendő?';
        } else {
            todosToRender = todos.filter(todo => todo.date.substring(0, 10) === dateObject.date);
            header.textContent = `Teendőim (${dateObject.date})`;
            todoCountValue = todosToRender.length;
            todoInputContainer.style.display = 'none';
            saveButton.style.display = 'none';
        }

        if (todayTodoCount) {
            todayTodoCount.textContent = `Teendőid száma: ${todoCountValue}`;
            todayTodoCount.style.display = 'block';
        }

        let tableContent = '';
        if (todosToRender.length === 0) {
            tableContent = '<tr><td colspan="5" style="text-align: center; color: #c0c0c0;">Nincs teendő</td></tr>';
        } else {
            todosToRender.forEach((todo, index) => {
                tableContent += createTableRow(todo, index);
            });
        }
        console.log('Új táblázat tartalom:', tableContent); // Naplózás a hibakereséshez
        todoTable.innerHTML = tableContent; // Biztosítjuk, hogy a táblázat frissüljön
    } catch (error) {
        console.error('Hiba az API hívás során:', error);
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
    }
}

async function todoState(id, completed, button) {
    try {
        console.log(`PATCH kérés indítása: id=${id}, completed=${completed}`);

        // Ha kipipálni szeretnénk (completed = 1), ellenőrizzük az időt
        if (completed === 1) {
            // Lekérjük a teendő adatait az idő ellenőrzéséhez
            const resTodo = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&entityid=${id}`);
            const todoData = await resTodo.json();

            if (todoData.type === 'result' && todoData.body) {
                const todo = todoData.body[0]; // Az API egy tömböt ad vissza
                const { date, start_time, completed: currentCompleted } = todo;

                // Ha már kipipálták, nem kell időellenőrzés, mert az API nem ad újabb coint
                if (currentCompleted === 1 || currentCompleted === "1") {
                    console.log(`A teendő (${id}) már ki van pipálva.`);
                } else {
                    // Aktuális idő
                    const currentDateTime = new Date();
                    const today = new Date().toISOString().split('T')[0]; // Pl. "2025-03-21"

                    // Időellenőrzés a dateObject.date alapján
                    if (dateObject.date === 'today') {
                        // Csak a start_time-ot nézzük az aktuális napra
                        if (start_time && start_time !== '00:00:00') {
                            const currentTime = currentDateTime.toTimeString().split(' ')[0]; // Pl. "17:50:00"
                            if (currentTime < start_time) {
                                console.error(`A teendő (${id}) még nem pipálható ki, mert a mai kezdési idő (${start_time}) még nem érkezett el! Aktuális idő: ${currentTime}`);
                                showMessage(button, `Nem pipálható ki ${start_time}-ig!`);
                                return;
                            }
                        }
                    } else if (dateObject.date) {
                        // Konkrét nap (pl. "2025-03-22") esetén a date és start_time együtt
                        const todoDateTime = new Date(`${date}T${start_time || '00:00:00'}`);
                        if (currentDateTime < todoDateTime) {
                            console.error(`A teendő (${id}) még nem pipálható ki, mert a kezdési idő (${date} ${start_time || '00:00'}) még nem érkezett el! Aktuális idő: ${currentDateTime}`);
                            // Rövidebb üzenet: csak a dátum és idő, de a dátumot formázzuk
                            const formattedDate = date; // Pl. "2025-03-22"
                            showMessage(button, `Nem pipálható ki ${formattedDate} ${start_time || '00:00'}-ig!`);
                            return;
                        }
                    } else {
                        // Ha nincs konkrét dátum (összes teendő), akkor a date és start_time alapján ellenőrizünk
                        const todoDateTime = new Date(`${date}T${start_time || '00:00:00'}`);
                        if (currentDateTime < todoDateTime) {
                            console.error(`A teendő (${id}) még nem pipálható ki, mert a kezdési idő (${date} ${start_time || '00:00'}) még nem érkezett el! Aktuális idő: ${currentDateTime}`);
                            // Rövidebb üzenet: csak a dátum és idő
                            const formattedDate = date; // Pl. "2025-03-22"
                            showMessage(button, `Nem pipálható ki ${formattedDate} ${start_time || '00:00'}-ig!`);
                            return;
                        }
                    }
                }
            } else {
                console.error('Hiba a teendő adatainak lekérdezésekor:', todoData);
                showMessage(button, 'Hiba történt, próbáld újra később!');
                return;
            }
        }

        // PATCH kérés az állapot frissítésére
        const res = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&entityid=${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });

        const data = await res.json();
        console.log('PATCH válasz:', data);
        if (data.success === true) {
            // Coin frissítése az API-ból
            if (data.coins !== undefined) {
                userData.coins = data.coins;
                console.log(`Coinok frissítése az API-ból: ${userData.coins}`);
                if (coinCountSpan) {
                    coinCountSpan.textContent = userData.coins;
                } else {
                    console.error('A coinCountSpan elem nem található a DOM-ban a todoState-ben!');
                }
                localStorage.setItem('userData', JSON.stringify(userData));
            } else {
                console.warn('Az API nem küldött vissza coins értéket.');
            }
            await renderTable();
        } else {
            console.error('Hiba a teendő állapotának frissítésekor:', data.message);
            showMessage(button, 'Hiba történt: ' + data.message);
        }
    } catch (error) {
        console.error('Hiba a PATCH kérés során:', error);
        showMessage(button, 'Hiba történt, próbáld újra később!');
    }
}

renderTable();

saveButton.addEventListener('click', saveTodo);