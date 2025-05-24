(function () {
  const variable = "--button-background-color";
  const savedColor = localStorage.getItem(variable);
  document.documentElement.style.setProperty(variable, savedColor);
})();

document.addEventListener("DOMContentLoaded", () => {
  const colorSelector = document.querySelector("#button-bg");
  const toggleButton = document.querySelector(".color-selector-toggle");
  const resetButton = document.querySelector(".color-selector-reset");
  const defaultColor = "#fb2056";
  const variable = "--button-background-color";

  const savedColor = localStorage.getItem(variable) || defaultColor;
  document.documentElement.style.setProperty(variable, savedColor);
  colorSelector.value = savedColor;
  toggleButton.style.backgroundColor = savedColor;

  window.dispatchEvent(new CustomEvent("colorChange", { detail: { color: savedColor } }));

  if (toggleButton && colorSelector) {
    toggleButton.addEventListener("click", () => {
      colorSelector.click();
    });
  }

  if (colorSelector) {
    colorSelector.addEventListener("input", () => {
      const color = colorSelector.value;
      document.documentElement.style.setProperty(variable, color);
      toggleButton.style.backgroundColor = color;
      localStorage.setItem(variable, color);

      window.dispatchEvent(new CustomEvent("colorChange", { detail: { color } }));
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      document.documentElement.style.setProperty(variable, defaultColor);
      colorSelector.value = defaultColor;
      toggleButton.style.backgroundColor = defaultColor;
      localStorage.removeItem(variable);

      window.dispatchEvent(new CustomEvent("colorChange", { detail: { color: defaultColor } }));
    });
  }
});
