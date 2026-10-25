import { UIComponent } from './UIComponent.js';

export class FlightWidget extends UIComponent {
  constructor(id) {
    super(id, 'Статус рейса');
  }

  render() {
    const card = super.render();
    this.body.innerHTML = `
      <div class="data-row"><span class="data-label">Рейс</span><span class="data-value">SU 1234</span></div>
      <div class="data-row"><span class="data-label">Вылет</span><span class="data-value">Москва (SVO)</span></div>
      <div class="data-row"><span class="data-label">Прилёт</span><span class="data-value">Санкт-Петербург (LED)</span></div>
      <div class="data-row"><span class="data-label">Статус</span><span class="data-value">По расписанию</span></div>
      <div class="data-row"><span class="data-label">Время</span><span class="data-value">14:30</span></div>
    `;
    return card;
  }
}