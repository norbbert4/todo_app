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

document.addEventListener('click', (event) => {
    // Ellenőrizzük, hogy a task-form látható-e
    if (taskForm && taskForm.style.display === 'block') {
        // Ha a kattintás a task-form-on kívül történt, elrejtjük
        const isClickInsideForm = taskForm.contains(event.target);
        const isClickOnDay = event.target.closest('.day'); // Ellenőrizzük, hogy a kattintás egy nap elemre történt-e

        // Ha a kattintás nem a formon belül történt, és nem egy nap elemre (ami megnyitja a formot), akkor elrejtjük a formot
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

async function getTodoCount(dateStr) {
    const get_apiUrl = `${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&entityid=${dateStr}&count=1`;
    const res = await fetch(get_apiUrl);
    const resjson = await res.json();
    return resjson;
}

// Segédfüggvény a helyes "-ra/-re" ragozás meghatározására
function getCaseSuffix(day) {
    // Különleges esetek
    if (day === 1) {
        return '-jére';
    } else if (day === 2) {
        return '-ára';
    } else if (day === 3) {
        return '-ára';
    } else if (day === 10 || day === 20 || day === 30) {
        return '-ra';
    }

    // Az utolsó számjegy alapján döntünk
    const lastDigit = day % 10;
    const lastTwoDigits = day % 100;

    // Ha a szám 10, 20, 30, akkor már kezeltük
    if (lastTwoDigits === 10 || lastTwoDigits === 20 || lastTwoDigits === 30) {
        return '-ra';
    }

    // A szám szöveges alakja alapján döntünk a magánhangzó-harmóniáról
    const numberStr = day.toString();
    const lastChar = numberStr[numberStr.length - 1];

    // A magyar számok kiejtése alapján döntünk a magánhangzó-harmóniáról
    if (lastDigit === 0) {
        return '-re'; // pl. 10-re, 20-ra (már kezeltük)
    } else if (lastDigit === 1) {
        return '-re'; // pl. 11-re, 21-re
    } else if (lastDigit === 2) {
        return '-ra'; // pl. 12-re, 22-re (de 2-ára már kezeltük)
    } else if (lastDigit === 3) {
        return '-ra'; // pl. 13-ra, 23-ra (de 3-ára már kezeltük)
    } else if (lastDigit === 4) {
        return '-re'; // pl. 14-re, 24-re
    } else if (lastDigit === 5) {
        return '-re'; // pl. 5-re, 15-re
    } else if (lastDigit === 6) {
        return '-ra'; // pl. 6-ra, 16-ra
    } else if (lastDigit === 7) {
        return '-re'; // pl. 7-re, 17-re
    } else if (lastDigit === 8) {
        return '-ra'; // pl. 8-ra, 18-ra
    } else if (lastDigit === 9) {
        return '-re'; // pl. 9-re, 19-re
    }

    // Alapértelmezett eset (nem kellene ide eljutni)
    return '-ra';
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
                taskForm.style.display = 'block'; // Láthatóság beállítása
        
                // Üzenet elrejtése a form megnyitásakor
                const saveMessage = document.getElementById('save-message');
                saveMessage.style.display = 'none';
                saveMessage.classList.remove('success', 'error');
                saveMessage.textContent = '';
        
                // A task-form címének frissítése a hónap nevével és a helyes ragozással
                const formTitle = taskForm.querySelector('h3');
                if (formTitle) {
                    const monthName = months[month]; // Hónap neve (pl. "Március")
                    const suffix = getCaseSuffix(day); // Helyes ragozás (pl. "-re", "-ra")
                    formTitle.textContent = `Mi lesz a teendő ${monthName} ${day}.${suffix}?`;
                } else {
                    console.error('A task-form h3 eleme nem található!');
                }
        
                // A nap elem pozíciójának lekérése
                const rect = dayElement.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
                // Képernyő méretei
                const windowHeight = window.innerHeight;
                const windowWidth = window.innerWidth;
        
                // A task-form méretei
                const formHeight = taskForm.offsetHeight;
                const formWidth = taskForm.offsetWidth;
        
                // Navbar magassága (mobilon 80px a CSS szerint)
                const navbarHeight = 80;
        
                // Minimum és maximum top/left értékek, hogy a form ne lógjon ki
                const minTop = navbarHeight + 10; // A navbar alatt + némi padding
                const maxTop = windowHeight - formHeight - 10; // Hogy a form alja ne lógjon ki
                const minLeft = 10; // Hogy a form bal oldala ne lógjon ki
                const maxLeft = windowWidth - formWidth - 10; // Hogy a form jobb oldala ne lógjon ki
        
                // Alapértelmezett pozíció: a nap alatt, középen igazítva
                let topPosition = rect.bottom + scrollTop + 5; // A nap alatt 5px-re
                let leftPosition = rect.left + scrollLeft + (rect.width / 2) - (formWidth / 2); // A nap közepéhez igazítva
        
                // Ha a form alja kilógna a képernyőből, feljebb toljuk (a nap fölé)
                if (topPosition + formHeight > windowHeight - 10) {
                    topPosition = rect.top + scrollTop - formHeight - 5; // A nap fölé 5px-re
                }
        
                // Ha a form teteje a navbar alá kerülne, lejjebb toljuk
                if (topPosition < minTop) {
                    topPosition = minTop;
                }
        
                // Ha a form bal oldala kilógna, jobbra toljuk
                if (leftPosition < minLeft) {
                    leftPosition = minLeft;
                }
        
                // Ha a form jobb oldala kilógna, balra toljuk
                if (leftPosition > maxLeft) {
                    leftPosition = maxLeft;
                }
        
                // A pozíció beállítása
                taskForm.style.top = `${topPosition}px`;
                taskForm.style.left = `${leftPosition}px`;
                taskForm.style.transform = 'none'; // Nem használunk transformot, mert a left/top pontosan pozícionál
        
                console.log('Teendő űrlap megjelenítve:', dateStr, 'Pozíció:', { top: topPosition, left: leftPosition });
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
        todoInput.value = ''; // Input mező ürítése
        const saveMessage = document.getElementById('save-message');
        saveMessage.style.display = 'none'; // Üzenet elrejtése
        saveMessage.classList.remove('success', 'error'); // Osztályok eltávolítása
        saveMessage.textContent = ''; // Üzenet szövegének törlése
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

    // Üzenet elem lekérése
    const saveMessage = document.getElementById('save-message');

    // Üzenet alaphelyzetbe állítása (elrejtés és osztályok eltávolítása)
    saveMessage.style.display = 'none';
    saveMessage.classList.remove('success', 'error');
    saveMessage.textContent = '';

    // Ellenőrizzük, hogy üres-e az input
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

        // Próbáljuk meg JSON-ként értelmezni a választ
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
            // Sikeres mentés
            saveMessage.textContent = 'Sikeres mentés!';
            saveMessage.classList.add('success');
            saveMessage.style.display = 'block';

            // Input mezők ürítése
            todoInput.value = '';
            startHourSelect.value = '';
            startMinuteSelect.value = '';

            // Naptár frissítése
            await renderCalendar();

            // Üzenet eltüntetése 2 másodperc után
            setTimeout(() => {
                saveMessage.style.display = 'none';
                saveMessage.classList.remove('success', 'error');
                saveMessage.textContent = '';
                closeForm();
            }, 2000);
        } else {
            // Sikertelen mentés
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