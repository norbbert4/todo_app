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

//const apiUrl = 'http://localhost/todo_app/api/';

// Ellenőrizzük, hogy localhost vagy éles környezetben vagyunk
const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost/todo_app/api/' : 'https://todoapp.norbbert4.hu/api/';


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

// Üzenetkezelő a naptár frissítéséhez
window.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_CALENDAR') {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        updateTodoCounts(year, month, daysInMonth);
        console.log('Naptár frissítve az UPDATE_CALENDAR üzenet hatására');
    }
});

// Várjuk meg, amíg a DOM betöltődik
document.addEventListener('DOMContentLoaded', () => {
    check();
});

document.addEventListener('click', (event) => {
    if (taskForm && taskForm.style.display === 'block') {
        const isClickInsideForm = taskForm.contains(event.target);
        const isClickOnDay = event.target.closest('.day');
        if (!isClickInsideForm && !isClickOnDay) {
            closeForm();
            console.log('Kattintás a task-form-on kívül, elrejtve');
        }
    }
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

// Naponta történő lekérdezés
async function getTodoCount(dateStr) {
    const get_apiUrl = `${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&date=${dateStr}`;
    try {
        const res = await fetch(get_apiUrl);
        const resjson = await res.json();
        console.log(`API válasz a ${dateStr} dátumra:`, resjson); // Hibakereséshez
        if (resjson.type === 'result' && Array.isArray(resjson.body)) {
            // Szűrjük a teendőket, hogy csak az adott napra vonatkozók legyenek
            const todosForDate = resjson.body.filter(todo => {
                const todoDate = todo.date.substring(0, 10);
                return todoDate === dateStr;
            });
            return todosForDate.length || 0;
        } else {
            console.error(`Hiba a teendők lekérdezésekor (${dateStr}):`, resjson.message);
            return 0;
        }
    } catch (error) {
        console.error(`Hiba a teendők lekérdezésekor (${dateStr}):`, error);
        return 0;
    }
}
// Segédfüggvény a helyes "-ra/-re" ragozás meghatározására
function getCaseSuffix(day) {
    if (day === 1) return '-jére';
    if (day === 2) return '-ára';
    if (day === 3) return '-ára';
    if (day === 10 || day === 20 || day === 30) return '-ra';

    const lastDigit = day % 10;
    const lastTwoDigits = day % 100;

    if (lastTwoDigits === 10 || lastTwoDigits === 20 || lastTwoDigits === 30) return '-ra';

    if (lastDigit === 0) return '-re';
    if (lastDigit === 1) return '-re';
    if (lastDigit === 2) return '-ra';
    if (lastDigit === 3) return '-ra';
    if (lastDigit === 4) return '-re';
    if (lastDigit === 5) return '-re';
    if (lastDigit === 6) return '-ra';
    if (lastDigit === 7) return '-re';
    if (lastDigit === 8) return '-ra';
    if (lastDigit === 9) return '-re';

    return '-ra';
}

async function renderCalendar() {
    if (!calendarGrid) {
        console.error('Naptár rács (calendar-grid) nem található!');
        return;
    }

    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    const monthYearText = `${months[month]} ${year}`;
    console.log('Naptár renderelése:', monthYearText);

    const firstDay = new Date(year, month, 1).getDay() || 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Ellenőrizzük, hogy a naptár már létezik-e, és ugyanazt a hónapot rendereljük-e
    const currentMonthYear = calendarGrid.getAttribute('data-month-year');
    if (currentMonthYear === `${month}-${year}`) {
        // Ha ugyanaz a hónap, csak a teendők számát frissítjük
        updateTodoCounts(year, month, daysInMonth);
        return;
    }

    // Ha új hónap, töröljük a tartalmat és újraépítjük
    calendarGrid.innerHTML = '';
    calendarGrid.setAttribute('data-month-year', `${month}-${year}`);

    // Üres napok hozzáadása az első nap előtt
    for (let i = 1; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        calendarGrid.appendChild(emptyDay);
        console.log('Üres nap hozzáadva');
    }

    const today = new Date();
    const datePromises = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        datePromises.push({ dateStr, day });

        // Azonnal rendereljük a napokat teendők nélkül
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.setAttribute('id', `day_${dateStr}`);
        dayElement.textContent = day;

        // Hozzáadunk egy üres todos-for-day elemet, amit később frissítünk
        const todosForDayElement = document.createElement('div');
        todosForDayElement.className = 'todos-for-day todos-for-day_hidden';
        dayElement.appendChild(todosForDayElement);

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayElement.classList.add('today');
        }

        dayElement.onclick = (event) => {
            console.log(`Kattintás a ${day}. napra, dátum: ${dateStr}`);
            if (taskForm) {
                selectedDateInput.value = dateStr;
                taskForm.style.display = 'block';

                const saveMessage = document.getElementById('save-message');
                saveMessage.style.display = 'none';
                saveMessage.classList.remove('success', 'error');
                saveMessage.textContent = '';

                const formTitle = taskForm.querySelector('h3');
                if (formTitle) {
                    const monthName = months[month];
                    const suffix = getCaseSuffix(day);
                    formTitle.textContent = `Mi lesz a teendő ${monthName} ${day}.${suffix}?`;
                } else {
                    console.error('A task-form h3 eleme nem található!');
                }

                const rect = dayElement.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

                const windowHeight = window.innerHeight;
                const windowWidth = window.innerWidth;
                const formHeight = taskForm.offsetHeight;
                const formWidth = taskForm.offsetWidth;
                const navbarHeight = 80;

                const minTop = navbarHeight + 10;
                const maxTop = windowHeight - formHeight - 10;
                const minLeft = 10;
                const maxLeft = windowWidth - formWidth - 10;

                let topPosition = rect.bottom + scrollTop + 5;
                let leftPosition = rect.left + scrollLeft + (rect.width / 2) - (formWidth / 2);

                if (topPosition + formHeight > windowHeight - 10) {
                    topPosition = rect.top + scrollTop - formHeight - 5;
                }
                if (topPosition < minTop) {
                    topPosition = minTop;
                }
                if (leftPosition < minLeft) {
                    leftPosition = minLeft;
                }
                if (leftPosition > maxLeft) {
                    leftPosition = maxLeft;
                }

                taskForm.style.top = `${topPosition}px`;
                taskForm.style.left = `${leftPosition}px`;
                taskForm.style.transform = 'none';

                console.log('Teendő űrlap megjelenítve:', dateStr, 'Pozíció:', { top: topPosition, left: leftPosition });
            } else {
                console.error('Teendő űrlap (task-form) nem található!');
            }
        };
        calendarGrid.appendChild(dayElement);
        console.log(`Nap hozzáadva: ${day}`);
    }

    // Aszinkron módon frissítjük a teendők számát
    updateTodoCounts(year, month, daysInMonth);
}

async function updateTodoCounts(year, month, daysInMonth) {
    const datePromises = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        datePromises.push({ dateStr, day });
    }

    // API-hívások csoportosítása (batch-ek) a memória terhelésének csökkentése érdekében
    const batchSize = 10;
    for (let i = 0; i < datePromises.length; i += batchSize) {
        const batch = datePromises.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(async ({ dateStr }) => {
                const count = await getTodoCount(dateStr);
                return { dateStr, count };
            })
        );

        // Frissítjük a már létező napokat a teendők számával
        batchResults.forEach(({ dateStr, count }) => {
            const dayElement = document.getElementById(`day_${dateStr}`);
            if (dayElement) {
                const todosForDayElement = dayElement.querySelector('.todos-for-day');
                if (todosForDayElement) {
                    todosForDayElement.className = `todos-for-day ${count === 0 ? 'todos-for-day_hidden' : ''}`;
                    todosForDayElement.textContent = count;
                }
            }
        });
    }
}

function closeForm() {
    if (taskForm) {
        taskForm.style.display = 'none';
        startHourSelect.value = '';
        startMinuteSelect.value = '';
        todoInput.value = '';
        const saveMessage = document.getElementById('save-message');
        saveMessage.style.display = 'none';
        saveMessage.classList.remove('success', 'error');
        saveMessage.textContent = '';
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

    const saveMessage = document.getElementById('save-message');
    saveMessage.style.display = 'none';
    saveMessage.classList.remove('success', 'error');
    saveMessage.textContent = '';

    if (title.length === 0) {
        saveMessage.textContent = 'A teendő neve nem lehet üres!';
        saveMessage.classList.add('error');
        saveMessage.style.display = 'block';
        return;
    }

    const todoData = {
        title,
        date
    };

    if (start_time) {
        todoData.start_time = start_time;
    }

    console.log("Mentés adatai:", todoData);

    try {
        const res = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todoData)
        });

        console.log('API válasz státusza:', res.status, res.statusText);

        let data;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
            console.log('API válasz tartalma (JSON):', data);
        } else {
            const text = await res.text();
            console.log('API válasz tartalma (szöveg):', text);
            throw new Error(`A szerver válasza nem JSON formátumú! Válasz: ${text}`);
        }

        if (res.ok) {
            saveMessage.textContent = 'Sikeres mentés!';
            saveMessage.classList.add('success');
            saveMessage.style.display = 'block';

            todoInput.value = '';
            startHourSelect.value = '';
            startMinuteSelect.value = '';

            // Csak a teendők számát frissítjük, nem az egész naptárat
            const year = parseInt(yearSelect.value);
            const month = parseInt(monthSelect.value);
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            await updateTodoCounts(year, month, daysInMonth);

            setTimeout(() => {
                saveMessage.style.display = 'none';
                saveMessage.classList.remove('success', 'error');
                saveMessage.textContent = '';
                closeForm();
            }, 2000);
        } else {
            saveMessage.textContent = data.message || 'Sikertelen mentés!';
            saveMessage.classList.add('error');
            saveMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Hiba a mentés során:', error);
        saveMessage.textContent = 'Hiba történt a mentés során: ' + error.message;
        saveMessage.classList.add('error');
        saveMessage.style.display = 'block';
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