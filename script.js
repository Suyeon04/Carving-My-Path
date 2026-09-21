const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const hero = document.getElementById("main");
const heroVideo = document.getElementById("heroVideo");
const yearEl = document.getElementById("year");
const navLinks = document.querySelectorAll(".nav a[data-section]");
const sections = ["main", "chapter1", "chapter2", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const setHeaderState = () => {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
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

// 네비게이션 활성화 스크롤 옵저버
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.dataset.section === entry.target.id,
          );
        });
      });
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));
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

// [핵심 추가] 글씨 위로 마우스를 올리면 단어가 커지는 효과 적용
// [핵심 추가] 글씨 위로 마우스를 올리면 단어가 커지고, 클릭하면 네이버 사전으로 이동
document.addEventListener("DOMContentLoaded", () => {
  const paragraphs = document.querySelectorAll(".storyText p");

  paragraphs.forEach((p) => {
    function wrapTextNodes(node) {
      if (node.nodeType === 3) {
        const text = node.nodeValue;
        if (text.trim() === "") return;

        const words = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        words.forEach((word) => {
          if (word.trim() === "") {
            fragment.appendChild(document.createTextNode(word));
          } else {
            const span = document.createElement("span");
            span.className = "hover-word";
            span.textContent = word;
            span.title = "Click to view the meaning"; // 마우스 올리면 나오는 툴팁

            // 단어 클릭 시 이벤트
            span.addEventListener("click", () => {
              // 단어 뒤에 붙은 마침표(.), 쉼표(,) 등을 제거하고 순수 알파벳만 추출
              const cleanWord = word.replace(/[^a-zA-Z]/g, "");
              if (cleanWord) {
                // 네이버 영어사전 새 창으로 열기 (파파고보다 단어 검색에 훨씬 깔끔합니다)
                window.open(
                  `https://papago.naver.com/?sl=en&tl=ko&text=${cleanWord}`,
                  "_blank",
                );
              }
            });

            fragment.appendChild(span);
          }
        });
        node.replaceWith(fragment);
      } else if (node.nodeType === 1) {
        const children = Array.from(node.childNodes);
        children.forEach((child) => wrapTextNodes(child));
      }
    }

    const children = Array.from(p.childNodes);
    children.forEach((child) => wrapTextNodes(child));
  });
});
