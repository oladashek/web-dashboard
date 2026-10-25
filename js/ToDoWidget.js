import { UIComponent } from './UIComponent.js';

export class ToDoWidget extends UIComponent {
  constructor(id) {
    super(id, 'Список дел');
    this.tasks = [];
  }

  render() {
    const card = super.render();
    const body = this.body;

    const inputRow = document.createElement('div');
    inputRow.className = 'todo-input-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Новая задача…';

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Добавить';

    const addTask = () => {
      const text = input.value.trim();
      if (!text) return;
      this.tasks.push({ id: Date.now(), text, done: false });
      input.value = '';
      this.renderTasks();
      this.save();
    };

    addBtn.addEventListener('click', addTask);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addTask();
    });

    inputRow.appendChild(input);
    inputRow.appendChild(addBtn);

    const list = document.createElement('ul');
    list.className = 'todo-list';

    body.appendChild(inputRow);
    body.appendChild(list);
    this.listEl = list;

    this.renderTasks();
    return card;
  }

  renderTasks() {
    if (!this.listEl) return;
    this.listEl.innerHTML = '';
    this.tasks.forEach(task => {
      const li = document.createElement('li');
      if (task.done) li.classList.add('done');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', () => {
        task.done = checkbox.checked;
        this.renderTasks();
        this.save();
      });

      const span = document.createElement('span');
      span.textContent = task.text;

      const delBtn = document.createElement('button');
      delBtn.textContent = '✕';
      delBtn.addEventListener('click', () => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.renderTasks();
        this.save();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(delBtn);
      this.listEl.appendChild(li);
    });
  }

  save() {
    try {
      localStorage.setItem('todo-tasks', JSON.stringify(this.tasks));
    } catch (_) { /* игнорируем запрет сохранения */ }
  }

  load() {
    try {
      const raw = localStorage.getItem('todo-tasks');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) this.tasks = parsed;
      }
    } catch (_) {
      this.tasks = [];
    }
    this.renderTasks();
  }
}