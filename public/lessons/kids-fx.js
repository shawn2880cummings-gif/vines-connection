/*
 * kids-fx.js — reusable 3D dynamic effects for Vines Connection kids lessons.
 * Just include it: <script src="/lessons/kids-fx.js"></script>  (auto-inits)
 *
 *  • Scroll reveal: cards/illustrations rotate + rise into view in 3D
 *  • Pointer tilt: cards & images tilt toward the cursor (desktop)
 *  • Respects prefers-reduced-motion. Safe no-op without IntersectionObserver.
 */
(function () {
  if (window.KidsFX) return;

  var CSS = [
    ".kfx-reveal{opacity:0;transform:perspective(1100px) rotateX(11deg) translateY(48px) scale(.95);transition:opacity .85s ease, transform .95s cubic-bezier(.22,1,.36,1);will-change:transform,opacity}",
    ".kfx-reveal.kfx-in{opacity:1;transform:perspective(1100px) rotateX(0deg) translateY(0) scale(1)}",
    ".kfx-tilt{transition:transform .16s ease-out;transform-style:preserve-3d}",
    "@media (prefers-reduced-motion: reduce){.kfx-reveal{opacity:1!important;transform:none!important;transition:none}}"
  ].join("");

  var REVEAL = [".fact-card", ".illustration", ".gene-tile", ".vs-box", ".pathway .step", ".quiz-section", ".wow-callout", ".ch-title"];
  var TILT = ".fact-card,.gene-tile,.vs-box,.illustration";

  function injectCSS() {
    if (document.getElementById("kidsfx-css")) return;
    var s = document.createElement("style"); s.id = "kidsfx-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function reduceMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setupReveal() {
    if (!("IntersectionObserver" in window) || reduceMotion()) return;
    var els = [];
    REVEAL.forEach(function (sel) { Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) { els.push(el); }); });
    els.forEach(function (el) { el.classList.add("kfx-reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; io.unobserve(el);
        el.classList.add("kfx-in");
        var done = function () { el.classList.remove("kfx-reveal", "kfx-in"); el.removeEventListener("transitionend", done); };
        el.addEventListener("transitionend", done);
        setTimeout(done, 1200);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  function setupTilt() {
    if (!window.matchMedia || !window.matchMedia("(hover:hover) and (pointer:fine)").matches || reduceMotion()) return;
    document.addEventListener("mousemove", function (e) {
      var card = e.target.closest && e.target.closest(TILT);
      if (!card) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add("kfx-tilt");
      card.style.transform = "perspective(900px) rotateX(" + (-py * 7).toFixed(2) + "deg) rotateY(" + (px * 9).toFixed(2) + "deg) translateY(-6px) scale(1.02)";
    }, { passive: true });
    document.addEventListener("mouseout", function (e) {
      var card = e.target.closest && e.target.closest(TILT);
      if (card && !card.contains(e.relatedTarget)) { card.style.transform = ""; }
    }, { passive: true });
  }

  function init() { injectCSS(); setupReveal(); setupTilt(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.KidsFX = { _inited: true };
})();
