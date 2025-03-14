let currentDate = new Date();
const calendarGrid = document.getElementById('calendar-grid');
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const taskForm = document.getElementById('task-form');
const selectedDateInput = document.getElementById('selected-date');
const saveButton = document.querySelector('#save-button');
const goToTodosButton = document.querySelector('#go-to_todos');
const todoInput = document.querySelector('#title');

let userData = { user_ID: 0, token: '-' };
if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));

const months = [
    "Január", "Február", "Március", "Április", "Május", "Június",
    "Július", "Augusztus", "Szeptember", "Október", "November", "December"
];

const apiUrl = 'http://localhost/todo_app/api/';

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

        // üres napok
        for (let i = 1; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendarGrid.appendChild(emptyDay);
            console.log('Üres nap hozzáadva');
        }

        // valós napok
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayElement.setAttribute('id', `day_${dateStr}`)
            dayElement.textContent = day;

            // naphoz tartozó teendók számlálója
            let countResult = await getTodoCount(dateStr);
            console.log(Number(countResult.body.CNT));
            const todosForDayElement = document.createElement('div');
            todosForDayElement.className = 'todos-for-day';
            if (Number(countResult.body.CNT) == 0) todosForDayElement.className = 'todos-for-day todos-for-day_hidden';
            todosForDayElement.textContent = countResult.body.CNT;
            dayElement.appendChild(todosForDayElement);
            // -------------------------------------

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
            console.log(`Nap hozzáadva: ${day}`);
        }
    
}

function closeForm() {
    if (taskForm) {
        taskForm.style.display = 'none';
        console.log('Teendő űrlap elrejtve');
    } else {
        console.error('Teendő űrlap (task-form) nem található!');
    }
}


// új teendő mentése
async function saveTodo() {
    const title = todoInput.value.trim();
    const date = selectedDateInput.value;
    if (title.length > 0) {            
        const res = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, date })
        });
        todoInput.value = '';
        closeForm();
        let countResult = await getTodoCount(date);
        const todoCounterDiv = document.querySelector(`#day_${date} div`);
        todoCounterDiv.classList.remove('todos-for-day_hidden');
        todoCounterDiv.textContent = Number(countResult.body.CNT);
    }
}

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

// mentés gomb eseményfigyelője
saveButton.addEventListener('click', saveTodo);
goToTodosButton.addEventListener('click', goToTodos);

// Inicializálás
populateMonthSelect();
populateYearSelect();
renderCalendar();