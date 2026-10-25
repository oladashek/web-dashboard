export class UIComponent {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.element = null;
    this.collapsed = false;
    this._listeners = [];
  }

  render() {
    const card = document.createElement('div');
    card.className = 'widget';
    card.dataset.id = this.id;

    const header = document.createElement('div');
    header.className = 'widget-header';

    const h2 = document.createElement('h2');
    h2.textContent = this.title;
    header.appendChild(h2);

    const actions = document.createElement('div');
    actions.className = 'widget-actions';

    const collapseBtn = document.createElement('button');
    collapseBtn.textContent = this.collapsed ? 'Развернуть' : 'Свернуть';
    collapseBtn.addEventListener('click', () => {
      this.collapsed = !this.collapsed;
      card.classList.toggle('collapsed', this.collapsed);
      collapseBtn.textContent = this.collapsed ? 'Развернуть' : 'Свернуть';
    });
    actions.appendChild(collapseBtn);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Удалить';
    removeBtn.addEventListener('click', () => {
      this.destroy();
      document.dispatchEvent(new CustomEvent('widget-removed', { detail: { id: this.id } }));
    });
    actions.appendChild(removeBtn);

    header.appendChild(actions);

    const body = document.createElement('div');
    body.className = 'widget-body';

    card.appendChild(header);
    card.appendChild(body);

    this.element = card;
    this.body = body;
    return card;
  }

  destroy() {
    this._listeners.forEach(({ target, type, fn }) => {
      target.removeEventListener(type, fn);
    });
    this._listeners = [];
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  on(target, type, fn) {
    target.addEventListener(type, fn);
    this._listeners.push({ target, type, fn });
  }
}