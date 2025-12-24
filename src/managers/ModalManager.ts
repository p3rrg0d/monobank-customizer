export class ModalManager {
    private modal: HTMLElement | null = null;
    private overlay: HTMLElement | null = null;
    private currentStep: number = 0;
    private images: NodeListOf<HTMLImageElement> | null = null;
    private indicators: NodeListOf<HTMLElement> | null = null;

    constructor() {
    }

    create() {
        if (document.getElementById("globalHelpModal")) return;

        const modalHTML = `
              <div class="modal-overlay" id="modalOverlay"></div>
              <div class="help-modal" id="globalHelpModal">
                  <h3>
                      <span>Інструкція як додати в <b>OBS</b></span>
                  </h3>
                  <div class="help-content modal-body">
                      <div class="modal-text">
                          <p><strong>1. Відкрийте браузер віджета monobank:</strong></p>
                          <p style="margin-left: 10px;">Перейдіть за посиланням вашої банки та скопіюйте URL віджета <b style="color: #ff0000;">СТАНДАРТНОГО ЧОРНОГО КОЛЬОРУ</b>.</p>
                          
                          <p><strong>2. Додайте Browser Source в OBS:</strong></p>
                          <p style="margin-left: 10px;">• Клацніть правою на "Джерела" → "Додати" → "Браузер"<br>
                          • Назвіть джерело (наприклад, "Віджет monobank")</p>
                          
                          <p><strong>3. Налаштуйте джерело:</strong></p>
                          <p style="margin-left: 10px;">• <b>URL:</b> вставте посилання на ваш віджет<br>
                          • <b>Width:</b> 380 | <b>Height:</b> 136<br>
                          • Вставте скопійований CSS у поле "Власний CSS"</p>
                          
                          <div class="tip-box">
                              <b>Порада:</b> Для прозорого фону встановіть прозорість у налаштуваннях редактора.
                          </div>
                      </div>

                      <div class="modal-visual">
                          <!-- Image Carousel -->
                          <div class="carousel-container">
                              <div class="screenshot-carousel">
                                  <img src="static/tutorial1.png" class="carousel-image active" data-step="0" />
                                  <img src="static/tutorial2.jpg" class="carousel-image" data-step="1" style="display: none;" />
                                  <img src="static/tutorial3.png" class="carousel-image" data-step="2" style="display: none;" />
                              </div>
                              
                              <!-- Navigation Buttons -->
                              <button class="carousel-btn carousel-prev">‹</button>
                              <button class="carousel-btn carousel-next">›</button>
                              
                              <!-- Step Indicators -->
                              <div class="carousel-indicators">
                                  <span class="step-indicator active" data-step="0"></span>
                                  <span class="step-indicator" data-step="1"></span>
                                  <span class="step-indicator" data-step="2"></span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <button class="copy-btn-wide" id="modalCloseBtn">Зрозуміло</button>
              </div>`;

        document.body.insertAdjacentHTML("beforeend", modalHTML);

        this.overlay = document.getElementById("modalOverlay");
        this.modal = document.getElementById("globalHelpModal");
        if (this.modal) {
            this.images = this.modal.querySelectorAll(".carousel-image");
            this.indicators = this.modal.querySelectorAll(".step-indicator");
        }

        this.initCloseHandlers();
        this.initCarousel();
    }

    initCloseHandlers() {
        const closeBtn = document.getElementById("modalCloseBtn");
        const closeModal = () => this.hide();

        this.overlay?.addEventListener("click", closeModal);
        closeBtn?.addEventListener("click", closeModal);
    }

    initCarousel() {
        if (!this.modal) return;
        const prevBtn = this.modal.querySelector(".carousel-prev");
        const nextBtn = this.modal.querySelector(".carousel-next");

        prevBtn?.addEventListener("click", () => {
            if (this.images) {
                const newStep = (this.currentStep - 1 + this.images.length) % this.images.length;
                this.showStep(newStep);
            }
        });

        nextBtn?.addEventListener("click", () => {
            if (this.images) {
                const newStep = (this.currentStep + 1) % this.images.length;
                this.showStep(newStep);
            }
        });

        this.indicators?.forEach((indicator) => {
            indicator.addEventListener("click", () => {
                const step = parseInt((indicator as HTMLElement).dataset.step || "0");
                this.showStep(step);
            });
        });
    }

    showStep(step: number) {
        this.images?.forEach((img, i) => {
            img.style.display = i === step ? "block" : "none";
            img.classList.toggle("active", i === step);
        });
        this.indicators?.forEach((ind, i) => {
            ind.style.background = i === step ? "#ff5f57" : "#ccc";
            ind.classList.toggle("active", i === step);
        });
        this.currentStep = step;
    }

    show() {
        this.overlay?.classList.add("modal-open");
        this.modal?.classList.add("modal-open");
    }

    hide() {
        this.overlay?.classList.remove("modal-open");
        this.modal?.classList.remove("modal-open");
    }
}
