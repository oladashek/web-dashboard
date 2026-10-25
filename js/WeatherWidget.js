import { UIComponent } from './UIComponent.js';

export class WeatherWidget extends UIComponent {
  constructor(id) {
    super(id, 'Погода');
    this.controller = null;
    // Санкт-Петербург; при необходимости замените на координаты нужного города
    this.lat = 59.9343;
    this.lon = 30.3351;
  }

  render() {
    const card = super.render();
    this.loadWeather();
    return card;
  }

  async loadWeather() {
    if (this.controller) this.controller.abort();
    this.controller = new AbortController();
    const signal = this.controller.signal;

    this.body.innerHTML = '<p class="loading">Загрузка погоды…</p>';

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current_weather=true&timezone=auto`;
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!data.current_weather) throw new Error('Нет данных о погоде');

      const cw = data.current_weather;
      this.body.innerHTML = `
        <div class="data-row"><span class="data-label">Температура</span><span class="data-value">${cw.temperature} °C</span></div>
        <div class="data-row"><span class="data-label">Ветер</span><span class="data-value">${cw.windspeed} км/ч</span></div>
        <div class="data-row"><span class="data-label">Направление</span><span class="data-value">${cw.winddirection}°</span></div>
        <div class="data-row"><span class="data-label">Код погоды</span><span class="data-value">${cw.weathercode}</span></div>
      `;
    } catch (err) {
      if (err.name === 'AbortError') return;
      this.body.innerHTML = `
        <p class="error">Не удалось загрузить погоду.
          <button>Повторить</button>
        </p>`;
      this.body.querySelector('button').addEventListener('click', () => this.loadWeather());
    }
  }

  destroy() {
    if (this.controller) this.controller.abort();
    super.destroy();
  }
}