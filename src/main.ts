import { WidgetEditor } from './WidgetEditor.ts';
import { SnowManager } from './utils/SnowManager.ts';

document.addEventListener("DOMContentLoaded", () => {
    (window as any).widgetEditor = new WidgetEditor();

    // Initialize Snow
    const snow = new SnowManager();
    snow.init();
});
