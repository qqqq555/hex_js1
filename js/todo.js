token = localStorage.getItem('token'); 
apiUrl = localStorage.getItem('apiUrl');
let allTodos = [];
let filter ='all';

if (!token) {
    alert('未授權的存取，請先登入');
    window.location.href = 'index.html'; 
}

function getTodo() {
    axios.get(`${apiUrl}/todos`, {
        headers: {
            'Authorization': token
        }
    })
    .then(response => {
        console.log(response);
        allTodos = response.data.todos;
        filterTodos(filter);
        updateFooter(response.data.todos);
    })
    .catch(error => {
        console.error('Error fetching todos:', error.response);
    });
}

function updateTodoList(todos) {
    const list = document.querySelector('.list');
    list.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.dataset.id = todo.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed_at;
        checkbox.onchange = function() { toggleTodo(todo.id); };

        const span = document.createElement('span');
        span.textContent = todo.content;
        span.onclick = function() { showEditInput(todo.id, todo.content); };

        const label = document.createElement('label');
        label.className = 'checkbox';
        label.appendChild(checkbox);
        label.appendChild(span);

        const editButton = document.createElement('a');
        editButton.href = '#';
        editButton.className = 'edit';
        editButton.onclick = function() {
            const newContent = prompt('請輸入編輯內容:', todo.content);
            if (newContent) {
                editTodo(todo.id, newContent);
            }
        };

        const deleteButton = document.createElement('a');
        deleteButton.href = '#';
        deleteButton.className = 'delete';
        deleteButton.onclick = function() { deleteTodo(todo.id); };

        li.appendChild(label);
        li.appendChild(deleteButton);
        li.appendChild(editButton);

        list.appendChild(li);
    });

}

function updateFooter(todos) {
    const footer = document.querySelector('.list_footer p');
    const pendingCount = todos.filter(todo => !todo.completed_at).length;
    footer.textContent = `${pendingCount} 個待完成項目`;
}


function addTodo() {
    const todoContent = document.querySelector('.input input').value;
    document.querySelector('.input input').value = "";
    if (!todoContent) {
        alert('請輸入欲加入的待辦事項');
        return;
    }

    axios.post(`${apiUrl}/todos`, {
        "todo": {
            'content': todoContent
        }
    }, {
        headers: {
            'Authorization': token
        }
    })
    .then(response => {
        console.log(response);
        getTodo();
        filterTodos();
    })
    .catch(error => {
        console.error('Error adding todo:', error.response);
    });
}

function editTodo(todoId, newContent) {
    if (!newContent) {
        alert('待辦事項內容不能為空');
        return;
    }

    axios.put(`${apiUrl}/todos/${todoId}`, {
        "todo": {
            'content': newContent
        }
    }, {
        headers: {
            'Authorization': token
        }
    })
    .then(response => {
        console.log(response);
        getTodo();
    })
    .catch(error => {
        console.error('Error editing todo:', error.response);
    });
}


function deleteTodo(todoId) {
    axios.delete(`${apiUrl}/todos/${todoId}`, {
        headers: {
            'Authorization': token
        }
    })
    .then(response => {
        console.log(response);
        getTodo();
    })
    .catch(error => {
        console.error('Error deleting todo:', error.response);
    });
}

function toggleTodo(todoId) {
    axios.patch(`${apiUrl}/todos/${todoId}/toggle`, {}, {
        headers: {
            'Authorization': token
        }
    })
    .then(response => {
        console.log(response);
        getTodo();
    })
    .catch(error => {
        console.error('Error toggling todo:', error.response);
    });
}

function filterTodos(filter) {
    let filteredTodos = [];
    if (filter === 'all') {
        filteredTodos = allTodos;
    } else if (filter === 'pending') {
        filteredTodos = allTodos.filter(todo => !todo.completed_at);
        console.log(filteredTodos);
    } else if (filter === 'completed') {
        filteredTodos = allTodos.filter(todo => todo.completed_at);
    }
    updateTodoList(filteredTodos);
}

function deleteCompletedTodos() {
    const completedTodos = allTodos.filter(todo => todo.completed_at);
    const deletePromises = completedTodos.map(todo => {
        return axios.delete(`${apiUrl}/todos/${todo.id}`, {
            headers: {
                'Authorization': token
            }
        });
    });

    Promise.all(deletePromises)
    .then(responses => {
        console.log('All completed todos deleted', responses);
        getTodo();
    })
    .catch(error => {
        console.error('Error deleting completed todos:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    getTodo(); 
    document.querySelector('.btn_add').addEventListener('click', function(event) {
        event.preventDefault();
        addTodo();
    });
    document.querySelector('.tab').addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            document.querySelectorAll('.tab li').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            if (event.target.textContent === '全部') {
                filter = 'all';
            } else if (event.target.textContent === '待完成') {
                filter = 'pending';

            } else if (event.target.textContent === '已完成') {
                filter = 'completed';

            }
            filterTodos(filter);
        }
    });
    document.querySelector('.list_footer a').addEventListener('click', function(event) {
        event.preventDefault();
        deleteCompletedTodos();
    });
    document.getElementById('logout').addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});
