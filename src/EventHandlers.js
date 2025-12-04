/**
 * EventHandlers - Manages all UI event bindings for the widget editor
 * Organized by feature: widget background, border, progress, and preview
 */

/**
 * Bind widget background events
 * @param {WidgetEditor} editor - Widget editor instance
 */
export function bindWidgetEvents(editor) {
    // Background type selector
    editor.dom.bgTypeSelect.addEventListener("change", (e) => {
        editor.state.bgType = e.target.value;
        editor.togglePanel(
            editor.state.bgType,
            editor.dom.bgSolidPanel,
            editor.dom.bgGradientPanel,
            editor.bgGradientPicker
        );
        editor.updateAll();
    });

    // Background solid opacity
    editor.dom.bgSolidOpacity.addEventListener("input", (e) => {
        editor.state.bgSolidOpacity = parseFloat(e.target.value);
        e.target.nextElementSibling.textContent = editor.state.bgSolidOpacity.toFixed(2);
        editor.updateAll();
    });

    // Border radius
    editor.dom.radiusSlider.addEventListener("input", (e) => {
        editor.state.borderRadius = parseInt(e.target.value);
        editor.updateAll();
    });
}

/**
 * Bind border control events
 * @param {WidgetEditor} editor - Widget editor instance
 */
export function bindBorderEvents(editor) {
    // Border enabled checkbox
    editor.dom.borderCheckbox.addEventListener("change", (e) => {
        editor.state.borderEnabled = e.target.checked;
        editor.dom.borderControls.style.display = e.target.checked ? "block" : "none";
        if (!e.target.checked) {
            // Completely remove border by setting width to 0
            editor.state.borderWidth = 0;
        } else {
            // Restore border with default width and full opacity
            editor.state.borderWidth = 2; // Default border width
            editor.state.borderOpacity = 1;
            editor.dom.borderOpacity.value = 1;
            editor.dom.borderWidthSlider.value = 2;
        }
        editor.updateAll();
    });

    // Border style selector
    editor.dom.borderStyleSelect.addEventListener("change", (e) => {
        editor.state.borderStyle = e.target.value;
        editor.updateAll();
    });

    // Border width slider
    editor.dom.borderWidthSlider.addEventListener("input", (e) => {
        editor.state.borderWidth = parseInt(e.target.value);
        editor.updateAll();
    });

    // Border opacity
    editor.dom.borderOpacity.addEventListener("input", (e) => {
        editor.state.borderOpacity = parseFloat(e.target.value);
        editor.updateAll();
    });
}

/**
 * Bind QR code frame events
 * @param {WidgetEditor} editor - Widget editor instance
 */
export function bindQREvents(editor) {
    // QR frame selector
    if (editor.dom.qrFrameSelect) {
        editor.dom.qrFrameSelect.addEventListener("change", (e) => {
            editor.state.qrFrame = e.target.value;
            editor.updateAll();
        });
    }
}

/**
 * Bind progress bar events
 * @param {WidgetEditor} editor - Widget editor instance
 */
export function bindProgressEvents(editor) {
    // Progress radius
    editor.dom.progressRadius.addEventListener("input", (e) => {
        editor.state.progressRadius = parseInt(e.target.value);
        editor.updateAll();
    });

    // Progress track type selector
    editor.dom.progTrackTypeSelect.addEventListener("change", (e) => {
        editor.state.progTrackType = e.target.value;
        editor.togglePanel(
            editor.state.progTrackType,
            editor.dom.progTrackSolidPanel,
            editor.dom.progTrackGradientPanel,
            editor.trackGradientPicker
        );
        editor.updateAll();
    });

    // Progress track opacity
    editor.dom.progTrackSolidOpacity.addEventListener("input", (e) => {
        editor.state.progTrackSolidOpacity = parseFloat(e.target.value);
        e.target.nextElementSibling.textContent = editor.state.progTrackSolidOpacity.toFixed(2);
        editor.updateAll();
    });

    // Progress fill type selector
    editor.dom.progFillTypeSelect.addEventListener("change", (e) => {
        editor.state.progFillType = e.target.value;
        editor.togglePanel(
            editor.state.progFillType,
            editor.dom.progFillSolidPanel,
            editor.dom.progFillGradientPanel,
            editor.fillGradientPicker
        );
        editor.updateAll();
    });

    // Progress fill opacity
    editor.dom.progFillSolidOpacity.addEventListener("input", (e) => {
        editor.state.progFillSolidOpacity = parseFloat(e.target.value);
        e.target.nextElementSibling.textContent = editor.state.progFillSolidOpacity.toFixed(2);
        editor.updateAll();
    });
}

/**
 * Bind preview control events
 * @param {WidgetEditor} editor - Widget editor instance
 */
export function bindPreviewEvents(editor) {
    // Preview progress slider
    if (editor.dom.previewProgressSlider) {
        editor.dom.previewProgressSlider.addEventListener("input", (e) => {
            const val = e.target.value;
            const rangeValue = e.target.nextElementSibling;
            if (rangeValue) rangeValue.textContent = `${val}₴`;

            // Update widget progress
            if (editor.dom.widget && editor.dom.widget.shadowRoot) {
                const progressBar = editor.dom.widget.shadowRoot.querySelector('.progress');
                const textBalance = editor.dom.widget.shadowRoot.querySelector('.text-balance');
                const textName = editor.dom.widget.shadowRoot.querySelector('.text-name');

                if (progressBar) progressBar.style.setProperty('--progress', `${val}%`);
                if (textBalance) textBalance.textContent = `${val}₴`;
                if (textName) textName.textContent = `${val}₴, ${val}%`;
            }
        });
    }

    // Reset background button
    const resetBgBtn = document.getElementById("reset-bg-btn");
    if (resetBgBtn) {
        resetBgBtn.addEventListener("click", () => {
            const previewArea = document.querySelector(".widget-preview");
            if (previewArea) {
                // Clear inline style to revert to CSS default (checkerboard)
                previewArea.style.background = "";
            }

            // Reset the Pickr color picker to transparent
            if (editor.pickrManager && editor.pickrManager.pickers.previewBg) {
                editor.pickrManager.pickers.previewBg.setColor("rgba(255, 255, 255, 0)", true);
            }
        });
    }
}

/**
 * Bind action button events (Randomize, Undo)
 * @param {WidgetEditor} editor - Widget editor instance
 */
export function bindActionButtons(editor) {
    // Randomize button
    if (editor.dom.randomizeBtn) {
        editor.dom.randomizeBtn.addEventListener("click", () => {
            editor.randomize();
        });
    }

    // Undo button
    if (editor.dom.undoBtn) {
        editor.dom.undoBtn.addEventListener("click", () => {
            editor.undo();
        });
    }
}

/**
 * Bind all events
 * @param {WidgetEditor} editor - Widget editor instance
 */
export function bindAllEvents(editor) {
    bindWidgetEvents(editor);
    bindBorderEvents(editor);
    bindQREvents(editor);
    bindProgressEvents(editor);
    bindPreviewEvents(editor);
    bindActionButtons(editor);
}
