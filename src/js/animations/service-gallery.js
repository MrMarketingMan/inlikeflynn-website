/* =======================================================
   SERVICE GALLERY — Auto-Update (Vite + Netlify safe)
   - Accessibility: keydown (Space/Enter)
   - Robust imports via import.meta.glob + .default
   - Slug → folder mapping for nested directories
   - Graceful fallback when empty: "Pictures coming soon"
========================================================= */

const svcOverlay = document.getElementById("svcGalleryOverlay");
if (!svcOverlay) {
  console.info("Service gallery markup not found — skipping gallery script.");
} else {
  /* ---------- Element references ---------- */
  const svcGrid = document.getElementById("svcGrid");
  const svcClose = document.getElementById("svcCloseBtn");
  const svcTitle = document.getElementById("svcGalleryTitle");
  const svcLightbox = document.getElementById("svcLightbox");
  const svcLightboxImg = document.getElementById("svcLightboxImg");
  const svcLightboxCaption = document.getElementById("svcLightboxCaption");
  const svcLightboxClose = document.getElementById("svcLightboxClose");
  const svcPrev = document.getElementById("svcPrev");
  const svcNext = document.getElementById("svcNext");

  /* ---------- Auto-import all service images (recursive) ---------- */
  // Note: Using ** to capture nested folders like door-window/window-install
  const allImages = import.meta.glob(
    "/src/assets/img/services/**/*.{jpg,jpeg,png,webp}",
    { eager: true }
  );

  // Index images by their folder relative to services/ (e.g. "drywall", "door-window/window-install")
  const imagesByFolder = {};
  for (const absPath in allImages) {
    // Normalize and extract folder relative to services/
    // Example: /src/assets/img/services/drywall/p1.webp -> folder = "drywall"
    // Example: /src/assets/img/services/door-window/window-install/p1.webp -> folder = "door-window/window-install"
    const match = absPath.match(/services[\\/](.+)[\\/][^\\/]+\.(?:jpg|jpeg|png|webp)$/i);
    if (!match) continue;
    const folderKey = match[1];
    const mod = allImages[absPath];
    const url = (mod && mod.default) || mod; // Vite adds .default
    if (!imagesByFolder[folderKey]) imagesByFolder[folderKey] = [];
    imagesByFolder[folderKey].push({ src: url, caption: "" });
  }

  // Ensure deterministic order per folder
  for (const key in imagesByFolder) {
    imagesByFolder[key].sort((a, b) => a.src.localeCompare(b.src));
  }

  // Map dataset slugs → one or more folder paths (relative to services/)
  // If multiple candidates are provided, existing folders will be used in order.
  const slugToFolders = {
    // Examples with nested mappings
    "door-window": ["door-window/window-install", "door/window-install"],
    "plumbing-electric": ["plumbing-electric/electric", "plumbing/electric"],
    "trim-flooring": ["trim/flooring"],
  };

  function resolveFoldersForSlug(slug) {
    const candidates = slugToFolders[slug] || [slug];
    // Return only folders that actually have images, but if none exist, keep first for empty fallback
    const existing = candidates.filter((f) => Array.isArray(imagesByFolder[f]) && imagesByFolder[f].length > 0);
    return existing.length > 0 ? existing : [candidates[0]];
  }

  /* ---------- Modal / Lightbox logic ---------- */
  let currentService = null;
  let currentIndex = 0;

  function openServiceModal(serviceKey) {
    currentService = serviceKey;
    const formattedName = serviceKey
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    svcTitle.textContent = `${formattedName} Gallery`;
    svcGrid.innerHTML = "";

    // Aggregate images from resolved folder(s)
    const folders = resolveFoldersForSlug(serviceKey);
    const images = folders.flatMap((f) => imagesByFolder[f] || []);

    if (!images || images.length === 0) {
      svcGrid.innerHTML = `<p class="svc-coming-soon">Pictures coming soon</p>`;
    } else {
      images.forEach((img, i) => {
        const cell = document.createElement("div");
        cell.className = "svc-cell";
        const image = document.createElement("img");
        image.src = img.src;
        image.alt = `${formattedName} image ${i + 1}`;
        image.setAttribute("loading", "lazy");
        image.dataset.index = i;
        image.addEventListener("click", () => openLightbox(i));
        cell.appendChild(image);
        svcGrid.appendChild(cell);
      });
    }

    svcOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // Close on Escape while modal is open
    document.addEventListener("keydown", onOverlayKeydown);
  }

  function closeServiceModal() {
    svcOverlay.classList.remove("active");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onOverlayKeydown);
  }

  function onOverlayKeydown(e) {
    if (e.key === "Escape") closeServiceModal();
  }

  function openLightbox(index) {
    const folders = resolveFoldersForSlug(currentService);
    const gallery = folders.flatMap((f) => imagesByFolder[f] || []);
    if (!gallery || gallery.length === 0) return;
    currentIndex = index;
    const { src, caption } = gallery[index];
    svcLightboxImg.src = src;
    svcLightboxCaption.textContent = caption || "";
    svcLightbox.classList.add("active");
  }

  function closeLightbox() {
    svcLightbox.classList.remove("active");
  }

  function changeLightbox(direction) {
    const folders = resolveFoldersForSlug(currentService);
    const gallery = folders.flatMap((f) => imagesByFolder[f] || []);
    if (!gallery || gallery.length === 0) return;
    currentIndex = (currentIndex + direction + gallery.length) % gallery.length;
    const { src, caption } = gallery[currentIndex];
    svcLightboxImg.src = src;
    svcLightboxCaption.textContent = caption || "";
  }

  /* ---------- Event listeners (with modern a11y) ---------- */
  svcClose?.addEventListener("click", closeServiceModal);
  svcOverlay?.addEventListener("click", (e) => {
    if (e.target === svcOverlay) closeServiceModal();
  });

  svcLightboxClose?.addEventListener("click", closeLightbox);
  svcPrev?.addEventListener("click", () => changeLightbox(-1));
  svcNext?.addEventListener("click", () => changeLightbox(1));
  svcLightbox?.addEventListener("click", (e) => {
    if (e.target === svcLightbox) closeLightbox();
  });

  // Keyboard-accessible activation
  const serviceBoxes = document.querySelectorAll(".service-item");
  serviceBoxes.forEach((box) => {
    box.addEventListener("click", () => openServiceModal(box.dataset.service));
    box.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openServiceModal(box.dataset.service);
      }
    });
  });
}
