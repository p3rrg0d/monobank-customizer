
function setNestedProp(obj: any, path: string, value: any) {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const lastObj = keys.reduce((prev, curr) => prev && prev[curr], obj);
    if (lastObj) {
        lastObj[lastKey] = value;
    }
}

function bindSlider(editor: any, slider: any, statePath: string, formatter = (v: any) => v, parser = parseFloat) {
    if (!slider) return;

    slider.addEventListener("mousedown", () => {
        editor.saveState();
    });
    slider.addEventListener("touchstart", () => {
        editor.saveState();
    });

    slider.addEventListener("input", (e: any) => {
        const val = parser(e.target.value);
        setNestedProp(editor.state, statePath, val);
        const rangeVal = e.target.nextElementSibling;
        if (rangeVal) rangeVal.textContent = formatter(val);
        editor.updateAll();
    });
}

export function bindWidgetEvents(editor: any) {
    editor.dom.bgTypeSelect.addEventListener("change", (e: any) => {
        editor.saveState();
        editor.state.background.type = e.target.value;
        editor.togglePanel(
            editor.state.background.type,
            editor.dom.bgSolidPanel,
            editor.dom.bgGradientPanel,
            editor.bgGradientPicker
        );
        editor.updateAll();
    });

    bindSlider(editor, editor.dom.bgSolidOpacity, "background.opacity", (v) => v.toFixed(2));
    bindSlider(editor, editor.dom.radiusSlider, "border.radius", (v) => `${v}px`, parseInt);
}

export function bindBorderEvents(editor: any) {
    editor.dom.borderCheckbox.addEventListener("change", (e: any) => {
        editor.saveState();
        editor.state.border.enabled = e.target.checked;
        editor.dom.borderControls.style.display = e.target.checked ? "block" : "none";
        if (!e.target.checked) {
            editor.state.border.width = 0;
        } else {
            editor.state.border.width = 2;
            editor.state.border.opacity = 1;
            editor.dom.borderOpacity.value = 1;
            editor.dom.borderWidthSlider.value = 2;
        }
        editor.updateAll();
    });

    editor.dom.borderStyleSelect.addEventListener("change", (e: any) => {
        editor.saveState();
        editor.state.border.style = e.target.value;
        editor.updateAll();
    });

    bindSlider(editor, editor.dom.borderWidthSlider, "border.width", (v) => `${v}px`, parseInt);
    bindSlider(editor, editor.dom.borderOpacity, "border.opacity", (v) => v.toFixed(2));
}

export function bindQREvents(editor: any) {
    if (editor.dom.qrFrameSelect) {
        editor.dom.qrFrameSelect.addEventListener("change", (e: any) => {
            editor.saveState();
            editor.state.qrFrame = e.target.value;
            editor.updateAll();
        });
    }
}

export function bindTextEvents(editor: any) {
    if (editor.dom.textShadowCheckbox) {
        editor.dom.textShadowCheckbox.addEventListener("change", (e: any) => {
            editor.saveState();
            editor.state.text.shadow.enabled = e.target.checked;
            if (editor.dom.textShadowControls) {
                editor.dom.textShadowControls.style.display = e.target.checked ? "block" : "none";
            }
            editor.updateAll();
        });
    }

    bindSlider(editor, editor.dom.textShadowX, "text.shadow.x", (v) => `${v}px`, parseInt);
    bindSlider(editor, editor.dom.textShadowY, "text.shadow.y", (v) => `${v}px`, parseInt);
    bindSlider(editor, editor.dom.textShadowBlur, "text.shadow.blur", (v) => `${v}px`, parseInt);
}

export function bindProgressEvents(editor: any) {
    bindSlider(editor, editor.dom.progressRadius, "progress.radius", (v) => `${v}px`, parseInt);

    editor.dom.progTrackTypeSelect.addEventListener("change", (e: any) => {
        editor.saveState();
        editor.state.progress.track.type = e.target.value;
        editor.togglePanel(
            editor.state.progress.track.type,
            editor.dom.progTrackSolidPanel,
            editor.dom.progTrackGradientPanel,
            editor.trackGradientPicker
        );
        editor.updateAll();
    });

    bindSlider(editor, editor.dom.progTrackSolidOpacity, "progress.track.opacity", (v) => v.toFixed(2));

    editor.dom.progFillTypeSelect.addEventListener("change", (e: any) => {
        editor.saveState();
        editor.state.progress.fill.type = e.target.value;
        editor.togglePanel(
            editor.state.progress.fill.type,
            editor.dom.progFillSolidPanel,
            editor.dom.progFillGradientPanel,
            editor.fillGradientPicker
        );
        editor.updateAll();
    });

    bindSlider(editor, editor.dom.progFillSolidOpacity, "progress.fill.opacity", (v) => v.toFixed(2));
}

export function bindPreviewEvents(editor: any) {
    if (editor.dom.previewProgressSlider) {
        editor.dom.previewProgressSlider.addEventListener("input", (e: any) => {
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

    if (editor.dom.resetBgBtn) {
        editor.dom.resetBgBtn.addEventListener("click", () => {
            const picker = editor.pickrManager.pickers.previewBg;
            if (picker) {
                picker.setColor('rgba(0, 0, 0, 0)');
            }
        });
    }
}

export function bindActionButtons(editor: any) {
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

    if (editor.dom.redoBtn) {
        editor.dom.redoBtn.addEventListener("click", () => {
            editor.redo();
        });
    }
}

export function bindCollapsibleSections() {
    const headers = document.querySelectorAll('.control-panel h3:not(.preset-showcase-trigger)');
    headers.forEach(header => {
        const sectionContent = header.parentElement?.querySelector('.section-content');
        if (sectionContent) {
            header.addEventListener('click', () => {
                const isCollapsed = sectionContent.classList.toggle('collapsed');
                header.classList.toggle('collapsed', isCollapsed);
            });
        }
    });
}

export function bindAllEvents(editor: any) {
    bindWidgetEvents(editor);
    bindBorderEvents(editor);
    bindQREvents(editor);
    bindProgressEvents(editor);
    bindTextEvents(editor);
    bindPreviewEvents(editor);
    bindActionButtons(editor);
    bindCollapsibleSections();
}
