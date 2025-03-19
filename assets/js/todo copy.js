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
let userData = { user_ID: 0, token: '-' };
if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));
const check = async () => {
    if (userData.token.length > 0) {
        fetch(`${apiUrl}authentication/login.php?token=${userData.token}&user_id=${userData.user_ID}`)
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    aside.innerHTML = '';
                    aside.remove();
                    if (userInfo) {
                        // localStorage-ból vesszük a nevet, ha az API nem adja
                        const username = userData.username || data.username || 'Ismeretlen felhasználó';
                        userInfo.textContent = username;
                    }
                    console.log(data);
                } else {
                    main.innerHTML = '';
                    main.remove();
                    nav.innerHTML = '';
                    nav.remove();
                    console.log(data);
                }
            })
            .catch(error => {
                console.error('Hiba az autentikáció során:', error);
            });
    }
};
check();

// -- Időválasztó inicializálása --
function initializeTimePicker() {
    const timePicker = document.getElementById('time-picker');

    // Óra select elem
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

    // Kettőspont
    const colon = document.createElement('span');
    colon.textContent = ':';

    // Perc select elem (5 perces lépésekben)
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

    // Beszúrás a time-picker div-be
    timePicker.appendChild(hourSelect);
    timePicker.appendChild(colon);
    timePicker.appendChild(minuteSelect);
}

// Időválasztó elemek deklarálása (miután inicializáltuk)
initializeTimePicker();
const startHourSelect = document.querySelector('select[name="start_hour"]');
const startMinuteSelect = document.querySelector('select[name="start_minute"]');

// -- Segédfüggvények --
const createTableRow = (todo, index) => {
    return `<tr data-id="${todo.id}">
                <td class="state-${todo.completed}">${index + 1}</td>
                <td class="state-${todo.completed}">${todo.title}</td>
                <td class="state-${todo.completed}">${todo.date}</td>
                <td class="state-${todo.completed}">${todo.start_time || '-'}</td>
                <td>
                    <button type="button" class="state-button-k state-k-button_${todo.completed}" data-action="complete" data-id="${todo.id}">•</button>
                    <button type="button" class="state-button-m state-m-button_${todo.completed}" data-action="uncomplete" data-id="${todo.id}">«</button>
                    <button type="button" class="delete-button" data-action="delete" data-id="${todo.id}">Ø</button>
                </td>
            </tr>`;
};

todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Megakadályozza a form alapértelmezett submit eseményét
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
        await todoState(id, 1);
    } else if (action === 'uncomplete') {
        await todoState(id, 0);
    }
});

async function deleteTodo(dID) {
    try {
        const res = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&entityid=${dID}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            console.log(`Teendő ${dID} törölve`);
            await renderTable(); // Frissíti a táblázatot
        } else {
            console.error('Törlés sikertelen:', await res.json());
        }
    } catch (error) {
        console.error('Hiba a DELETE kérés során:', error);
    }
}

// -- Fő függvények --
async function saveTodo() {
    const title = todoInput.value.trim();
    const start_hour = startHourSelect.value;
    const start_minute = startMinuteSelect.value;
    const start_time = start_hour && start_minute ? `${start_hour}:${start_minute}` : null;
    const date = dateObject.date === 'today' 
        ? new Date().toLocaleDateString("hu-HU").replaceAll('. ', '-').replace('.', '') 
        : (dateObject.date || new Date().toLocaleDateString("hu-HU").replaceAll('. ', '-').replace('.', ''));

    if (title.length > 0) {
        console.log("Mentés dátuma:", date);
        const res = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, date, start_time })
        });
        todoInput.value = '';
        startHourSelect.value = '';
        startMinuteSelect.value = '';
        renderTable();
    }
}

async function renderTable(date = '') {
    const get_apiUrl = `${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos`;
    try {
        const res = await fetch(get_apiUrl);
        const resjson = await res.json();
        let todos = [];
        if (resjson.type === 'result') {
            todos = resjson.body;
            console.log('Todos:', todos); // Debug: Nézzük meg, milyen adatokat ad vissza az API
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
            return;
        }

        let todosToRender = [];
        let todoCountValue = 0;
        const today = new Date().toISOString().split('T')[0]; // Mai dátum YYYY-MM-DD formátumban
        console.log('Today:', today); // Debug: Nézzük meg a mai dátumot

        if (dateObject.date === '') {
            // "Összes teendőim" nézet
            todosToRender = todos;
            header.textContent = 'Összes teendőim';
            todoCountValue = todos.length;
            todoInputContainer.style.display = 'none'; // Űrlap elrejtése
            saveButton.style.display = 'none';
        } else if (dateObject.date === 'today') {
            // "Mai teendőim" nézet
            todosToRender = todos.filter(todo => todo.date.substring(0, 10) === today);
            header.textContent = 'Mai teendőim';
            todoCountValue = todosToRender.length;
            todoInputContainer.style.display = 'flex'; // Űrlap megjelenítése
            saveButton.style.display = 'block';
            todoInput.placeholder = 'Mi lesz az új teendő?';
        } else {
            // Egyéb dátum nézet
            todosToRender = todos.filter(todo => todo.date.substring(0, 10) === dateObject.date);
            header.textContent = `Teendőim (${dateObject.date})`;
            todoCountValue = todosToRender.length;
            todoInputContainer.style.display = 'flex';
            saveButton.style.display = 'block';
            todoInput.placeholder = `Mi lesz ekkor a teendő? (${dateObject.date})`;
        }

        if (todayTodoCount) {
            todayTodoCount.textContent = `Teendőid száma: ${todoCountValue}`;
        }

        let tableContent = '';
        if (todosToRender.length === 0) {
            tableContent = '<tr><td colspan="5" style="text-align: center; color: #c0c0c0;">Nincs teendő</td></tr>';
        } else {
            todosToRender.forEach((todo, index) => tableContent += createTableRow(todo, index));
        }
        todoTable.innerHTML = tableContent;
    } catch (error) {
        console.error('Hiba az API hívás során:', error);
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
        if (todayTodoCount) {
            todayTodoCount.textContent = 'Teendőid száma: 0';
        }
        todoTable.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #c0c0c0;">Nincs teendő</td></tr>';
    }
}

async function todoState(id, completed) {
    await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&entityid=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
    });
    renderTable();
}

renderTable('2025-02-26');

// Mentés gomb eseményfigyelője
saveButton.addEventListener('click', saveTodo);