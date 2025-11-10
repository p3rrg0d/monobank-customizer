// defaults
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

// configuring the conrols
const controlsConfig = [
  {
    id: "border-radius-slider",
    property: "borderRadius",
    type: "number",
    suffix: "px",
  },
  {
    id: "background-color-picker",
    property: "backgroundColor",
    type: "color",
  },
  {
    id: "progress-radius-slider",
    property: "progressRadius",
    type: "number",
    suffifx: "px",
  },
  // future controls
];

// css generator
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

// CSS Export update function
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

    // Delete old text
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

// upd widget func
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
  // Додавай нові змінні тут
}

// Загальна функція оновлення
function updateAll() {
  updateWidget();
  updateCSSExport();
}

// Ініціалізація контролів
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
  // color picker?
  const bgColorPicker = document.getElementById("background-color-picker");
  if (bgColorPicker) {
    bgColorPicker.value = state.backgroundColor;
    bgColorPicker.addEventListener("input", function (e) {
      state.backgroundColor = e.target.value;
      updateAll();
    });
  }

  // new controls right here
}

// Головна функція
window.onload = function () {
  initControls();
  updateAll();

  // update
  const valueDisplay = document.getElementById("slider");
  if (valueDisplay) {
    valueDisplay.textContent = state.borderRadius + "px";
  }
};
