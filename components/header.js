// Shared header: edit this file once to update all three pages.
(() => {
  // Site root = folder that contains /components (works on GitHub Pages repo sites too)
  const siteRoot = new URL("../", document.currentScript.src);
  // file:// cannot open folders, so link to index.html directly there
  const toUrl = (path = "") =>
    new URL(
      location.protocol === "file:" ? `${path}index.html` : path,
      siteRoot,
    ).href;

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      const current = document.body.dataset.page;
      const routes = [
        { key: "introduce", path: "", label: "Introduce" },
        { key: "news", path: "news-analysis/", label: "News Analysis" },
        { key: "resume", path: "resume/", label: "Resume &amp; Cover Letter" },
        { key: "movie", path: "movie-plot/", label: "Movie Plot" },
        { key: "article", path: "article/", label: "Article" },
        { key: "changes", path: "changes-made/", label: "Changes Made" },
        { key: "review", path: "movie-review/", label: "Movie Review" },
      ];
      const links = routes
        .map((route, i) => {
          const active = current === route.key;
          return `<a href="${toUrl(route.path)}"${active ? ' class="is-active" aria-current="page"' : ""}><span class="drawer__num">0${i + 1}</span>${route.label}</a>`;
        })
        .join("");
      // 드로어는 header 바깥에 둬야 함 (header의 backdrop-filter 때문에 fixed가 깨짐)
      this.innerHTML = `
        <header class="header${current === "introduce" ? "" : " is-scrolled"}" id="header">
          <div class="header__inner">
            <a class="logo" href="${toUrl()}" aria-label="Layla, go to Introduce">layla</a>
            <button class="menuBtn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="siteDrawer">
              <span class="menuBtn__text">Menu</span>
              <span class="menuBtn__lines" aria-hidden="true"><span></span><span></span></span>
            </button>
          </div>
        </header>
        <div class="drawerBackdrop" id="drawerBackdrop" aria-hidden="true"></div>
        <aside class="drawer" id="siteDrawer" aria-label="Site menu" aria-hidden="true" inert>
          <div class="drawer__head">
            <span class="drawer__title">Carving My Path</span>
            <button class="drawer__close" id="drawerClose" type="button" aria-label="Close menu">&times;</button>
          </div>
          <nav class="drawer__nav" aria-label="Primary">${links}</nav>
          <p class="drawer__foot">Media English Portfolio · Layla</p>
        </aside>`;

      const root = document.documentElement;
      const btn = this.querySelector("#menuBtn");
      const drawer = this.querySelector("#siteDrawer");
      const closeBtn = this.querySelector("#drawerClose");
      const open = () => {
        root.classList.add("drawer-open");
        drawer.removeAttribute("inert");
        drawer.setAttribute("aria-hidden", "false");
        btn.setAttribute("aria-expanded", "true");
        closeBtn.focus();
      };
      const close = (focusBtn = true) => {
        if (!root.classList.contains("drawer-open")) return;
        root.classList.remove("drawer-open");
        drawer.setAttribute("inert", "");
        drawer.setAttribute("aria-hidden", "true");
        btn.setAttribute("aria-expanded", "false");
        if (focusBtn) btn.focus();
      };
      btn.addEventListener("click", open);
      closeBtn.addEventListener("click", () => close());
      this.querySelector("#drawerBackdrop").addEventListener("click", () =>
        close(),
      );
      drawer
        .querySelectorAll("a")
        .forEach((a) => a.addEventListener("click", () => close(false)));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    }
  }
  customElements.define("site-header", SiteHeader);
})();
