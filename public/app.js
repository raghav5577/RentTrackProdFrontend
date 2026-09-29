const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const emptyState = document.querySelector('#empty-state');
const count = document.querySelector('#todo-count');
const errorMessage = document.querySelector('#error-message');
let todos = [];
let activeFilter = 'all';

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error((await response.json()).error || 'Something went wrong.');
  return response.status === 204 ? null : response.json();
}

function render() {
  const visibleTodos = todos.filter((todo) => activeFilter === 'all' || (activeFilter === 'done' ? todo.completed : !todo.completed));
  list.replaceChildren(...visibleTodos.map((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' completed' : ''}`;
    item.innerHTML = `<input type="checkbox" ${todo.completed ? 'checked' : ''} aria-label="Mark ${escapeHtml(todo.title)} complete"><label>${escapeHtml(todo.title)}</label><button class="delete-button" type="button" aria-label="Delete ${escapeHtml(todo.title)}">×</button>`;
    item.querySelector('input').addEventListener('change', () => updateTodo(todo.id, { completed: !todo.completed }));
    item.querySelector('.delete-button').addEventListener('click', () => deleteTodo(todo.id));
    return item;
  }));
  const openCount = todos.filter((todo) => !todo.completed).length;
  count.textContent = `${openCount} ${openCount === 1 ? 'task' : 'tasks'} left`;
  emptyState.hidden = visibleTodos.length > 0;
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

async function loadTodos() { todos = await request('/api/todos'); render(); }
async function updateTodo(id, changes) { todos = todos.map((todo) => todo.id === id ? { ...todo, ...changes } : todo); render(); await request(`/api/todos/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(changes) }); }
async function deleteTodo(id) { await request(`/api/todos/${id}`, { method: 'DELETE' }); todos = todos.filter((todo) => todo.id !== id); render(); }

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  try { const todo = await request('/api/todos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: input.value }) }); todos.unshift(todo); input.value = ''; render(); input.focus(); } catch (error) { errorMessage.textContent = error.message; }
});
document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => { activeFilter = button.dataset.filter; document.querySelector('.filter.active').classList.remove('active'); button.classList.add('active'); render(); }));
loadTodos().catch((error) => { errorMessage.textContent = error.message; });

console.log(great)
