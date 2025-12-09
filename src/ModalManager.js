export class ModalManager {
    constructor() {
        this.modal = null;
        this.overlay = null;
        this.currentStep = 0;
        this.images = null;
        this.indicators = null;
    }

    create() {
        if (document.getElementById("globalHelpModal")) return;

        const modalHTML = `
              <div class="modal-overlay" id="modalOverlay"></div>
              <div class="help-modal" id="globalHelpModal">
                  <h3>
                      <span>Інструкція як додати в <b>OBS</b></span>
                  </h3>
                  <div class="help-content">
                      <!-- Image Carousel -->
                      <div style="position: relative; margin: 20px 0;">
                          <div class="screenshot-carousel">
                              <img src="static/tutorial1.png" class="carousel-image active" data-step="0" style="width: 100%; border-radius: 8px; border: 2px solid #000; display: block;" />
                              <img src="static/tutorial2.jpg" class="carousel-image" data-step="1" style="width: 100%; border-radius: 8px; border: 2px solid #000; display: none;" />
                              <img src="static/tutorial3.png" class="carousel-image" data-step="2" style="width: 100%; border-radius: 8px; border: 2px solid #000; display: none;" />
                          </div>
                          
                          <!-- Navigation Buttons -->
                          <button class="carousel-btn carousel-prev" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; border: 2px solid #000; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 20px; font-weight: bold;">‹</button>
                          <button class="carousel-btn carousel-next" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; border: 2px solid #000; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 20px; font-weight: bold;">›</button>
                          
                          <!-- Step Indicators -->
                          <div style="text-align: center; margin-top: 10px;">
                              <span class="step-indicator active" data-step="0" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ff5f57; margin: 0 5px; cursor: pointer; border: 2px solid #000;"></span>
                              <span class="step-indicator" data-step="1" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ccc; margin: 0 5px; cursor: pointer; border: 2px solid #000;"></span>
                              <span class="step-indicator" data-step="2" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ccc; margin: 0 5px; cursor: pointer; border: 2px solid #000;"></span>
                          </div>
                      </div>
                      
                      <p><strong>1. Відкрийте браузер віджета monobank:</strong></p>
                      <p style="margin-left: 20px;">Перейдіть за посиланням вашої банки для отримання віджета та скопіюйте URL віджета <b style="color: #ff0000;">СТАНДАРТНОГО ЧОРНОГО КОЛЬОРУ</b>.</p>
                      <p><strong>2. Додайте Browser Source в OBS:</strong></p>
                      <p style="margin-left: 20px;">• Клацніть правою кнопкою на "Джерела"<br>
                      • Виберіть "Додати" → "Браузер"<br>
                      • Назвіть джерело (наприклад, "Віджет monobank")</p>
                      
                      <p><strong>3. Налаштуйте джерело браузера та додайте кастомний CSS</strong></p>
                      <p style="margin-left: 20px;">• <b>URL:</b> вставте посилання на ваш віджет<br>
                      • <b>Width:</b> 380<br>
                      • <b>Height:</b> 136<br>
                      • Скопіюйте згенерований CSS код<br>
                      • Вставте його в поле "Власний CSS" в налаштуваннях Browser Source</p>
                      <p style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px; font-size: 12px;">
                      <b>Порада:</b> Для прозорого фону віджета встановіть прозорість фону в налаштуваннях віджета.</p>
                  </div>
                  <button class="copy-btn-wide" id="modalCloseBtn">Зрозуміло</button>
              </div>`;

        document.body.insertAdjacentHTML("beforeend", modalHTML);

        this.overlay = document.getElementById("modalOverlay");
        this.modal = document.getElementById("globalHelpModal");
        this.images = this.modal.querySelectorAll(".carousel-image");
        this.indicators = this.modal.querySelectorAll(".step-indicator");

        this.initCloseHandlers();
        this.initCarousel();
    }

    initCloseHandlers() {
        const closeBtn = document.getElementById("modalCloseBtn");
        const closeModal = () => this.hide();

        this.overlay.addEventListener("click", closeModal);
        closeBtn.addEventListener("click", closeModal);
    }

    initCarousel() {
        const prevBtn = this.modal.querySelector(".carousel-prev");
        const nextBtn = this.modal.querySelector(".carousel-next");

        prevBtn.addEventListener("click", () => {
            const newStep = (this.currentStep - 1 + this.images.length) % this.images.length;
            this.showStep(newStep);
        });

        nextBtn.addEventListener("click", () => {
            const newStep = (this.currentStep + 1) % this.images.length;
            this.showStep(newStep);
        });

        this.indicators.forEach((indicator) => {
            indicator.addEventListener("click", () => {
                const step = parseInt(indicator.dataset.step);
                this.showStep(step);
            });
        });
    }

    showStep(step) {
        this.images.forEach((img, i) => {
            img.style.display = i === step ? "block" : "none";
            img.classList.toggle("active", i === step);
        });
        this.indicators.forEach((ind, i) => {
            ind.style.background = i === step ? "#ff5f57" : "#ccc";
            ind.classList.toggle("active", i === step);
        });
        this.currentStep = step;
    }

    show() {
        this.overlay.classList.add("modal-open");
        this.modal.classList.add("modal-open");
    }

    hide() {
        this.overlay.classList.remove("modal-open");
        this.modal.classList.remove("modal-open");
    }
}
