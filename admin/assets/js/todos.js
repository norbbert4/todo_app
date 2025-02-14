import { auth } from "./authentication.js";
auth();

const userData = JSON.parse(localStorage.getItem('userData'));
const tbody = document.querySelector('tbody');
const editBox = document.querySelector('#editbox');
const editBoxContent = document.querySelector('#editbox .content');
const editBoxClose = document.querySelector('#editbox .close');
const newButton = document.getElementById('ujGomb');
const apiURL = '../api/index.php';
const entity = 'todos';
let selectedEntity = {};
let dataArray = [];


const createTableRow = (todo) => {
    const tableRow = ` <tr>
                            <td>${todo.id}</td>
                            <td>${todo.title}</td>
                            <td>${todo.completed}</td>
                            <td class="d-flex">
                                <button class="btn btn-sm btn-warning m-1" onclick="getEntity(${todo.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger m-1" onclick="deleteEntity(${todo.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>                        
                        </tr>
                    `;
    return tableRow;
}

const createEditBox = (todo) => {
    let btn = ''; 
    if (todo.new) {
        btn = '<div class="btn btn-primary" id="createGomb">Rögzítés</div>';
    } else {
        btn = '<div class="btn btn-secondary" id="mentGomb">Mentés</div>';
    }
    const HTML = ` 
    <form>
    <input type="hidden" id="id" value="${todo.id}">
    <div class="mb-3">
        <label for="title" class="form-label">Teendő</label>
        <input type="text" class="form-control" id="title" value="${todo.title}">
    </div>
    <div class="mb-3">
        <label for="completed" class="form-label">Állapot</label>
        <input type="number" min="0" max="1" class="form-control" id="completed" value="${todo.completed}">
    </div>
    ${btn}
    </form>
    `;
    return HTML;
}


const getEntities = () => {
    const url = `${apiURL}?token=${userData.token}&userid=${userData.user_ID}&entity=${entity}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.type == 'result') {
            dataArray = data.body;
            tbody.innerHTML = '';
            let tableRows = '';
            data.body.forEach(todo => {
                tableRows+=createTableRow(todo);
            });
            tbody.innerHTML = tableRows;
        } else {
            tbody.innerHTML = '';
            console.log(data.type + ': ' + data.message);
        }
    });
}

const getEntity = (id) => {
    const url = `${apiURL}?token=${userData.token}&userid=${userData.user_ID}&entity=${entity}&entityid=${id}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.type == 'result') {
            selectedEntity = data.body[0];
            let datasheet = '';
            editBoxContent.innerHTML = '';
            data.body.forEach(todo => {
                datasheet+=createEditBox(todo);
            });
            editBoxContent.innerHTML = datasheet;
            editBox.classList.remove('box-hide');
            document.getElementById("mentGomb").addEventListener("click", updateEntity);
        } else {
            console.log(data.type + ': ' + data.message);
        }
    });
}


// Create
const createEntity = function(e) {
    const formData = {
                            "title": document.getElementById('title').value
                    };
    const hasValues = Object.values(formData).some(value => value !== '');
    if (hasValues) {
        const url = `${apiURL}?token=${userData.token}&userid=${userData.user_ID}&entity=${entity}`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            closeEditBox();
            getEntities(); 
        })
        .catch(function(error) {
            console.error(error);
        });
    } else {
        console.error('Hiba: Az űrlap mezői nem lehetnek üresek.');
    }
}


// Update
const updateEntity = function(e) {
    let id=document.getElementById('id').value;
    const formData = {
                            "title": document.getElementById('title').value,
                            "completed": document.getElementById('completed').value
                    };
    const hasValues = Object.values(formData).some(value => value !== '');
    if (hasValues) {
        const url = `${apiURL}?token=${userData.token}&userid=${userData.user_ID}&entity=${entity}&entityid=${id}`;
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            closeEditBox();
            getEntities(); 
        })
        .catch(function(error) {
            console.error(error);
        });
    } else {
        console.error('Hiba: Az űrlap mezői nem lehetnek üresek.');
    }
}


const deleteEntity = (id) => {
    const confirmResult = confirm("Biztos vagy benne, hogy törölni szeretnéd?");
    if (confirmResult) {
        const url = `${apiURL}?token=${userData.token}&userid=${userData.user_ID}&entity=${entity}&entityid=${id}`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.type == 'result') {
                getEntities();
            } else {
                console.log(data.type + ': ' + data.message);
            }
        });
    }
}


const closeEditBox = () => {
    editBox.classList.add('box-hide');
    editBoxContent.innerHTML = '';
}

newButton.addEventListener('click', () => {
    const emptyTodo = {
        id: 0,
        title: '',
        completed: 0,
        new: true
    }
    let datasheet = createEditBox(emptyTodo);
    editBoxContent.innerHTML = '';
    editBoxContent.innerHTML = datasheet;
    editBox.classList.remove('box-hide');
    document.getElementById("createGomb").addEventListener("click", createEntity);
});

editBoxClose.addEventListener('click', closeEditBox);

window.getEntity = getEntity;
window.deleteEntity = deleteEntity;

getEntities();