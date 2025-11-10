const helpIcon = document.querySelector(".help-icon");
const helpPopup = document.querySelector(".help-popup");
const closeBtn = document.querySelector(".close-btn");

helpIcon.addEventListener("click", () => {
  helpPopup.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  helpPopup.style.display = "none";
});

document.querySelectorAll(".range").forEach((range) => {
  const input = range.querySelector('input[type="range"]');
  const output = range.querySelector(".range-value");

  function update() {
    output.textContent = input.value + "px";
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
