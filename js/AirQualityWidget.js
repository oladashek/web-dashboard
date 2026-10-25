import { UIComponent } from './UIComponent.js';

export class AirQualityWidget extends UIComponent {
  constructor(id) {
    super(id, 'Качество воздуха');
    this.controller = null;
    this.lat = 59.9343;
    this.lon = 30.3351;
  }

  render() {
    const card = super.render();
    this.loadAirQuality();
    return card;
  }

  async loadAirQuality() {
    if (this.controller) this.controller.abort();
    this.controller = new AbortController();
    const signal = this.controller.signal;

    this.body.innerHTML = '<p class="loading">Загрузка качества воздуха…</p>';

    try {
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${this.lat}&longitude=${this.lon}&current=pm10,pm2_5,nitrogen_dioxide,european_aqi&timezone=auto`;
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.error) throw new Error(data.reason || 'Ошибка API');

      const cur = data.current;
      if (!cur) throw new Error('Нет текущих данных');

      const aqi = cur.european_aqi;
      const aqiLabel = this.getAqiLabel(aqi);

      this.body.innerHTML = `
        <div class="data-row"><span class="data-label">AQI (EU)</span><span class="data-value">${aqi ?? '—'} ${aqiLabel}</span></div>
        <div class="data-row"><span class="data-label">PM2.5</span><span class="data-value">${cur.pm2_5 ?? '—'} мкг/м³</span></div>
        <div class="data-row"><span class="data-label">PM10</span><span class="data-value">${cur.pm10 ?? '—'} мкг/м³</span></div>
        <div class="data-row"><span class="data-label">NO₂</span><span class="data-value">${cur.nitrogen_dioxide ?? '—'} мкг/м³</span></div>
      `;
    } catch (err) {
      if (err.name === 'AbortError') return;
      this.body.innerHTML = `
        <p class="error">Не удалось загрузить качество воздуха.
          <button>Повторить</button>
        </p>`;
      this.body.querySelector('button').addEventListener('click', () => this.loadAirQuality());
    }
  }

  getAqiLabel(value) {
    if (value == null) return '';
    if (value <= 20) return 'хорошо';
    if (value <= 40) return 'приемлемо';
    if (value <= 60) return 'умеренно';
    if (value <= 80) return 'плохо';
    if (value <= 100) return 'очень плохо';
    return 'крайне плохо';
  }

  destroy() {
    if (this.controller) this.controller.abort();
    super.destroy();
  }
}