// ============= STATE =============
const state = {
  borderRadius: 16,
  backgroundColor: "rgba(0, 0, 0, 1)",
  borderColor: "rgba(0, 0, 0, 0)",
  textColor: "#fff",
  progressBackground:
    "linear-gradient(132.42deg, #e7b5d3 0%, #f4b9c1 50.79%, #eac6bb 97.52%)",
  progressGradient:
    "linear-gradient(132.42deg, #b93e88 0%, #f58190 50.79%, #fca78c 97.52%)",
  progressRadius: 12,
};

// Gradient state
let gradientStops = [
  { id: 1, color: "#b93e88", position: 0 },
  { id: 2, color: "#f58190", position: 50 },
  { id: 3, color: "#fca78c", position: 100 },
];
let nextId = 4;
let gradientAngle = 132;

// ============= CSS GENERATOR =============
function generateCustomCSS() {
  return `
.widget.qr-with-progress-widget.color-scheme-black.shadow-off {
    border-radius: ${state.borderRadius}px;
    background: ${state.backgroundColor};
    border: 1px solid ${state.borderColor};
    color: ${state.textColor};
}

.linear-horizontal-progress-widget.color-scheme-pink .background {
    background: ${state.progressBackground};
    border-radius: ${state.progressRadius}px;
}

.linear-horizontal-progress-widget.color-scheme-pink .progress {
    background: ${state.progressGradient};
    border-radius: ${state.progressRadius}px;
}
`;
}

// ============= UPDATE FUNCTIONS =============
function updateCSSExport() {
  const cssExportDiv = document.querySelector(".css-export");
  let codeElement = cssExportDiv.querySelector("pre");

  const cssCode = generateCustomCSS();

  if (!codeElement) {
    codeElement = document.createElement("pre");
    codeElement.style.cssText = `
        background: #f5f5f5;
        border: 3px solid #3a1622;
        padding: 10px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        white-space: pre-wrap;
        word-wrap: break-word;
        max-height: 300px;
        overflow-y: auto;
        margin: 0;
    `;

    const existingText = Array.from(cssExportDiv.childNodes).find(
      (node) =>
        node.nodeType === Node.TEXT_NODE &&
        node.textContent.includes("CSS Export content"),
    );
    if (existingText) cssExportDiv.removeChild(existingText);

    cssExportDiv.appendChild(codeElement);
  }

  codeElement.textContent = cssCode;
}

function updateWidget() {
  const myWidget = document.querySelector("my-widget");
  if (!myWidget) return;

  myWidget.style.setProperty(
    "--widget-border-radius",
    state.borderRadius + "px",
  );
  myWidget.style.setProperty("--progress-radius", state.progressRadius + "px");
  myWidget.style.setProperty("--widget-bg-color", state.backgroundColor);
  myWidget.style.setProperty("--widget-border-color", state.borderColor);
  myWidget.style.setProperty("--widget-text-color", state.textColor);

  // Додаємо CSS змінні для градієнтів
  myWidget.style.setProperty("--progress-gradient", state.progressGradient);
  myWidget.style.setProperty("--progress-bg-color", state.progressBackground);
}

function updateAll() {
  updateWidget();
  updateCSSExport();
}

// ============= BASIC CONTROLS =============
function initControls() {
  // Border Radius Slider
  const borderRadiusSlider = document.getElementById("border-radius-slider");
  if (borderRadiusSlider) {
    borderRadiusSlider.value = state.borderRadius;
    borderRadiusSlider.addEventListener("input", function (e) {
      state.borderRadius = parseInt(e.target.value);
      updateAll();
    });
  }

  // Progress Radius Slider
  const progressRadiusSlider = document.getElementById(
    "progress-radius-slider",
  );
  if (progressRadiusSlider) {
    progressRadiusSlider.value = state.progressRadius;
    progressRadiusSlider.addEventListener("input", function (e) {
      state.progressRadius = parseInt(e.target.value);
      updateAll();
    });
  }

  // Background Color Picker
  const bgColorPicker = document.getElementById("background-color-picker");
  if (bgColorPicker) {
    bgColorPicker.value = state.backgroundColor;
    bgColorPicker.addEventListener("input", function (e) {
      state.backgroundColor = e.target.value;
      updateAll();
    });
  }
}

// ============= GRADIENT FUNCTIONS =============
function generateGradient() {
  if (gradientStops.length === 1) {
    return gradientStops[0].color;
  }
  const sorted = [...gradientStops].sort((a, b) => a.position - b.position);
  const stops = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
  return `linear-gradient(${gradientAngle}deg, ${stops})`;
}

function updateGradientPreview() {
  const preview = document.getElementById("gradientPreview");
  const cssOutput = document.getElementById("cssOutput");

  if (!preview) return; // Якщо елемента немає на сторінці, виходимо

  const bg = generateGradient();
  preview.style.background = bg;
  if (cssOutput) {
    cssOutput.textContent = `background: ${bg};`;
  }

  // Оновлюємо state.progressGradient новим градієнтом
  state.progressGradient = bg;

  // Оновлюємо віджет і CSS експорт
  updateAll();

  renderHandles();
}

function renderStops() {
  const stopsContainer = document.getElementById("colorStops");
  if (!stopsContainer) return;

  stopsContainer.innerHTML = "";
  gradientStops.forEach((stop) => {
    const el = document.createElement("div");
    el.className = "color-stop";
    el.innerHTML = `
      <input type="color" value="${stop.color}" data-id="${stop.id}">
      <div class="color-value">${stop.color}</div>
      <button class="remove-stop-btn" data-id="${stop.id}">×</button>
    `;
    stopsContainer.appendChild(el);
  });

  stopsContainer.querySelectorAll('input[type="color"]').forEach((inp) => {
    inp.addEventListener("input", (e) => {
      const stop = gradientStops.find((s) => s.id == e.target.dataset.id);
      stop.color = e.target.value;
      e.target.nextElementSibling.textContent = e.target.value;
      updateGradientPreview();
    });
  });

  stopsContainer.querySelectorAll(".remove-stop-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (gradientStops.length > 1) {
        gradientStops = gradientStops.filter(
          (s) => s.id != e.target.dataset.id,
        );
        renderStops();
        updateGradientPreview();
      }
    });
  });
}

function renderHandles() {
  const preview = document.getElementById("gradientPreview");
  if (!preview) return;

  preview.querySelectorAll(".color-stop-handle").forEach((e) => e.remove());

  gradientStops.forEach((stop) => {
    const handle = document.createElement("div");
    handle.className = "color-stop-handle";
    handle.style.left = stop.position + "%";
    handle.style.background = stop.color;

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = stop.position + "%";
    tooltip.style.display = "none";
    handle.appendChild(tooltip);

    handle.addEventListener("mousedown", (e) => {
      handle.classList.add("dragging");
      tooltip.style.display = "block";
      const rect = preview.getBoundingClientRect();

      function move(ev) {
        const pos = Math.min(
          Math.max(((ev.clientX - rect.left) / rect.width) * 100, 0),
          100,
        );
        stop.position = Math.round(pos);
        handle.style.left = stop.position + "%";
        tooltip.textContent = stop.position + "%";
        updateGradientPreview();
      }

      function up() {
        handle.classList.remove("dragging");
        tooltip.style.display = "none";
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      }

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });

    preview.appendChild(handle);
  });
}

function initGradientControls() {
  const addStopBtn = document.getElementById("addStopBtn");
  const angleCircle = document.getElementById("angleCircle");
  const angleIndicator = document.getElementById("angleIndicator");
  const angleValue = document.getElementById("angleValue");

  if (addStopBtn) {
    addStopBtn.addEventListener("click", () => {
      const sorted = [...gradientStops].sort((a, b) => a.position - b.position);
      let newPos = 50;

      if (sorted.length >= 2) {
        let biggestGap = { start: 0, end: 100, size: 0 };
        for (let i = 0; i < sorted.length - 1; i++) {
          const gap = sorted[i + 1].position - sorted[i].position;
          if (gap > biggestGap.size)
            biggestGap = {
              start: sorted[i].position,
              end: sorted[i + 1].position,
              size: gap,
            };
        }
        newPos = biggestGap.start + biggestGap.size / 2;
      } else if (sorted.length === 1) {
        newPos = sorted[0].position === 0 ? 100 : 0;
      } else {
        newPos = 0;
      }

      const randomColor =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
      gradientStops.push({
        id: nextId++,
        color: randomColor,
        position: Math.round(newPos),
      });
      renderStops();
      updateGradientPreview();
    });
  }

  if (angleCircle) {
    function calculateAngle(e) {
      const rect = angleCircle.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
      return Math.round(angle);
    }

    angleCircle.addEventListener("mousedown", (e) => {
      const move = (ev) => {
        gradientAngle = calculateAngle(ev);
        if (angleIndicator) {
          angleIndicator.style.transform = `rotate(${gradientAngle}deg)`;
        }
        if (angleValue) {
          angleValue.textContent = `${gradientAngle}°`;
        }
        updateGradientPreview();
      };

      document.addEventListener("mousemove", move);
      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", move);
        },
        { once: true },
      );
    });
  }
}

// ============= INITIALIZATION =============
window.onload = function () {
  initControls();
  initGradientControls();
  updateAll();

  // Initialize gradient UI if elements exist
  if (document.getElementById("gradientPreview")) {
    renderStops();
    updateGradientPreview();
  }
};
