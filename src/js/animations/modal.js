// ─────────────── GUTTER MODAL SCRIPT ───────────────
// Controls manual open, close, and one-time auto-popup
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('gutterModal');
  const openBtn = document.getElementById('openGutterModal');
  const closeBtn = document.getElementById('closeModal');

  if (!modal) return;

  // ─────────────── Helpers ───────────────
  let overlayClickHandler = null;
  let keydownHandler = null;

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    // Attach temporary listeners and clean them on close
    overlayClickHandler = (e) => { if (e.target === modal) closeModal(); };
    keydownHandler = (e) => { if (e.key === 'Escape') closeModal(); };
    modal.addEventListener('click', overlayClickHandler);
    document.addEventListener('keydown', keydownHandler);
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    // Clean up transient listeners to avoid leaks / duplicates
    if (overlayClickHandler) {
      modal.removeEventListener('click', overlayClickHandler);
      overlayClickHandler = null;
    }
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
  };

  // ─────────────── Manual Trigger (Banner Click) ───────────────
  if (openBtn) {
    openBtn.addEventListener('click', openModal);
    // Keyboard accessibility
    openBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  }

  // Close when clicking X or outside
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // ─────────────── Auto-Popup Once per Visit ───────────────
  const popupKey = 'flynnGutterModalShown';
  const popupDelay = 2500; // milliseconds (2.5 seconds)

  // Check if modal was already shown this session
  let alreadyShown = null;
  try {
    alreadyShown = window.localStorage.getItem(popupKey);
  } catch (e) {
    // Storage may be unavailable (private mode); proceed without blocking
    alreadyShown = null;
  }

  if (!alreadyShown) {
    setTimeout(() => {
      openModal();
      // Remember that we’ve shown it so it won’t pop up again
      try {
        window.localStorage.setItem(popupKey, 'true');
      } catch (e) {
        // Ignore write failures silently
      }
    }, popupDelay);
  }

  // (Optional) Clear key after 24 h if you want it to reappear next day:
  // const expireTime = 24 * 60 * 60 * 1000;
  // const now = Date.now();
  // let lastShown = null;
  // try { lastShown = window.localStorage.getItem('flynnGutterModalTime'); } catch {}
  // if (!lastShown || now - lastShown > expireTime) {
  //   try { window.localStorage.removeItem(popupKey); } catch {}
  //   try { window.localStorage.setItem('flynnGutterModalTime', String(now)); } catch {}
  // }
});
