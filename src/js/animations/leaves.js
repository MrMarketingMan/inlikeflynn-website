// =============================
// Falling Leaves Animation (GPU-friendly transforms only)
// - Runs only when a leaf banner/container exists
// - Cleans up interval on container removal or page unload
// =============================

// Support either .leaf-banner (requested) or current .gutter-banner container
const leafContainer = document.querySelector('.leaf-banner, .gutter-banner');
const leafLayer = leafContainer?.querySelector('.leaf-layer') || null;

if (leafContainer && leafLayer) {
  // Emoji options for leaf styles
  const leaves = ["🍁", "🍂", "🍃"];

  /**
   * Spawns a single falling leaf with random size, position, and motion.
   */
  function spawnLeaf() {
    if (!leafLayer.isConnected) return; // stop if layer removed

    // Create a new leaf element
    const leaf = document.createElement("span");
    leaf.classList.add("leaf");
    leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];

    // --- Randomized visual and motion settings ---
    const size = Math.random() * 1.1 + 0.8;           // 0.8–1.9rem
    const startLeft = Math.random() * 100;            // random horizontal start (%)
    const drift = Math.random() * 40 - 20;            // side offset -20 to +20px
    const duration = Math.random() * 4 + 6;           // 6–10s fall duration
    const delay = Math.random() * 2;                  // 0–2s random start delay

    // Apply basic styles
    leaf.style.fontSize = `${size}rem`;
    leaf.style.left = `${startLeft}%`;

    // Assign fall animation (CSS handles vertical + rotation)
    leaf.style.animation = `fall ${duration}s ease-in-out forwards`;
    leaf.style.animationDelay = `${delay}s`;

    // Give each leaf a slightly different tilt
    leaf.style.transform = `translateX(${drift}px) rotate(${Math.random() * 45 - 22}deg)`;

    // Add to DOM
    leafLayer.appendChild(leaf);

    // --- Opacity animation (JS-based, synced to duration) ---
    leaf.animate(
      [
        { opacity: 0 },            // start invisible
        { opacity: 1, offset: 0.15 }, // fade in early
        { opacity: 1, offset: 0.85 }, // stay visible most of the time
        { opacity: 0 }             // fade out near the end
      ],
      {
        duration: (duration + delay) * 1000, // scale fade timing to leaf duration
        easing: "ease-in-out",
        fill: "forwards"
      }
    );

    // --- Cleanup ---
    // Remove the leaf after its animation fully completes
    setTimeout(() => leaf.remove(), (duration + delay) * 1000);
  }

  // --- Continuous spawning loop ---
  // Spawns a new leaf every 1.4s for a steady flow
  const leafInterval = setInterval(() => {
    // Stop interval if layer removed from DOM
    if (!document.body.contains(leafLayer) || !document.body.contains(leafContainer)) {
      clearInterval(leafInterval);
      return;
    }
    spawnLeaf();
  }, 1400);

  // Clear on page unload/navigation to avoid stray timers
  const cleanup = () => clearInterval(leafInterval);
  window.addEventListener('pagehide', cleanup, { once: true });
} else {
  console.info("Leaf banner/layer not found — skipping falling leaves animation.");
}
