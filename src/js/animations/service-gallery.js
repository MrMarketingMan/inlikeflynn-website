/* =======================================================
   SERVICE GALLERY — Auto-Update (Production-Safe for Vite + Netlify)
   — Refactored for accessibility & event safety —
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

  /* ---------- Auto-import all service images ---------- */
  const allImages = import.meta.glob(
    "/src/assets/img/services/*/*.{jpg,jpeg,png,webp}",
    { eager: true }
  );

  const serviceGalleries = {};
  for (const path in allImages) {
    const match = path.match(/services[\\/](.+?)[\\/]/);
    if (!match) continue;
    const service = match[1];
    if (!serviceGalleries[service]) serviceGalleries[service] = [];

    const imgUrl = allImages[path].default || allImages[path];
    serviceGalleries[service].push({ src: imgUrl, caption: "" });
  }

  // Sort for predictable order
  for (const key in serviceGalleries) {
    serviceGalleries[key].sort((a, b) => a.src.localeCompare(b.src));
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

  if (import.meta.env.DEV) {
    console.log("✅ Loaded service galleries:", serviceGalleries);
  }
}
