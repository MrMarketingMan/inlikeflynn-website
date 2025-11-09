// Lazy-load Google Map iframe when it comes into view

document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.querySelector("#map-container");
  if (!mapContainer) return;

  const MAP_SRC = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3065.473944565903!2d-77.231095!3d39.830928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c9a81b6f2d00b9%3A0xdea9d79cbde3f58a!2sGettysburg%2C%20PA!5e0!3m2!1sen!2sus!4v20251105";

  // Add loading placeholder to prevent layout shift (CLS)
  mapContainer.style.minHeight = "210px";
  mapContainer.style.background = "#f0f0f0";
  mapContainer.style.borderRadius = "12px";
  mapContainer.setAttribute("aria-label", "Loading map of Gettysburg, PA");
  
  const loadingText = document.createElement("p");
  loadingText.textContent = "Loading map...";
  loadingText.style.textAlign = "center";
  loadingText.style.padding = "80px 20px";
  loadingText.style.color = "#666";
  loadingText.style.margin = "0";
  mapContainer.appendChild(loadingText);

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = document.createElement("iframe");
        iframe.title = "In Like Flynn LLC service area - Gettysburg, PA";
        iframe.src = MAP_SRC;
        iframe.width = "100%";
        iframe.height = "210";
        iframe.style.border = "0";
        iframe.style.borderRadius = "12px";
        iframe.allowFullscreen = true;
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer-when-downgrade";
        
        // Remove loading text and insert iframe
        mapContainer.innerHTML = "";
        mapContainer.removeAttribute("aria-label");
        mapContainer.appendChild(iframe);
        obs.disconnect();
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(mapContainer);
});
