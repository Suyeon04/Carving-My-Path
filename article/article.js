// Change 4 — zoom viewer for the magazine pages
(() => {
  const links = [...document.querySelectorAll(".spreadPage a")];
  if (!links.length) return;

  const viewer = document.createElement("div");
  viewer.className = "zoomViewer";
  viewer.hidden = true;
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-label", "Article page viewer");
  viewer.innerHTML = `
    <div class="zoomViewer__bar">
      <span class="zoomViewer__title"></span>
      <div class="zoomViewer__tools">
        <button type="button" data-act="prev" aria-label="Previous page">‹</button>
        <button type="button" data-act="out" aria-label="Zoom out">&minus;</button>
        <span class="zoomViewer__level">100%</span>
        <button type="button" data-act="in" aria-label="Zoom in">+</button>
        <button type="button" data-act="next" aria-label="Next page">›</button>
        <button type="button" data-act="close" class="zoomViewer__close" aria-label="Close">Close</button>
      </div>
    </div>
    <div class="zoomViewer__stage"><img alt="" /></div>`;
  document.body.appendChild(viewer);

  const stage = viewer.querySelector(".zoomViewer__stage");
  const img = viewer.querySelector("img");
  const title = viewer.querySelector(".zoomViewer__title");
  const level = viewer.querySelector(".zoomViewer__level");
  const STEPS = [1, 1.5, 2, 2.5, 3];
  let index = 0;
  let step = 0;
  let lastFocus = null;

  // 100% = page fits the screen height (or width on phones)
  const fitWidth = () => {
    const w = stage.clientWidth - 48;
    const h = stage.clientHeight - 48;
    return Math.min(w, h * (1414 / 2000));
  };

  const render = (keepCenter = true) => {
    const cx =
      (stage.scrollLeft + stage.clientWidth / 2) / (stage.scrollWidth || 1);
    const cy =
      (stage.scrollTop + stage.clientHeight / 2) / (stage.scrollHeight || 1);
    img.style.width = `${Math.round(fitWidth() * STEPS[step])}px`;
    level.textContent = `${Math.round(STEPS[step] * 100)}%`;
    stage.style.placeItems = step ? "start" : "start center";
    if (keepCenter) {
      stage.scrollLeft = cx * stage.scrollWidth - stage.clientWidth / 2;
      stage.scrollTop = cy * stage.scrollHeight - stage.clientHeight / 2;
    }
  };

  const show = (i) => {
    index = (i + links.length) % links.length;
    const thumb = links[index].querySelector("img");
    img.src = links[index].href;
    img.alt = thumb.alt;
    title.textContent = `Page ${index + 1} of ${links.length} — ${links[index].closest("figure").querySelector("figcaption").textContent}`;
    step = 0;
    render(false);
    stage.scrollTo(0, 0);
  };

  const open = (i) => {
    lastFocus = document.activeElement;
    viewer.hidden = false;
    document.body.classList.add("is-zoom-open");
    show(i);
    viewer.querySelector('[data-act="close"]').focus();
  };
  const close = () => {
    viewer.hidden = true;
    document.body.classList.remove("is-zoom-open");
    if (lastFocus) lastFocus.focus();
  };
  const zoom = (d) => {
    step = Math.max(0, Math.min(STEPS.length - 1, step + d));
    render();
  };

  links.forEach((a, i) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      open(i);
    }),
  );

  viewer.addEventListener("click", (e) => {
    const act = e.target.closest("button")?.dataset.act;
    if (act === "close") close();
    if (act === "in") zoom(1);
    if (act === "out") zoom(-1);
    if (act === "prev") show(index - 1);
    if (act === "next") show(index + 1);
  });

  // Click the page itself: zoom in, or back to 100% at max zoom
  let moved = false;
  img.addEventListener("click", () => {
    if (moved) return;
    step = step === STEPS.length - 1 ? 0 : step + 1;
    render();
  });

  // Drag to move around a zoomed page
  let drag = null;
  stage.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    drag = {
      x: e.clientX,
      y: e.clientY,
      l: stage.scrollLeft,
      t: stage.scrollTop,
    };
    moved = false;
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) {
      moved = true;
      stage.classList.add("is-dragging");
    }
    stage.scrollLeft = drag.l - dx;
    stage.scrollTop = drag.t - dy;
  });
  window.addEventListener("pointerup", () => {
    drag = null;
    stage.classList.remove("is-dragging");
    setTimeout(() => (moved = false), 0);
  });

  document.addEventListener("keydown", (e) => {
    if (viewer.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "+" || e.key === "=") zoom(1);
    if (e.key === "-") zoom(-1);
    if (e.key === "ArrowRight") show(index + 1);
    if (e.key === "ArrowLeft") show(index - 1);
  });
  window.addEventListener("resize", () => !viewer.hidden && render());
})();
