// ─────────────── GUTTER MODAL SCRIPT ───────────────
// Controls manual open, close, and one-time auto-popup

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('gutterModal');
  const openBtn = document.getElementById('openGutterModal');
  const closeBtn = document.getElementById('closeModal');
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let firstFocusableElement, lastFocusableElement, previouslyFocusedElement;

  if (!modal) return;

  // ─────────────── Helpers ───────────────
  let overlayClickHandler = null;
  let keydownHandler = null;

  const trapFocus = (e) => {
    const isTabPressed = e.key === 'Tab';
    if (!isTabPressed) return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement.focus();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement.focus();
      }
    }
  };

  const openModal = () => {
    previouslyFocusedElement = document.activeElement;

    // ✅ Ensure ARIA semantics for assistive technologies
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'gutterModalTitle');

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.setAttribute('aria-hidden', 'true');

    const focusableContent = modal.querySelectorAll(focusableElements);
    firstFocusableElement = focusableContent[0];
    lastFocusableElement = focusableContent[focusableContent.length - 1];

    if (firstFocusableElement) firstFocusableElement.focus();

    // Attach temporary listeners and clean them on close
    overlayClickHandler = (e) => {
      if (e.target === modal) closeModal();
    };
    keydownHandler = (e) => {
      if (e.key === 'Escape') closeModal();
      trapFocus(e);
    };
    modal.addEventListener('click', overlayClickHandler);
    document.addEventListener('keydown', keydownHandler);
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.removeAttribute('aria-hidden');

    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }

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

// ─────────────── CONTACT MODAL SCRIPT ───────────────
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('contactModal');
  const triggers = document.querySelectorAll('.contact-trigger');
  if (!modal || !triggers.length) return;

  const callBtn = modal.querySelector('#callBtn');
  const textBtn = modal.querySelector('#textBtn');
  const emailBtn = modal.querySelector('#emailBtn');
  const emailForm = modal.querySelector('#emailForm');
  const emailConfirm = modal.querySelector('#emailConfirm');

  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let firstFocusable, lastFocusable, previouslyFocused;

  let overlayClickHandler = null;
  let keydownHandler = null;

  const trapFocus = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  const openModal = () => {
    previouslyFocused = document.activeElement;
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    const focusable = modal.querySelectorAll(focusableSelectors);
    firstFocusable = focusable[0];
    lastFocusable = focusable[focusable.length - 1];
    if (firstFocusable) firstFocusable.focus();

    overlayClickHandler = (e) => {
      if (e.target === modal) closeModal();
    };
    keydownHandler = (e) => {
      if (e.key === 'Escape') closeModal();
      trapFocus(e);
    };
    modal.addEventListener('click', overlayClickHandler);
    document.addEventListener('keydown', keydownHandler);
  };

  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('hidden', '');
    if (previouslyFocused) previouslyFocused.focus();
    if (overlayClickHandler) {
      modal.removeEventListener('click', overlayClickHandler);
      overlayClickHandler = null;
    }
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
  };

  // Bind open triggers
  triggers.forEach((el) => {
    el.addEventListener('click', openModal);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  });

  // Contact option actions (use the site number)
  if (callBtn) callBtn.onclick = () => (window.location.href = 'tel:+17177531172');
  if (textBtn) textBtn.onclick = () => (window.location.href = 'sms:+17177531172?body=Hi,%20I%27d%20like%20a%20free%20estimate!');

  // Email form toggle
  if (emailBtn && emailForm) {
    emailBtn.addEventListener('click', () => {
      emailForm.classList.toggle('active');
      if (emailForm.classList.contains('active')) {
        const firstInput = emailForm.querySelector('input, textarea');
        if (firstInput) firstInput.focus();
      }
    });
  }

  // Submit handler with PHP -> fallback mailto
  if (emailForm) {
    emailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(emailForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      try {
        const res = await fetch('/contact-handler.php', {
          method: 'POST',
          body: formData
        });
        const text = await res.text();
        // Only treat as success if server explicitly says OK
        if (!res.ok || text.trim() !== 'OK') {
          throw new Error('Server did not execute PHP handler');
        }
        if (emailConfirm) emailConfirm.hidden = false;
        emailForm.reset();
      } catch (err) {
        const subject = 'Website Inquiry';
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        window.location.href = `mailto:inlikeflynn@inlikeflynnllc.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        if (emailConfirm) emailConfirm.hidden = false;
      }
    });
  }
});
