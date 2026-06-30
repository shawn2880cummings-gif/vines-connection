/*
 * mc-world.js — reusable "voxel world" background for Vines Connection kids lessons.
 * Include it once: <script src="/lessons/mc-world.js"></script>  (auto-inits)
 * Adds a fixed, behind-content layer of slowly floating + spinning 3D blocks
 * (grass / stone / diamond / gold) over a pixel-grid night sky.
 */
(function () {
  if (window.MCWorld) return;

  var CSS = [
    ".mc-world{position:fixed;inset:0;z-index:-1;overflow:hidden;perspective:1000px;",
    "background:linear-gradient(180deg,#0c1640 0%,#0a0f2e 55%,#06091c 100%)}",
    ".mc-world::before{content:'';position:absolute;inset:0;",
    "background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);",
    "background-size:36px 36px;opacity:.7}",
    ".mc-cube{position:absolute;transform-style:preserve-3d;transform:rotateX(-24deg);",
    "animation:mcFloat var(--fd,16s) ease-in-out infinite, mcSpin var(--rd,52s) linear infinite;opacity:var(--op,.5)}",
    ".mc-face{position:absolute;left:0;top:0;box-shadow:inset 0 0 0 2px rgba(0,0,0,.16), inset 0 0 14px rgba(0,0,0,.12)}",
    "@keyframes mcFloat{0%,100%{margin-top:0}50%{margin-top:-20px}}",
    "@keyframes mcSpin{from{transform:rotateX(-24deg) rotateY(0)}to{transform:rotateX(-24deg) rotateY(360deg)}}",
    ".mc-cloud{position:absolute;display:grid;grid-auto-flow:column;opacity:.10;animation:mcDrift var(--cd,80s) linear infinite}",
    ".mc-cloud i{width:16px;height:16px;background:#cfe0ff;display:block}",
    "@keyframes mcDrift{from{transform:translateX(-20vw)}to{transform:translateX(120vw)}}",
    "@media (prefers-reduced-motion: reduce){.mc-cube,.mc-cloud{animation:none}}"
  ].join("");

  // block palettes: [top, side, dark]
  var PAL = {
    grass:   ["#6cb33f", "#7a4b27", "#5e3a1d"],
    stone:   ["#9b9b9b", "#7d7d7d", "#666"],
    diamond: ["#62f0e6", "#37b8c9", "#2a8fa3"],
    gold:    ["#ffd23f", "#e0a52a", "#bd861d"]
  };

  // scattered blocks (deterministic so it looks composed, not random)
  var BLOCKS = [
    { left: 6,  top: 14, size: 46, type: "grass",   fd: 15, rd: 60, op: .5,  dl: 0 },
    { left: 84, top: 10, size: 38, type: "diamond", fd: 18, rd: 48, op: .55, dl: 2 },
    { left: 70, top: 26, size: 26, type: "stone",   fd: 13, rd: 70, op: .4,  dl: 1 },
    { left: 16, top: 40, size: 30, type: "gold",    fd: 17, rd: 55, op: .5,  dl: 3 },
    { left: 90, top: 46, size: 44, type: "grass",   fd: 16, rd: 64, op: .45, dl: 1.5 },
    { left: 40, top: 58, size: 24, type: "diamond", fd: 14, rd: 50, op: .5,  dl: 2.5 },
    { left: 8,  top: 66, size: 40, type: "stone",   fd: 19, rd: 58, op: .42, dl: 0.5 },
    { left: 78, top: 70, size: 30, type: "gold",    fd: 15, rd: 66, op: .5,  dl: 3.5 },
    { left: 30, top: 82, size: 50, type: "grass",   fd: 20, rd: 72, op: .48, dl: 1 },
    { left: 60, top: 88, size: 28, type: "diamond", fd: 16, rd: 54, op: .5,  dl: 2 },
    { left: 50, top: 20, size: 22, type: "stone",   fd: 12, rd: 62, op: .38, dl: 4 },
    { left: 94, top: 80, size: 34, type: "grass",   fd: 18, rd: 68, op: .45, dl: 0.8 }
  ];

  function injectCSS() {
    if (document.getElementById("mc-world-css")) return;
    var s = document.createElement("style"); s.id = "mc-world-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function makeCube(b) {
    var s = b.size, half = s / 2, p = PAL[b.type] || PAL.grass;
    var el = document.createElement("div");
    el.className = "mc-cube";
    el.style.cssText = "left:" + b.left + "%;top:" + b.top + "%;width:" + s + "px;height:" + s +
      "px;--fd:" + b.fd + "s;--rd:" + b.rd + "s;--op:" + b.op + ";animation-delay:" + b.dl + "s," + b.dl + "s";
    var faces = [
      ["translateZ(" + half + "px)", p[1]],
      ["rotateY(180deg) translateZ(" + half + "px)", p[2]],
      ["rotateY(90deg) translateZ(" + half + "px)", p[2]],
      ["rotateY(-90deg) translateZ(" + half + "px)", p[1]],
      ["rotateX(90deg) translateZ(" + half + "px)", p[0]],
      ["rotateX(-90deg) translateZ(" + half + "px)", p[2]]
    ];
    faces.forEach(function (f) {
      var d = document.createElement("div");
      d.className = "mc-face";
      d.style.cssText = "width:" + s + "px;height:" + s + "px;background:" + f[1] + ";transform:" + f[0];
      el.appendChild(d);
    });
    return el;
  }

  function makeCloud(topPct, blocks, dur) {
    var c = document.createElement("div");
    c.className = "mc-cloud";
    c.style.cssText = "top:" + topPct + "%;--cd:" + dur + "s";
    for (var i = 0; i < blocks; i++) c.appendChild(document.createElement("i"));
    return c;
  }

  function build() {
    var world = document.createElement("div");
    world.className = "mc-world";
    BLOCKS.forEach(function (b) { world.appendChild(makeCube(b)); });
    world.appendChild(makeCloud(8, 5, 90));
    world.appendChild(makeCloud(30, 4, 120));
    world.appendChild(makeCloud(60, 6, 150));
    document.body.appendChild(world);
  }

  function init() { injectCSS(); build(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  window.MCWorld = { _inited: true };
})();
