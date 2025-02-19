// -- Deklarációk --

const apiUrl = 'http://localhost/todo_app/api/';

const todoInput = document.querySelector('main header input');      // input mező az új teendő beírására
const saveButton = document.querySelector('main header button');    // gomb az új teendő mentésére
const todoTable = document.querySelector('#todo-content');          // táblázat törzse a teendők megjelenítésére

const main = document.querySelector('main');
const aside = document.querySelector('aside');
const nav = document.querySelector('nav');
let userData = { user_ID: 0, token: '-' };
if (localStorage.getItem('userData') !== null) userData = JSON.parse(localStorage.getItem('userData'));

const check = async () => {
    if (userData.token.length > 0) {
        fetch(`${apiUrl}authentication/login.php?token=${userData.token}&user_id=${userData.user_ID}`)
        .then(response => response.json())
        .then(data => {
            if (data.success == true) {
                aside.innerHTML = '';
                aside.remove();
                console.log(data);
            } else {
                main.innerHTML = '';
                main.remove();
                nav.innerHTML = '';
                nav.remove();
                console.log(data);
            }
        })
    }
}

check();


    
// -- Segédfüggvények --

    // visszatér egy táblázat sorral
    const createTableRow = (todo, index) => {
        return `<tr>
                    <td class="state-${todo.completed}">${index+1}</td>
                    <td class="state-${todo.completed}">${todo.title}</td>
                    <td>
                        <button type="button" class="state-button-k state-k-button_${todo.completed}" onclick="todoState(${todo.id}, 1)">&bull;</button>
                        <button type="button" class="state-button-m state-m-button_${todo.completed}" onclick="todoState(${todo.id}, 0)">&laquo;</button>
                        <button type="button" class="delete-button" onclick="deleteTodo(${todo.id})">&Oslash;</button>
                    </td>
                </tr>`;
    }


// -- Fő függvények --

    // új teendő mentése
    async function saveTodo() {
        const title = todoInput.value.trim();
        if (title.length > 0) {
            const res = await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });
            todoInput.value = '';
            renderTable();
        }
    }

    // táblázat renderelő függvény
    async function renderTable() {
        const get_apiUrl = `${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos`;
        const res = await fetch(get_apiUrl);
        const resjson = await res.json();
        let todos = [];
        if (resjson.type == 'result') todos = resjson.body;
        let tableContent = '';
        todos.forEach( (todo, index)=> tableContent += createTableRow(todo, index)  )
        todoTable.innerHTML = tableContent;
    }

    // teendő törlése
    async function deleteTodo(dID) {
        await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&entityid=${dID}`, {
            method: 'DELETE'
        });
        renderTable();
    }

    // teendő állapotának megváltoztatása
    async function todoState(id, completed) {
        await fetch(`${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=todos&entityid=${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        renderTable();
    }


renderTable();

// mentés gomb eseményfigyelője
saveButton.addEventListener('click', saveTodo);