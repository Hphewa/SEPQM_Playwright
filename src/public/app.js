const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksList = document.getElementById('tasks-list');
const emptyState = document.getElementById('empty-state');
const messageBox = document.getElementById('message');

function showMessage(message, type = 'success') {
  messageBox.textContent = message;
  messageBox.className = `message ${type}`;
}

async function getErrorMessage(response, fallbackMessage) {
  try {
    const data = await response.json();
    return data.message || fallbackMessage;
  } catch (error) {
    return fallbackMessage;
  }
}

function createTaskElement(task) {
  const item = document.createElement('li');
  item.className = 'task-item';
  item.setAttribute('data-testid', 'task-item');

  const title = document.createElement('span');
  title.className = `task-title${task.completed ? ' completed' : ''}`;
  title.textContent = task.title;

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.textContent = task.completed ? 'Undo' : 'Complete';
  toggleButton.setAttribute(
    'aria-label',
    `${task.completed ? 'Undo' : 'Complete'} ${task.title}`
  );
  toggleButton.addEventListener('click', async () => {
    await toggleTask(task.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.setAttribute('aria-label', `Delete ${task.title}`);
  deleteButton.addEventListener('click', async () => {
    await deleteTask(task.id);
  });

  actions.append(toggleButton, deleteButton);
  item.append(title, actions);

  return item;
}

function renderTasks(tasks) {
  tasksList.innerHTML = '';
  emptyState.hidden = tasks.length !== 0;

  tasks.forEach((task) => {
    tasksList.appendChild(createTaskElement(task));
  });
}

async function loadTasks() {
  try {
    const response = await fetch('/api/tasks');

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Could not load tasks'));
    }

    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    renderTasks([]);
    showMessage(error.message, 'error');
  }
}

async function addTask(title) {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to add task'));
  }

  taskInput.value = '';
  showMessage('Task added successfully', 'success');
  await loadTasks();
}

async function toggleTask(taskId) {
  const response = await fetch(`/api/tasks/${taskId}/toggle`, {
    method: 'PATCH'
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to update task'));
  }

  showMessage('Task updated successfully', 'success');
  await loadTasks();
}

async function deleteTask(taskId) {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Failed to delete task'));
  }

  showMessage('Task deleted successfully', 'success');
  await loadTasks();
}

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) {
    showMessage('Task title is required', 'error');
    return;
  }

  try {
    await addTask(title);
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

window.addEventListener('DOMContentLoaded', loadTasks);