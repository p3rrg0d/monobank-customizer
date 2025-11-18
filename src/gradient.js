// Generate CSS gradient string
function generateGradientCSS(gradientData) {
  const sortedStops = [...gradientData.stops].sort(
    (a, b) => a.position - b.position,
  );
  const stopsString = sortedStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  if (gradientData.type === "linear") {
    return `linear-gradient(${gradientData.angle}deg, ${stopsString})`;
  } else {
    return `radial-gradient(circle, ${stopsString})`;
  }
}

// Add a new color stop
function addGradientStop(gradientData, position = 50) {
  const newStop = {
    id: gradientData.nextId,
    color: "#ff0000",
    position: position,
  };

  gradientData.stops.push(newStop);
  gradientData.nextId++;

  renderGradientEditor(gradientData);
  updateGradientPreview(gradientData);
}

// Remove a color stop
function removeGradientStop(gradientData, stopId) {
  if (gradientData.stops.length <= 2) {
    alert("Gradient must have at least 2 color stops");
    return;
  }

  gradientData.stops = gradientData.stops.filter((stop) => stop.id !== stopId);
  renderGradientEditor(gradientData);
  updateGradientPreview(gradientData);
}

// Update color stop
function updateGradientStop(gradientData, stopId, property, value) {
  const stop = gradientData.stops.find((s) => s.id === stopId);
  if (stop) {
    stop[property] = property === "position" ? parseFloat(value) : value;
    renderGradientEditor(gradientData);
    updateGradientPreview(gradientData);
  }
}

// Update gradient type or angle
function updateGradientProperty(gradientData, property, value) {
  gradientData[property] = property === "angle" ? parseFloat(value) : value;
  renderGradientEditor(gradientData);
  updateGradientPreview(gradientData);
}

// Render the gradient editor UI
function renderGradientEditor(gradientData) {
  const container = document.getElementById("gradient-editor-container");
  if (!container) return;

  const sortedStops = [...gradientData.stops].sort(
    (a, b) => a.position - b.position,
  );

  container.innerHTML = `
    <div class="gradient-editor">
      <div class="gradient-preview" id="gradient-preview"></div>

      <div class="gradient-controls">
        <div class="control-row">
          <label>Type</label>
          <select id="gradient-type" class="gradient-select">
            <option value="linear" ${gradientData.type === "linear" ? "selected" : ""}>Linear</option>
            <option value="radial" ${gradientData.type === "radial" ? "selected" : ""}>Radial</option>
          </select>
        </div>

        ${
          gradientData.type === "linear"
            ? `
          <div class="control-row">
            <label>Angle</label>
            <div class="range">
              <input
                type="range"
                id="gradient-angle"
                min="0"
                max="360"
                step="0.1"
                value="${gradientData.angle}"
              />
              <span class="range-value">${gradientData.angle.toFixed(1)}°</span>
            </div>
          </div>
        `
            : ""
        }

        <div class="gradient-stops">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label style="margin: 0;">Color Stops</label>
            <button class="add-stop-btn" id="add-gradient-stop">
              <span style="font-size: 16px; font-weight: bold;">+</span> Add
            </button>
          </div>

          ${sortedStops
            .map(
              (stop) => `
            <div class="gradient-stop" data-stop-id="${stop.id}">
              <input
                type="color"
                class="stop-color"
                value="${stop.color}"
                data-stop-id="${stop.id}"
              />
              <input
                type="range"
                class="stop-position"
                min="0"
                max="100"
                step="1"
                value="${stop.position}"
                data-stop-id="${stop.id}"
              />
              <span class="stop-position-value">${stop.position}%</span>
              <button
                class="remove-stop-btn"
                data-stop-id="${stop.id}"
                ${sortedStops.length <= 2 ? "disabled" : ""}
              >×</button>
            </div>
          `,
            )
            .join("")}
        </div>

        <div class="gradient-css-output">
          <label>Generated CSS:</label>
          <textarea readonly rows="3">${generateGradientCSS(gradientData)}</textarea>
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  attachGradientEventListeners(gradientData);
  updateGradientPreview(gradientData);
}

// Attach all event listeners
function attachGradientEventListeners(gradientData) {
  // Type selector
  const typeSelect = document.getElementById("gradient-type");
  if (typeSelect) {
    typeSelect.addEventListener("change", (e) => {
      updateGradientProperty(gradientData, "type", e.target.value);
    });
  }

  // Angle slider
  const angleSlider = document.getElementById("gradient-angle");
  if (angleSlider) {
    angleSlider.addEventListener("input", (e) => {
      updateGradientProperty(gradientData, "angle", e.target.value);
    });
  }

  // Add stop button
  const addBtn = document.getElementById("add-gradient-stop");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      addGradientStop(gradientData, 50);
    });
  }

  // Color inputs
  document.querySelectorAll(".stop-color").forEach((input) => {
    input.addEventListener("input", (e) => {
      const stopId = parseInt(e.target.dataset.stopId);
      updateGradientStop(gradientData, stopId, "color", e.target.value);
    });
  });

  // Position sliders
  document.querySelectorAll(".stop-position").forEach((input) => {
    input.addEventListener("input", (e) => {
      const stopId = parseInt(e.target.dataset.stopId);
      updateGradientStop(gradientData, stopId, "position", e.target.value);
    });
  });

  // Remove buttons
  document.querySelectorAll(".remove-stop-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const stopId = parseInt(e.target.dataset.stopId);
      removeGradientStop(gradientData, stopId);
    });
  });
}

// Update the visual preview
function updateGradientPreview(gradientData) {
  const preview = document.getElementById("gradient-preview");
  if (preview) {
    preview.style.background = generateGradientCSS(gradientData);
  }

  // Update your widget here
  const myWidget = document.querySelector("my-widget");
  if (myWidget) {
    myWidget.style.setProperty(
      "--progress-gradient",
      generateGradientCSS(gradientData),
    );
  }
}

// Initialize the gradient editor
function initGradientEditor(containerId, initialGradientData = null) {
  const data = initialGradientData || gradientState;
  renderGradientEditor(data);
  return data;
}

// Export for use in your main editor.js
window.GradientEditor = {
  init: initGradientEditor,
  generateCSS: generateGradientCSS,
  state: gradientState,
};
