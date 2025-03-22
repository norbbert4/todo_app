// naptar.js

let currentDate = new Date();
const calendarGrid = document.getElementById('calendar-grid');
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const taskForm = document.getElementById('task-form');
const selectedDateInput = document.getElementById('selected-date');
const saveButton = document.querySelector('#save-button');
const goToTodosButton = document.querySelector('#go-to_todos');
const todoInput = document.querySelector('#title');
const userInfo = document.querySelector('#user-info');
const userCoinContainer = document.querySelector('.user-coin-container');
const usernameSpan = document.querySelector('#username');
const coinCountSpan = document.querySelector('#coin-count');

let userData = { user_ID: 0, token: '-', username: 'Ismeretlen felhasználó', coins: 0 };
if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));

const months = [
    "Január", "Február", "Március", "Április", "Május", "Június",
    "Július", "Augusztus", "Szeptember", "Október", "November", "December"
];

const apiUrl = 'http://localhost/todo_app/api/';

const check = async () => {
    if (userData.token.length > 0) {
        try {
            const response = await fetch(`${apiUrl}authentication/login.php?token=${userData.token}&user_id=${userData.user_ID}`);
            const data = await response.json();
            if (data.success === true) {
                const username = data.username || userData.username || 'Ismeretlen felhasználó';
                const coins = userData.coins !== undefined ? userData.coins : (data.coins || 0);
                userData.username = username;
                userData.coins = coins;
                localStorage.setItem('userData', JSON.stringify(userData));
                if (userInfo && usernameSpan && coinCountSpan) {
                    usernameSpan.textContent = username;
                    coinCountSpan.textContent = coins;
                } else {
                    console.error('A userInfo, usernameSpan vagy coinCountSpan elem nem található a DOM-ban!');
                }
                console.log('Autentikáció sikeres:', data);
            } else {
                console.log('Autentikáció sikertelen:', data);
                localStorage.removeItem('userData');
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Hiba az autentikáció során:', error);
            localStorage.removeItem('userData');
            window.location.href = 'login.html';
        }
    } else {
        console.log('Nincs token, átirányítás...');
        localStorage.removeItem('userData');
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

function populateMonthSelect() {
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
    monthSelect.value = currentDate.getMonth();
    console.log('Hónapok betöltve:', monthSelect.value);
}

function populateYearSelect() {
    const currentYear = currentDate.getFullYear();
    const startYear = currentYear - 10;
    const endYear = currentYear + 10;
    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;
    console.log('Évek betöltve:', yearSelect.value);
}

async function getTodoCount(dateStr) {
    const get_apiUrl = `${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&entityid=${dateStr}&count=1`;
    const res = await fetch(get_apiUrl);
    const resjson = await res.json();
    return resjson;
}

async function renderCalendar() {
    if (!calendarGrid) {
        console.error('Naptár rács (calendar-grid) nem található!');
        return;
    }
    console.log('Naptár rács létezik, törlöm a tartalmát...');
    calendarGrid.innerHTML = '';
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const monthYearText = `${months[month]} ${year}`;
    console.log('Naptár renderelése:', monthYearText);

    const firstDay = new Date(year, month, 1).getDay() || 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        calendarGrid.appendChild(emptyDay);
        console.log('Üres nap hozzáadva');
    }

    const datePromises = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        datePromises.push({ dateStr, day });
    }

    const todoCounts = await Promise.all(
        datePromises.map(async ({ dateStr }) => {
            const countResult = await getTodoCount(dateStr);
            return { dateStr, count: Number(countResult.body.CNT) };
        })
    );

    todoCounts.forEach(({ dateStr, count }, index) => {
        const day = index + 1;
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.setAttribute('id', `day_${dateStr}`);
        dayElement.textContent = day;

        const todosForDayElement = document.createElement('div');
        todosForDayElement.className = `todos-for-day ${count === 0 ? 'todos-for-day_hidden' : ''}`;
        todosForDayElement.textContent = count;
        dayElement.appendChild(todosForDayElement);

        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayElement.classList.add('today');
        }

        dayElement.onclick = (event) => {
            console.log(`Kattintás a ${day}. napra, dátum: ${dateStr}`);
            if (taskForm) {
                selectedDateInput.value = dateStr;
                const rect = dayElement.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                taskForm.style.position = 'absolute';
                taskForm.style.top = `${rect.bottom + scrollTop + 5}px`;
                taskForm.style.left = `${rect.left + scrollLeft}px`;
                taskForm.style.width = '320px';
                taskForm.style.display = 'block';
                console.log('Teendő űrlap megjelenítve:', dateStr, 'Pozíció:', { top: rect.bottom + scrollTop + 5, left: rect.left + scrollLeft });
            } else {
                console.error('Teendő űrlap (task-form) nem található!');
            }
        };

        calendarGrid.appendChild(dayElement);
        console.log(`Nap hozzáadva: ${day}, Teendők száma: ${count}`);
    });
}

function closeForm() {
    if (taskForm) {
        taskForm.style.display = 'none';
        startHourSelect.value = '';
        startMinuteSelect.value = '';
        console.log('Teendő űrlap elrejtve');
    } else {
        console.error('Teendő űrlap (task-form) nem található!');
    }
}

async function saveTodo() {
    const title = todoInput.value.trim();
    const date = selectedDateInput.value;
    const start_hour = startHourSelect.value;
    const start_minute = startMinuteSelect.value;
    const start_time = start_hour && start_minute ? `${start_hour}:${start_minute}` : null;

    if (title.length > 0) {
        const res = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, date, start_time })
        });
        todoInput.value = '';
        startHourSelect.value = '';
        startMinuteSelect.value = '';
        closeForm();
        await renderCalendar();
    }
}

todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        saveTodo();
    }
});

function goToTodos() {
    const date = selectedDateInput.value;
    location.replace(`todo.html?date=${date}`);
}

document.getElementById('prev-month').onclick = () => {
    console.log('Előző hónap gomb megnyomva');
    currentDate.setMonth(currentDate.getMonth() - 1);
    monthSelect.value = currentDate.getMonth();
    yearSelect.value = currentDate.getFullYear();
    renderCalendar();
};

document.getElementById('next-month').onclick = () => {
    console.log('Következő hónap gomb megnyomva');
    currentDate.setMonth(currentDate.getMonth() + 1);
    monthSelect.value = currentDate.getMonth();
    yearSelect.value = currentDate.getFullYear();
    renderCalendar();
};

monthSelect.onchange = () => {
    currentDate.setMonth(parseInt(monthSelect.value));
    currentDate.setFullYear(parseInt(yearSelect.value));
    renderCalendar();
};

yearSelect.onchange = () => {
    currentDate.setFullYear(parseInt(yearSelect.value));
    currentDate.setMonth(parseInt(monthSelect.value));
    renderCalendar();
};

saveButton.addEventListener('click', saveTodo);
goToTodosButton.addEventListener('click', goToTodos);

// Inicializálás
populateMonthSelect();
populateYearSelect();
renderCalendar();