const helpIcon = document.querySelector(".help-icon");
const helpPopup = document.querySelector(".help-popup");
const closeBtn = document.querySelector(".close-btn");

if (helpIcon && helpPopup) {
  helpIcon.addEventListener("click", () => {
    helpPopup.style.display = "block";
  });
}

if (closeBtn && helpPopup) {
  closeBtn.addEventListener("click", () => {
    helpPopup.style.display = "none";
  });
}

document.querySelectorAll(".range").forEach((range) => {
  const input = range.querySelector('input[type="range"]');
  const output = range.querySelector(".range-value");

  // Skip if elements don't exist (gradient ranges don't have .range-value)
  if (!input || !output) return;

  function update() {
    // Check if this is an opacity slider
    if (input.id && input.id.includes("opacity")) {
      output.textContent = parseFloat(input.value).toFixed(2);
    }
    // Check if this is a progress slider
    else if (input.id && input.id.includes("progress")) {
      output.textContent = input.value + "₴";
    }
    else {
      output.textContent = input.value + "px";
    }
  }

  input.addEventListener("input", update);
  update();
});

function makeDraggable(elem) {
  let offsetX = 0;
  let offsetY = 0;
  let isDown = false;

  elem.addEventListener("mousedown", (e) => {
    isDown = true;
    offsetX = e.clientX - elem.offsetLeft;
    offsetY = e.clientY - elem.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    elem.style.left = e.clientX - offsetX + "px";
    elem.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    isDown = false;
  });
}

makeDraggable(document.querySelector(".draggable"));

// Accordion functionality for control sections
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".control-section h3").forEach((header) => {
    // Add arrow indicator
    header.style.cursor = "pointer";
    header.style.userSelect = "none";
    header.innerHTML = `<span style="display: flex; align-items: center; justify-content: center; gap: 8px;">
      <span class="accordion-arrow" style="transition: transform 0.3s;">▼</span>
      ${header.textContent}
    </span>`;

    // Store reference to the content wrapper
    const section = header.parentElement;
    const contentWrapper = section.querySelector(".section-content");

    header.addEventListener("click", () => {
      const arrow = header.querySelector(".accordion-arrow");
      const isCollapsed = section.classList.contains("collapsed");

      if (isCollapsed) {
        // Expand
        if (contentWrapper) contentWrapper.style.display = "block";
        section.classList.remove("collapsed");
        arrow.style.transform = "rotate(0deg)";
      } else {
        // Collapse
        if (contentWrapper) contentWrapper.style.display = "none";
        section.classList.add("collapsed");
        arrow.style.transform = "rotate(-90deg)";
      }
    });

    // Collapse by default
    const isPreviewSettings = contentWrapper && contentWrapper.id === "preview-settings";

    if (!isPreviewSettings) {
      // Collapse тільки якщо це НЕ preview settings
      if (contentWrapper) contentWrapper.style.display = "none";
      section.classList.add("collapsed");
      const arrow = header.querySelector(".accordion-arrow");
      if (arrow) arrow.style.transform = "rotate(-90deg)";
    }
  });
});

