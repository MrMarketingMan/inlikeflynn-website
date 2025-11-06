// Lazy-load Google Map iframe when it comes into view

document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.querySelector("#map-container");
  if (!mapContainer) return;

  const MAP_SRC = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3065.473944565903!2d-77.231095!3d39.830928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c9a81b6f2d00b9%3A0xdea9d79cbde3f58a!2sGettysburg%2C%20PA!5e0!3m2!1sen!2sus!4v20251105";

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = document.createElement("iframe");
        iframe.title = "In Like Flynn LLC location map";
        iframe.src = MAP_SRC; // use existing src
        iframe.width = "100%";
        iframe.height = "210";
        iframe.style.border = "0";
        iframe.style.borderRadius = "12px";
        iframe.allowFullscreen = true;
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer-when-downgrade";
        mapContainer.appendChild(iframe);
        obs.disconnect();
      }
    });
  }, { threshold: 0.1 });
  observer.observe(mapContainer);
});
