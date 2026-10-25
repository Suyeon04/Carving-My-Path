const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const hero = document.getElementById("main");
const heroVideo = document.getElementById("heroVideo");
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const setHeaderState = () => {
  if (header) {
    header.classList.toggle(
      "is-scrolled",
      !hero || window.scrollY > hero.offsetHeight - 72,
    );
  }
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    if (mobileNav) mobileNav.hidden = isOpen;
  });
}

if (mobileNav) {
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileNav) mobileNav.hidden = true;
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
      }
    });
  });
}

const useHeroFallback = () => {
  if (hero) hero.classList.add("is-fallback");
};

if (heroVideo) {
  heroVideo.addEventListener("error", useHeroFallback);
  const source = heroVideo.querySelector("source");
  if (source) source.addEventListener("error", useHeroFallback);

  heroVideo.addEventListener("loadeddata", () => {
    if (hero) hero.classList.remove("is-fallback");
  });
}

// 스크롤 등장 (Fade-up) 애니메이션 옵저버
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });
}

// 문장 위에 마우스를 올리면 문장 전체가 강조되고, 클릭하면 Papago에서 한국어로 번역
// 문장은 display: inline으로 감싸서 Ctrl + F와 구글 번역도 정상으로 작동합니다.
document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(`
  .storyText p,
  #resume-letter p,
  #resume-letter li,
  #resume-letter .career-job > strong,
  #resume-letter .career-job > span,
  #movie-plot li,
  #plot .beat p,
  #plot .beat li,
  .newsReflection > p:last-child,
  .analysisCard p:not(.analysisCard__number),
  .finalVerdict p,
  .changeCard__text p,
  #article-info .mastCard > p:not(.mastCard__label),
  #article-info dd,
  #article-reflection .reflectionNote > p:not(.mastCard__label)
`);
  const SENTENCE = /[^.!?]+(?:[.!?]+["”’')\]]*)?\s*|[.!?]+\s*/g;
  const ENDS = /[.!?]["”’')\]]*\s*$/;

  targets.forEach((el) => {
    // 이미 처리된 요소 안쪽이면 건너뛰기 (중복 방지)
    if (el.closest("[data-sentences]") || el.querySelector("[data-sentences]")) return;
    el.dataset.sentences = "";

    const texts = [""];
    let sid = 0;

    const walk = (node) => {
      if (node.nodeType === 1) {
        // 링크·버튼은 감싸지 않고, 문장 내용에만 포함
        if (node.matches("a, button")) {
          texts[sid] += node.textContent;
          return;
        }
        if (node.tagName === "BR") {
          texts[sid] += " ";
          return;
        }
        Array.from(node.childNodes).forEach(walk);
        return;
      }
      if (node.nodeType !== 3 || node.nodeValue.trim() === "") {
        if (node.nodeType === 3) texts[sid] += node.nodeValue;
        return;
      }

      const fragment = document.createDocumentFragment();
      (node.nodeValue.match(SENTENCE) || []).forEach((piece) => {
        if (piece.trim() === "") {
          fragment.appendChild(document.createTextNode(piece));
          texts[sid] += piece;
          return;
        }
        const span = document.createElement("span");
        span.className = "hover-sentence";
        span.dataset.sid = sid;
        span.textContent = piece;
        span.title = "Click to translate this sentence into Korean (Papago)";
        fragment.appendChild(span);
        texts[sid] += piece;

        if (ENDS.test(piece)) {
          sid += 1;
          texts[sid] = "";
        }
      });
      node.replaceWith(fragment);
    };

    Array.from(el.childNodes).forEach(walk);

    const parts = (id) => el.querySelectorAll(`.hover-sentence[data-sid="${id}"]`);

    el.addEventListener("mouseover", (e) => {
      const span = e.target.closest(".hover-sentence");
      if (!span) return;
      parts(span.dataset.sid).forEach((p) => p.classList.add("is-active"));
    });
    el.addEventListener("mouseout", (e) => {
      const span = e.target.closest(".hover-sentence");
      if (!span) return;
      const next = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".hover-sentence");
      if (next && next.dataset.sid === span.dataset.sid && el.contains(next)) return;
      parts(span.dataset.sid).forEach((p) => p.classList.remove("is-active"));
    });
    el.addEventListener("click", (e) => {
      const span = e.target.closest(".hover-sentence");
      if (!span || window.getSelection().toString()) return; // 드래그로 글자를 선택할 때는 열지 않음
      const sentence = texts[span.dataset.sid].replace(/\s+/g, " ").trim();
      if (!sentence) return;
      window.open(
        `https://papago.naver.com/?sl=en&tl=ko&text=${encodeURIComponent(sentence)}`,
        "_blank",
        "noopener",
      );
    });
  });
});

// Keep the original word-lookup and reveal effects; navigation now uses real page URLs.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileNav && !mobileNav.hidden) {
    mobileNav.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    menuBtn.focus();
  }
});
