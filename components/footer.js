// Shared footer: edit this file once to update all three pages.
(() => {
  const siteRoot = new URL("../", document.currentScript.src);
  const homeUrl = new URL(
    location.protocol === "file:" ? "index.html" : "",
    siteRoot,
  ).href;
  class SiteFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<footer class="siteFooter"><div class="container"><span>© <span id="year">${new Date().getFullYear()}</span> Layla · Carving My Path</span><a href="${homeUrl}">Back to Introduce</a></div></footer>`;
    }
  }
  customElements.define("site-footer", SiteFooter);
})();
