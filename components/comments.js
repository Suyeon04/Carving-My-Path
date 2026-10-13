// Shared comments section
// 사용법: <site-comments page="Movie Plot"></site-comments>
// page 값이 ① 구글 폼 "Which page?" 칸에 자동 입력되고 ② comments-data.js에서 댓글을 찾는 이름이 됩니다.
(() => {
  // 🔧 구글 폼 설정 (처음 한 번만)
  const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSfkp2BwIUMzQOtFkbjbrQreVIO7hS2ezyi_XsEQHWQZy9Xq8g/viewform";
  const PAGE_ENTRY = "entry.654535297"; // "Which page?" 질문의 entry 번호

  const escape = (s = "") =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  class SiteComments extends HTMLElement {
    connectedCallback() {
      const page = this.getAttribute("page") || document.title.split(" — ")[0];
      const formLink = `${FORM_URL}?usp=pp_url&${PAGE_ENTRY}=${encodeURIComponent(page)}`;
      const list = (window.COMMENTS && window.COMMENTS[page]) || [];

      const cards = list.length
        ? list
            .map(
              (c) => `
            <article class="commentCard">
              <p>“${escape(c.text)}”</p>
              <span>— ${escape(c.name)}</span>
            </article>`,
            )
            .join("")
        : `<p class="commentEmpty">No comments yet. Be the first to leave one!</p>`;

      this.innerHTML = `
        <section class="comments">
          <div class="container">
            <h2 class="section__title">Classmates’ Comments</h2>
            <a class="commentBtn" href="${formLink}" target="_blank" rel="noopener">Leave a comment ✍️</a>
            <div class="commentList">${cards}</div>
          </div>
        </section>`;
    }
  }
  customElements.define("site-comments", SiteComments);
})();
