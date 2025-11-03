const helpIcon = document.querySelector(".help-icon");
const helpPopup = document.querySelector(".help-popup");
const closeBtn = document.querySelector(".close-btn");

helpIcon.addEventListener("click", () => {
  helpPopup.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  helpPopup.style.display = "none";
});
