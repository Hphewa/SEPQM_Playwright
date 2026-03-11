const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const SEED_FILE = path.join(DATA_DIR, 'tasks.seed.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

function readTasks() {
  const data = fs.readFileSync(TASKS_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

function resetTasks() {
  fs.copyFileSync(SEED_FILE, TASKS_FILE);
  return readTasks();
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/tasks', (req, res) => {
  res.json(readTasks());
});

app.post('/api/tasks', (req, res) => {
  const title = req.body.title?.trim();

  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  const tasks = readTasks();
  const newId = tasks.length ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

  const newTask = {
    id: newId,
    title,
    completed: false
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});

app.patch('/api/tasks/:id/toggle', (req, res) => {
  const taskId = Number(req.params.id);
  const tasks = readTasks();
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.completed = !task.completed;
  writeTasks(tasks);

  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const tasks = readTasks();
  const index = tasks.findIndex((item) => item.id === taskId);

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(index, 1);
  writeTasks(tasks);

  res.json({ message: 'Task deleted successfully' });
});

app.post('/api/reset', (req, res) => {
  const tasks = resetTasks();
  res.json({ message: 'Data reset successful', tasks });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});