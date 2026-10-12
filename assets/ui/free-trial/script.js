// Market Open Media — Free Trial Landing Page interactions

document.addEventListener("DOMContentLoaded", function () {
  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav drawer toggle
  var navToggle = document.getElementById("navToggle");
  var drawer = document.getElementById("mobileDrawer");
  if (navToggle && drawer) {
    navToggle.addEventListener("click", function () {
      drawer.classList.toggle("open");
    });
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        drawer.classList.remove("open");
      });
    });
  }

  // FAQ accordion
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (item.classList.contains("open")) {
      a.style.maxHeight = a.scrollHeight + "px";
    }
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq-a").style.maxHeight = 0;
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  // Mobile sticky CTA — show after scrolling past hero
  var stickyCta = document.getElementById("stickyCta");
  var hero = document.querySelector(".hero");
  if (stickyCta && hero) {
    var toggleSticky = function () {
      var heroBottom = hero.getBoundingClientRect().bottom;
      if (heroBottom < 0) {
        stickyCta.classList.add("show");
      } else {
        stickyCta.classList.remove("show");
      }
    };
    window.addEventListener("scroll", toggleSticky, { passive: true });
    toggleSticky();
  }

  // Video placeholder click hint
  var videoPlaceholder = document.getElementById("videoPlaceholder");
  if (videoPlaceholder) {
    videoPlaceholder.addEventListener("click", function () {
      console.info(
        "Replace #videoPlaceholder in index.html with your real video embed (YouTube/Wistia/Vimeo iframe)."
      );
    });
  }
});
