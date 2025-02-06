// -- Deklarációk --

    const todoInput = document.querySelector('main header input');      // input mező az új teendő beírására
    const saveButton = document.querySelector('main header button');    // gomb az új teendő mentésére
    const todoTable = document.querySelector('#todo-content');          // táblázat törzse a teendők megjelenítésére

    const apiUrl = 'https://todoapp.norbbert4.hu/api/';

    
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
            const res = await fetch(apiUrl, {
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
        const res = await fetch(apiUrl);
        const todos = await res.json();
        let tableContent = '';
        todos.forEach( (todo, index)=> tableContent += createTableRow(todo, index)  )
        todoTable.innerHTML = tableContent;
    }

    // teendő törlése
    async function deleteTodo(dID) {
        await fetch(apiUrl, {
            method: 'DELETE',
            body: `id=${dID}`
        });
        renderTable();
    }

    // teendő állapotának megváltoztatása
    async function todoState(id, completed) {
        await fetch(apiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, completed })
        });
        renderTable();
    }


renderTable();

// mentés gomb eseményfigyelője
saveButton.addEventListener('click', saveTodo);