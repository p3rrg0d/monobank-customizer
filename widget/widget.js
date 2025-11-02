class MyWidget extends HTMLElement {
  constructor() {
    super();

    // Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });

    // CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "widget/widget.css";

    const template = document.getElementById("widget-template");
    const content = template.content.cloneNode(true);

    shadow.append(link, content);
  }
}

// register
customElements.define("my-widget", MyWidget);
