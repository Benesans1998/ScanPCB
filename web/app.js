const yearNodes = document.querySelectorAll("[data-year]");
for (const node of yearNodes) node.textContent = new Date().getFullYear();

const remoteBoardPhoto = document.querySelector("[data-remote-board-photo]");
if (remoteBoardPhoto) {
  const showPhotoFallback = () => {
    remoteBoardPhoto.hidden = true;
    document.querySelector("[data-home-image-fallback]").hidden = false;
  };
  remoteBoardPhoto.addEventListener("error", showPhotoFallback, { once: true });
  if (remoteBoardPhoto.complete && !remoteBoardPhoto.naturalWidth) showPhotoFallback();
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealNodes = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  for (const node of revealNodes) node.classList.add("is-visible");
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12 }
  );
  for (const node of revealNodes) observer.observe(node);
}

