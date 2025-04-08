const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost/todo_app/api/'  // Ha localhost, akkor helyi API
    : 'https://todoapp.norbbert4.hu/api/';  // Ha éles környezet, akkor online API

console.log('API URL:', apiUrl);  // Debug üzenet az API URL ellenőrzéséhez

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

let userData = { user_ID: 0, token: '', username: 'Ismeretlen felhasználó', coins: 0 };
if (localStorage.getItem('userData') !== null) {
    userData = JSON.parse(localStorage.getItem('userData'));
}

const check = async () => {
    console.log('Ellenőrzés indul: ', userData);
    if (!userData || !userData.token || userData.token.length === 0 || !userData.user_ID || userData.user_ID <= 0) {
        console.warn('Nincs érvényes token vagy user_ID, átirányítás a bejelentkező oldalra.');
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${apiUrl}authentication/login.php?token=${userData.token}&user_id=${userData.user_ID}`);
        const data = await response.json();
        console.log('login.php válasza:', data);
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
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Hiba az autentikáció során:', error);
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
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

// Segédfüggvény a mentés üzenet megjelenítéséhez
function showSaveMessage(message, isSuccess) {
    const saveMessageDiv = document.querySelector('#save-message');
    
    saveMessageDiv.classList.remove('bg-green', 'bg-red');
    saveMessageDiv.style.display = 'none';
    
    saveMessageDiv.textContent = message;
    saveMessageDiv.classList.add(isSuccess ? 'bg-green' : 'bg-red');
    
    saveMessageDiv.style.animation = 'none';
    setTimeout(() => {
        saveMessageDiv.style.display = 'block';
        saveMessageDiv.style.animation = 'fadeInOut 3s forwards';
    }, 10);
}

// Segédfüggvény az üzenet megjelenítéséhez (most a save-message div-ben)
function showMessage(button, message) {
    const saveMessageDiv = document.querySelector('#save-message');
    
    saveMessageDiv.classList.remove('bg-green', 'bg-red');
    saveMessageDiv.style.display = 'none';
    
    saveMessageDiv.textContent = message;
    saveMessageDiv.classList.add('bg-red'); // Mindig piros, mert ez egy hibaüzenet
    
    saveMessageDiv.style.animation = 'none';
    setTimeout(() => {
        saveMessageDiv.style.display = 'block';
        saveMessageDiv.style.animation = 'fadeInOut 3s forwards';
    }, 10);
}

const createTableRow = (todo, index) => {
    const startTimeDisplay = (!todo.start_time || todo.start_time === '00:00:00') ? '-' : todo.start_time;
    return `<tr data-id="${todo.id}">
                <td class="state-${todo.completed}">${index + 1}</td>
                <td class="state-${todo.completed}">${todo.title}</td>
                <td class="state-${todo.completed}">${todo.date.substring(0, 10)}</td>
                <td class="state-${todo.completed}">${startTimeDisplay}</td>
                <td class="action-cell">
                    <button type="button" class="state-button-k state-k-button_${todo.completed}" data-action="complete" data-id="${todo.id}" title="Kész">•</button>
                    <button type="button" class="state-button-m state-m-button_${todo.completed}" data-action="uncomplete" data-id="${todo.id}" title="Felfüggesztés">«</button>
                    <button type="button" class="delete-button" data-action="delete" data-id="${todo.id}" title="Törlés">Ø</button>
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

async function saveTodo() {
    const title = todoInput.value.trim();
    const start_hour = startHourSelect.value;
    const start_minute = startMinuteSelect.value;
    const today = new Date().toISOString().split('T')[0];
    const date = dateObject.date === 'today' ? today : (dateObject.date || today);

    if (title.length === 0) {
        showSaveMessage('Sikertelen mentés!', false);
        return;
    }

    const todoData = {
        title,
        date
    };

    if (start_hour && start_minute && start_hour !== '' && start_minute !== '') {
        todoData.start_time = `${start_hour}:${start_minute}`;
    }

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
            showSaveMessage('Sikeresen elmentve!', true);
        } else {
            console.error('Mentés sikertelen:', await res.json());
            showSaveMessage('Sikertelen mentés!', false);
        }
    } catch (error) {
        console.error('Hiba a mentés során:', error);
        showSaveMessage('Sikertelen mentés!', false);
    }
}

async function renderTable() {
    const get_apiUrl = `${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&nocache=${Date.now()}`;
    try {
        const res = await fetch(get_apiUrl, { cache: 'no-store' });
        const resjson = await res.json();
        let todos = [];
        if (resjson.type === 'result') {
            todos = resjson.body;
            console.log('API válasz (todos):', todos); // Naplózás
        } else {
            console.error('Hiba a teendők lekérdezésekor:', resjson.message);
            if (resjson.message === 'Sikertelen autentikáció.') {
                localStorage.removeItem('userData');
                window.location.href = 'index.html';
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

        console.log('todosToRender:', todosToRender); // Naplózás

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
        todoTable.innerHTML = tableContent;
    } catch (error) {
        console.error('Hiba az API hívás során:', error);
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
    }
}

async function todoState(id, completed, button) {
    try {
        if (completed === 1) {
            const resTodo = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&entityid=${id}`);
            const todoData = await resTodo.json();

            if (todoData.type === 'result' && todoData.body) {
                const todo = todoData.body[0];
                const { date, start_time, completed: currentCompleted } = todo;

                if (currentCompleted === 1 || currentCompleted === "1") {
                    console.log(`A teendő (${id}) már ki van pipálva.`);
                } else {
                    const currentDateTime = new Date();
                    const today = new Date().toISOString().split('T')[0];

                    if (dateObject.date === 'today') {
                        if (start_time && start_time !== '00:00:00') {
                            const currentTime = currentDateTime.toTimeString().split(' ')[0];
                            if (currentTime < start_time) {
                                showMessage(button, `Nem pipálható ki ${start_time}-ig!`);
                                return;
                            }
                        }
                    } else if (dateObject.date) {
                        const todoDateTime = new Date(`${date}T${start_time || '00:00:00'}`);
                        if (currentDateTime < todoDateTime) {
                            const formattedDate = date;
                            showMessage(button, `Nem pipálható ki ${formattedDate} ${start_time || '00:00'}-ig!`);
                            return;
                        }
                    } else {
                        const todoDateTime = new Date(`${date}T${start_time || '00:00:00'}`);
                        if (currentDateTime < todoDateTime) {
                            const formattedDate = date;
                            showMessage(button, `Nem pipálható ki ${formattedDate} ${start_time || '00:00'}-ig!`);
                            return;
                        }
                    }
                }
            } else {
                showMessage(button, 'Hiba történt, próbáld újra később!');
                return;
            }
        }

        const res = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&entityid=${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });

        const data = await res.json();
        if (data.success === true) {
            if (data.coins !== undefined) {
                userData.coins = data.coins;
                coinCountSpan.textContent = userData.coins;
                localStorage.setItem('userData', JSON.stringify(userData));
            }
            await renderTable();
        } else {
            showMessage(button, 'Hiba történt: ' + data.message);
        }
    } catch (error) {
        showMessage(button, 'Hiba történt, próbáld újra később!');
    }
}

saveButton.addEventListener('click', saveTodo);