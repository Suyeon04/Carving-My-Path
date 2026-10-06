// Shared header: edit this file once to update all three pages.
(() => {
  const siteRoot = new URL("../", document.currentScript.src);
  class SiteHeader extends HTMLElement {
    connectedCallback() {
      const current = document.body.dataset.page;
      const routes = [
        { key: "introduce", path: "", label: "Introduce" },
        { key: "news", path: "news-analysis/", label: "News Analysis" },
        { key: "resume", path: "resume/", label: "Resume &amp; Cover Letter" },
      ];
      const links = (mobile = false) =>
        routes
          .map((route) => {
            const active = current === route.key;
            return `<a href="${new URL(route.path, siteRoot).href}"${active ? `${mobile ? "" : ' class="is-active"'} aria-current="page"` : ""}>${route.label}</a>`;
          })
          .join("");
      this.innerHTML = `
        <header class="header${current === "introduce" ? "" : " is-scrolled"}" id="header">
          <div class="header__inner">
            <a class="logo" href="${siteRoot.href}" aria-label="Layla, go to Introduce">layla</a>
            <nav class="nav" aria-label="Primary">${links()}</nav>
            <button class="menuBtn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav"><span></span><span></span></button>
          </div>
          <nav class="mobileNav" id="mobileNav" aria-label="Mobile navigation" hidden>${links(true)}</nav>
        </header>`;
    }
  }
  customElements.define("site-header", SiteHeader);
})();
