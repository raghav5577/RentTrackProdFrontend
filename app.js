const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const statusEl = document.getElementById('status');
const itemTemplate = document.getElementById('todo-item-template');

const apiBase = '/api/todos';

const setStatus = (message) => {
  statusEl.textContent = message;
};

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const renderTodos = (todos) => {
  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const fragment = itemTemplate.content.cloneNode(true);
    const item = fragment.querySelector('.todo-item');
    const toggle = fragment.querySelector('.todo-toggle');
    const text = fragment.querySelector('.todo-text');
    const deleteButton = fragment.querySelector('.todo-delete');

    text.textContent = todo.text;
    toggle.checked = Boolean(todo.completed);

    if (todo.completed) {
      item.classList.add('completed');
    }

    toggle.addEventListener('change', async () => {
      try {
        await request(`${apiBase}/${todo.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ completed: toggle.checked }),
        });
        await loadTodos();
      } catch (error) {
        setStatus(`Failed to update todo: ${error.message}`);
      }
    });

    deleteButton.addEventListener('click', async () => {
      try {
        await request(`${apiBase}/${todo.id}`, { method: 'DELETE' });
        await loadTodos();
      } catch (error) {
        setStatus(`Failed to delete todo: ${error.message}`);
      }
    });

    todoList.appendChild(fragment);
  });
};

const loadTodos = async () => {
  try {
    const todos = await request(apiBase, { method: 'GET' });
    renderTodos(Array.isArray(todos) ? todos : []);
    setStatus('');
  } catch (error) {
    setStatus(`Failed to load todos: ${error.message}`);
  }
};

todoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();

  if (!text) {
    return;
  }

  try {
    await request(apiBase, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });

    todoInput.value = '';
    await loadTodos();
  } catch (error) {
    setStatus(`Failed to create todo: ${error.message}`);
  }
});

loadTodos();
