class MyWidget extends HTMLElement {
    constructor() {
        super();

        // Shadow DOM
        const shadow = this.attachShadow({ mode: "open" });
        // CSS
        const baseStyles = document.createElement("link");
        baseStyles.rel = "stylesheet";
        baseStyles.href = "widget/widget.css";
        const customStyles = document.createElement("link");
        customStyles.rel = "stylesheet";
        customStyles.href = "widget/custom_widget.css";

        // template
        const template = document.getElementById("widget-template") as HTMLTemplateElement;
        if (template) {
            const content = template.content.cloneNode(true);
            shadow.append(baseStyles, customStyles, content);
        }
    }
}

// register
if (!customElements.get("my-widget")) {
    customElements.define("my-widget", MyWidget);
}
