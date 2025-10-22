// =============================
// Falling Leaves Animation
// In Like Flynn LLC
// =============================

// Select the leaf layer inside the gutter banner
const leafLayer = document.querySelector('.leaf-layer');

if (leafLayer) {
  // Different leaf types for visual variety
  const leaves = ['🍁', '🍂', '🍃'];

  // Function to spawn a single leaf
  function spawnLeaf() {
    const leaf = document.createElement('span');
    leaf.classList.add('leaf');
    leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];

    // Randomize size slightly for realism
    const size = Math.random() * 1.1 + 0.8; // 0.8–1.9rem
    leaf.style.fontSize = `${size}rem`;

    // Random horizontal position (0–100%)
    leaf.style.left = `${Math.random() * 100}%`;

    // Slight random tilt and drift direction
    const drift = Math.random() * 40 - 20; // -20px to +20px
    const spin = Math.random() > 0.5 ? 360 : -360; // random rotation direction

    // Animation timing
    const duration = Math.random() * 3 + 5; // 5–8s fall duration
    const delay = Math.random() * 2; // 0–2s delay before fall

    // Apply inline animation timing
    leaf.style.animationDuration = `${duration}s`;
    leaf.style.animationDelay = `${delay}s`;

    // Random starting horizontal offset
    leaf.style.transform = `translateX(${drift}px) rotate(${Math.random() * 45 - 22}deg)`;

    // Add to the layer
    leafLayer.appendChild(leaf);

    // Animate via CSS keyframes (already defined in leaves.css)
    // The inline transform adds realism while the keyframes control the fall path

    // Clean up after animation completes
    setTimeout(() => leaf.remove(), (duration + delay) * 1000);
  }

  // Spawn a new leaf every ~1.4 seconds for a natural rhythm
  setInterval(spawnLeaf, 1400);
}
