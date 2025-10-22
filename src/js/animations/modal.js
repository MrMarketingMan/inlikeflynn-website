// ─────────────── GUTTER MODAL SCRIPT ───────────────
// Controls manual open, close, and one-time auto-popup
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('gutterModal');
  const openBtn = document.getElementById('openGutterModal');
  const closeBtn = document.getElementById('closeModal');

  if (!modal) return;

  // ─────────────── Helpers ───────────────
  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  // ─────────────── Manual Trigger (Banner Click) ───────────────
  if (openBtn) {
    openBtn.addEventListener('click', openModal);
  }

  // Close when clicking X or outside
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ─────────────── Auto-Popup Once per Visit ───────────────
  const popupKey = 'flynnGutterModalShown';
  const popupDelay = 2500; // milliseconds (2.5 seconds)

  // Check if modal was already shown this session
  const alreadyShown = localStorage.getItem(popupKey);

  if (!alreadyShown) {
    setTimeout(() => {
      openModal();
      // Remember that we’ve shown it so it won’t pop up again
      localStorage.setItem(popupKey, 'true');
    }, popupDelay);
  }

  // (Optional) Clear key after 24 h if you want it to reappear next day:
  // const expireTime = 24 * 60 * 60 * 1000;
  // const now = Date.now();
  // const lastShown = localStorage.getItem('flynnGutterModalTime');
  // if (!lastShown || now - lastShown > expireTime) {
  //   localStorage.removeItem(popupKey);
  //   localStorage.setItem('flynnGutterModalTime', now);
  // }
});
