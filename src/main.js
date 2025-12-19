import { WidgetEditor } from './WidgetEditor.js';
import { SnowManager } from './utils/SnowManager.js';

document.addEventListener("DOMContentLoaded", () => {
    window.widgetEditor = new WidgetEditor();

    // Initialize Snow
    const snow = new SnowManager();
    snow.init();
});
