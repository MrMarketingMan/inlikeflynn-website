/* =======================================================
   SERVICE GALLERY — AUTO-UPDATE (Production-Safe for Vite + Netlify)
========================================================= */

// Gate setup: only run this file if the gallery markup exists on the page
const svcOverlay = document.getElementById("svcGalleryOverlay");
if (!svcOverlay) {
  console.info("Service gallery markup not found — skipping gallery script.");
} else {
  const svcGrid = document.getElementById("svcGrid");
  const svcClose = document.getElementById("svcCloseBtn");
  const svcTitle = document.getElementById("svcGalleryTitle");

  const svcLightbox = document.getElementById("svcLightbox");
  const svcLightboxImg = document.getElementById("svcLightboxImg");
  const svcLightboxCaption = document.getElementById("svcLightboxCaption");
  const svcLightboxClose = document.getElementById("svcLightboxClose");
  const svcPrev = document.getElementById("svcPrev");
  const svcNext = document.getElementById("svcNext");

  /* -------------------------------------------------------
     🔧 AUTO-IMPORT ALL SERVICE IMAGES (use resolved URLs)
  --------------------------------------------------------- */

  // Grab all jpg/jpeg/png/webp files inside /services subfolders
  const allImages = import.meta.glob("/src/assets/img/services/*/*.{jpg,jpeg,png,webp}", {
    eager: true,
  });

  // Build the serviceGalleries object dynamically
  const serviceGalleries = {};

  for (const path in allImages) {
    // Extract the folder name (service)
    const match = path.match(/services[\\/](.+?)[\\/]/);
    if (!match) continue;
    const service = match[1];

    if (!serviceGalleries[service]) serviceGalleries[service] = [];

    // ✅ Use the resolved, Vite-hashed URL
    const imgUrl = allImages[path].default || allImages[path];

    serviceGalleries[service].push({
      src: imgUrl,
      caption: "",
    });
  }

  // Sort images alphabetically for consistency
  for (const key in serviceGalleries) {
    serviceGalleries[key].sort((a, b) => a.src.localeCompare(b.src));
  }

  /* -------------------------------------------------------
     🔧 MODAL / LIGHTBOX LOGIC
  --------------------------------------------------------- */
  let currentService = null;
  let currentIndex = 0;

  function openServiceModal(serviceKey) {
    currentService = serviceKey;
    const formattedName = serviceKey.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    svcTitle.textContent = `${formattedName} Gallery`;
    svcGrid.innerHTML = "";

    const images = serviceGalleries[serviceKey];
    if (!images || images.length === 0) {
      svcGrid.innerHTML = `<p class="svc-coming-soon">Pictures coming soon</p>`;
    } else {
      images.forEach((img, i) => {
        const cell = document.createElement("div");
        cell.className = "svc-cell";

        const image = document.createElement("img");
        image.src = img.src;
        image.alt = `${formattedName} image ${i + 1}`;
        image.dataset.index = i;

        image.addEventListener("click", () => openLightbox(i));

        cell.appendChild(image);
        svcGrid.appendChild(cell);
      });
    }

    svcOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeServiceModal() {
    svcOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  function openLightbox(index) {
    const gallery = serviceGalleries[currentService];
    if (!gallery) return;
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
    const gallery = serviceGalleries[currentService];
    if (!gallery) return;
    currentIndex = (currentIndex + direction + gallery.length) % gallery.length;
    const { src, caption } = gallery[currentIndex];
    svcLightboxImg.src = src;
    svcLightboxCaption.textContent = caption || "";
  }

  /* -------------------------------------------------------
     🔧 EVENT LISTENERS (with guards)
  --------------------------------------------------------- */
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

  // Attach click handlers to service boxes if they exist
  const serviceBoxes = document.querySelectorAll(".service-item");
  serviceBoxes.forEach((box) => {
    box.addEventListener("click", () => openServiceModal(box.dataset.service));
    box.addEventListener("keypress", (e) => {
      if (e.key === "Enter") openServiceModal(box.dataset.service);
    });
  });

  // Log in dev mode to confirm auto-load worked
  if (import.meta.env.DEV) {
    console.log("✅ Loaded service galleries:", serviceGalleries);
  }
}
