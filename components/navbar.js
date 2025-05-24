document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelector(".nav-links");
  const hamburgerButton = document.querySelector(".hamburger-button");
  const hamburgerIcon = document.querySelector(".hamburger-icon");
  const crossIcon = document.querySelector(".cross-icon");
  let isMenuOpen = false;

  if (navLinks && hamburgerButton && hamburgerIcon && crossIcon) {
    hamburgerButton.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen;
      navLinks.style.right = isMenuOpen ? "0" : "-100%";
      hamburgerIcon.style.display = isMenuOpen ? "none" : "block";
      crossIcon.style.display = isMenuOpen ? "block" : "none";
      document.body.style.position = isMenuOpen ? "fixed" : "";
      document.body.style.width = isMenuOpen ? "100%" : "";
    });
  }
});
