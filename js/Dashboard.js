import { ToDoWidget } from './ToDoWidget.js';
import { WeatherWidget } from './WeatherWidget.js';
import { CurrencyWidget } from './CurrencyWidget.js';
import { AirQualityWidget } from './AirQualityWidget.js';
import { FlightWidget } from './FlightWidget.js';

export class Dashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.widgets = new Map();
    this.registry = {
      todo: ToDoWidget,
      weather: WeatherWidget,
      currency: CurrencyWidget,
      air: AirQualityWidget,
      flight: FlightWidget,
    };
    this.init();
  }

  init() {
    const saved = this.loadState();
    if (saved.length) {
      saved.forEach(type => this.addWidget(type, true));
    } else {
      ['todo', 'weather', 'currency'].forEach(type => this.addWidget(type, true));
    }

    document.addEventListener('widget-removed', (e) => {
      this.widgets.delete(e.detail.id);
      this.saveState();
    });

    document.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.add;
        if (!this.registry[type]) return;
        const exists = Array.from(this.widgets.values()).some(w => w.constructor === this.registry[type]);
        if (exists) {
          alert(`Виджет «${btn.textContent.slice(2)}» уже добавлен.`);
          return;
        }
        this.addWidget(type);
        this.saveState();
      });
    });
  }

  addWidget(type, restore = false) {
    const Ctor = this.registry[type];
    if (!Ctor) return;
    const id = `${type}-${Date.now()}`;
    const widget = new Ctor(id);
    const el = widget.render();
    this.container.appendChild(el);
    this.widgets.set(id, widget);

    if (type === 'todo' && restore) {
      widget.load();
    }
    return widget;
  }

  saveState() {
    try {
      const types = [];
      this.widgets.forEach(w => {
        if (w instanceof ToDoWidget) types.push('todo');
        else if (w instanceof WeatherWidget) types.push('weather');
        else if (w instanceof CurrencyWidget) types.push('currency');
        else if (w instanceof AirQualityWidget) types.push('air');
        else if (w instanceof FlightWidget) types.push('flight');
      });
      localStorage.setItem('dashboard-widgets', JSON.stringify(types));
    } catch (_) { /* игнорируем */ }
  }

  loadState() {
    try {
      const raw = localStorage.getItem('dashboard-widgets');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(t => this.registry[t]);
    } catch (_) {
      return [];
    }
  }
}