import { UIComponent } from './UIComponent.js';

export class CurrencyWidget extends UIComponent {
  constructor(id) {
    super(id, 'Курс EUR → USD');
    this.controller = null;
  }

  render() {
    const card = super.render();
    this.loadRate();
    return card;
  }

  async loadRate() {
    if (this.controller) this.controller.abort();
    this.controller = new AbortController();
    const signal = this.controller.signal;

    this.body.innerHTML = '<p class="loading">Загрузка курса…</p>';

    try {
      const res = await fetch('https://api.frankfurter.dev/v2/rate/eur/usd', { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      this.body.innerHTML = `
        <div class="data-row"><span class="data-label">1 EUR</span><span class="data-value">${data.rate} USD</span></div>
        <div class="data-row"><span class="data-label">Дата</span><span class="data-value">${data.date || '—'}</span></div>
        <div class="data-row"><span class="data-label">Источник</span><span class="data-value">Frankfurter / ECB</span></div>
      `;
    } catch (err) {
      if (err.name === 'AbortError') return;
      this.body.innerHTML = `
        <p class="error">Не удалось загрузить курс.
          <button>Повторить</button>
        </p>`;
      this.body.querySelector('button').addEventListener('click', () => this.loadRate());
    }
  }

  destroy() {
    if (this.controller) this.controller.abort();
    super.destroy();
  }
}