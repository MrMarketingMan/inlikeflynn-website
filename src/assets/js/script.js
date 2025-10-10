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

  const leafTypes = ["??", "??", "??"];
  const MAX_ACTIVE_LEAVES = 6;
  const LANDING_FRACTION = 0.85;
  let activeLeaves = 0;

  const randomRange = (min, max) => Math.random() * (max - min) + min;

  leafContainer.innerHTML = "";

  const spawnLeaf = () => {
    if (activeLeaves >= MAX_ACTIVE_LEAVES) return;

    const leaf = document.createElement("span");
    leaf.textContent = leafTypes[Math.floor(Math.random() * leafTypes.length)];
    leaf.style.left = `${randomRange(5, 95).toFixed(2)}%`;

    const size = randomRange(0.85, 1.4);
    leaf.style.fontSize = `${size.toFixed(2)}rem`;

    const duration = randomRange(5200, 8200);
    leaf.style.setProperty("--fall-duration", `${duration.toFixed(0)}ms`);

    const maxOpacity = randomRange(0.5, 0.85);
    leaf.style.setProperty("--max-opacity", `${maxOpacity.toFixed(2)}`);

    leaf.style.setProperty("--start-offset", `${randomRange(-35, 35).toFixed(0)}px`);
    leaf.style.setProperty("--sway-intro", `${randomRange(-20, 20).toFixed(0)}px`);
    leaf.style.setProperty("--sway-a", `${randomRange(-24, 24).toFixed(0)}px`);
    leaf.style.setProperty("--sway-b", `${randomRange(-28, 28).toFixed(0)}px`);
    leaf.style.setProperty("--sway-c", `${randomRange(-18, 18).toFixed(0)}px`);

    const landingOffset = randomRange(-18, 18);
    const landingRotate = randomRange(270, 330);
    leaf.style.setProperty("--landing-offset", `${landingOffset.toFixed(0)}px`);
    leaf.style.setProperty("--landing-rotate", `${landingRotate.toFixed(0)}deg`);
    leaf.style.setProperty("--landing-rotate-end", `${(landingRotate + randomRange(8, 24)).toFixed(0)}deg`);

    const negativeDelay = -randomRange(0, duration * 0.45);
    leaf.style.animationDelay = `${negativeDelay.toFixed(0)}ms`;

    leafContainer.appendChild(leaf);
    activeLeaves += 1;

    let landed = false;
    const timeToLand = Math.max(0, duration * LANDING_FRACTION - Math.abs(negativeDelay));

    const handleLanding = () => {
      if (landed) return;
      landed = true;
      leaf.classList.add("landed");
      activeLeaves = Math.max(0, activeLeaves - 1);

      setTimeout(() => {
        leaf.classList.add("fade-out");
      }, 200);

      setTimeout(() => {
        if (leaf.isConnected) {
          leaf.remove();
        }
      }, 1400);
    };

    const landTimer = setTimeout(handleLanding, timeToLand);

    leaf.addEventListener("animationend", () => {
      clearTimeout(landTimer);
      handleLanding();
    }, { once: true });

    leaf.addEventListener("transitionend", (event) => {
      if (event.propertyName === "opacity" && leaf.classList.contains("fade-out")) {
        leaf.remove();
      }
    });
  };

  const scheduleSpawn = () => {
    const delay = randomRange(400, 1200);
    setTimeout(() => {
      if (!document.hidden) {
        spawnLeaf();
      }
      scheduleSpawn();
    }, delay);
  };

  for (let i = 0; i < MAX_ACTIVE_LEAVES; i += 1) {
    spawnLeaf();
  }

  scheduleSpawn();
});




