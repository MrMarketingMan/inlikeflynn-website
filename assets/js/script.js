// ==========================
// Popup Logic
// ==========================
function openPopup() {
  document.getElementById("gutter-popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("gutter-popup").style.display = "none";
}

// ==========================
// Falling Leaves Animation
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const leafContainer = document.querySelector(".leaves");
  if (!leafContainer) return;

  const leafTypes = ["🍂", "🍁", "🍃"];
  const numLeaves = 5; // matches your HTML structure

  // Randomize each leaf’s properties
  const leaves = leafContainer.querySelectorAll("span");
  leaves.forEach((leaf, i) => {
    const randomLeaf = leafTypes[Math.floor(Math.random() * leafTypes.length)];
    leaf.textContent = randomLeaf;

    // random horizontal starting position
    const randomLeft = Math.random() * 90 + 5; // between 5% and 95%
    leaf.style.left = randomLeft + "%";

    // random size between 0.9rem–1.5rem
    const randomSize = Math.random() * (1.5 - 0.9) + 0.9;
    leaf.style.fontSize = randomSize + "rem";

    // random animation duration (4–8 seconds)
    const randomDuration = Math.random() * (8 - 4) + 4;
    leaf.style.animationDuration = randomDuration + "s";

    // random delay to stagger falls
    const randomDelay = Math.random() * 2;
    leaf.style.animationDelay = randomDelay + "s";
  });
});
