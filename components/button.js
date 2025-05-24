document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button:not(.color-selector-reset)");
  let currentColor = getComputedStyle(document.documentElement).getPropertyValue("--button-background-color").trim();

  function hexToHSL(hex) {
    hex = hex.replace(/^#/, "");
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function darkenColor(hex, percent) {
    const { h, s, l } = hexToHSL(hex);
    const newLightness = Math.max(l * (percent / 100), 0);
    return hslToHex(h, s, newLightness);
  }

  function updateButtonHover() {
    const darkerColor = darkenColor(currentColor, 80);
    buttons.forEach((button) => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("click", handleClick);

      function handleMouseEnter() {
        button.style.backgroundColor = darkerColor;
      }

      function handleMouseLeave() {
        button.style.backgroundColor = currentColor;
      }

      function handleClick() {
        button.style.backgroundColor = currentColor;
        button.blur();
      }

      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseleave", handleMouseLeave);
      button.addEventListener("click", handleClick);

      button.style.backgroundColor = currentColor;
    });
  }

  updateButtonHover();

  window.addEventListener("colorChange", (event) => {
    currentColor = event.detail.color;
    updateButtonHover();
  });
});
