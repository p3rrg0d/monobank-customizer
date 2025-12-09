function bindSlider(editor, slider, stateProp, formatter = (v) => v, parser = parseFloat) {
    if (!slider) return;

    slider.addEventListener("mousedown", () => {
        editor.saveState();
    });
    slider.addEventListener("touchstart", () => {
        editor.saveState();
    });

    slider.addEventListener("input", (e) => {
        editor.state[stateProp] = parser(e.target.value);
        const rangeVal = e.target.nextElementSibling;
        if (rangeVal) rangeVal.textContent = formatter(editor.state[stateProp]);
        editor.updateAll();
    });
}

export function bindWidgetEvents(editor) {
    editor.dom.bgTypeSelect.addEventListener("change", (e) => {
        editor.saveState();
        editor.state.bgType = e.target.value;
        editor.togglePanel(
            editor.state.bgType,
            editor.dom.bgSolidPanel,
            editor.dom.bgGradientPanel,
            editor.bgGradientPicker
        );
        editor.updateAll();
    });

    bindSlider(editor, editor.dom.bgSolidOpacity, "bgSolidOpacity", (v) => v.toFixed(2));
    bindSlider(editor, editor.dom.radiusSlider, "borderRadius", (v) => `${v}px`, parseInt);
}

export function bindBorderEvents(editor) {
    editor.dom.borderCheckbox.addEventListener("change", (e) => {
        editor.saveState();
        editor.state.borderEnabled = e.target.checked;
        editor.dom.borderControls.style.display = e.target.checked ? "block" : "none";
        if (!e.target.checked) {
            editor.state.borderWidth = 0;
        } else {
            editor.state.borderWidth = 2;
            editor.state.borderOpacity = 1;
            editor.dom.borderOpacity.value = 1;
            editor.dom.borderWidthSlider.value = 2;
        }
        editor.updateAll();
    });

    editor.dom.borderStyleSelect.addEventListener("change", (e) => {
        editor.saveState();
        editor.state.borderStyle = e.target.value;
        editor.updateAll();
    });

    bindSlider(editor, editor.dom.borderWidthSlider, "borderWidth", (v) => `${v}px`, parseInt);
    bindSlider(editor, editor.dom.borderOpacity, "borderOpacity", (v) => v.toFixed(2));
}

export function bindQREvents(editor) {
    if (editor.dom.qrFrameSelect) {
        editor.dom.qrFrameSelect.addEventListener("change", (e) => {
            editor.saveState();
            editor.state.qrFrame = e.target.value;
            editor.updateAll();
        });
    }
}

export function bindTextEvents(editor) {
    if (editor.dom.textShadowCheckbox) {
        editor.dom.textShadowCheckbox.addEventListener("change", (e) => {
            editor.saveState();
            editor.state.textShadowEnabled = e.target.checked;
            if (editor.dom.textShadowControls) {
                editor.dom.textShadowControls.style.display = e.target.checked ? "block" : "none";
            }
            editor.updateAll();
        });
    }

    bindSlider(editor, editor.dom.textShadowX, "textShadowX", (v) => `${v}px`, parseInt);
    bindSlider(editor, editor.dom.textShadowY, "textShadowY", (v) => `${v}px`, parseInt);
    bindSlider(editor, editor.dom.textShadowBlur, "textShadowBlur", (v) => `${v}px`, parseInt);
}

export function bindProgressEvents(editor) {
    bindSlider(editor, editor.dom.progressRadius, "progressRadius", (v) => `${v}px`, parseInt);

    editor.dom.progTrackTypeSelect.addEventListener("change", (e) => {
        editor.saveState();
        editor.state.progTrackType = e.target.value;
        editor.togglePanel(
            editor.state.progTrackType,
            editor.dom.progTrackSolidPanel,
            editor.dom.progTrackGradientPanel,
            editor.trackGradientPicker
        );
        editor.updateAll();
    });

    bindSlider(editor, editor.dom.progTrackSolidOpacity, "progTrackSolidOpacity", (v) => v.toFixed(2));

    editor.dom.progFillTypeSelect.addEventListener("change", (e) => {
        editor.saveState();
        editor.state.progFillType = e.target.value;
        editor.togglePanel(
            editor.state.progFillType,
            editor.dom.progFillSolidPanel,
            editor.dom.progFillGradientPanel,
            editor.fillGradientPicker
        );
        editor.updateAll();
    });

    bindSlider(editor, editor.dom.progFillSolidOpacity, "progFillSolidOpacity", (v) => v.toFixed(2));
}

export function bindPreviewEvents(editor) {
    if (editor.dom.previewProgressSlider) {
        editor.dom.previewProgressSlider.addEventListener("input", (e) => {
            const val = e.target.value;
            const rangeValue = e.target.nextElementSibling;
            if (rangeValue) rangeValue.textContent = `${val}%`;

            if (editor.dom.widget && editor.dom.widget.shadowRoot) {
                const progressBar = editor.dom.widget.shadowRoot.querySelector('.progress');
                const textName = editor.dom.widget.shadowRoot.querySelector('.text-name');

                if (progressBar) progressBar.style.setProperty('--progress', `${val}%`);
                if (textName) textName.textContent = `${val}₴, ${val}%`;
            }
        });
    }
}

export function bindActionButtons(editor) {
    if (editor.dom.randomizeBtn) {
        editor.dom.randomizeBtn.addEventListener("click", () => {
            editor.randomize();
        });
    }

    if (editor.dom.undoBtn) {
        editor.dom.undoBtn.addEventListener("click", () => {
            editor.undo();
        });
    }
}

export function bindAllEvents(editor) {
    bindWidgetEvents(editor);
    bindBorderEvents(editor);
    bindQREvents(editor);
    bindProgressEvents(editor);
    bindTextEvents(editor);
    bindPreviewEvents(editor);
    bindActionButtons(editor);
}
