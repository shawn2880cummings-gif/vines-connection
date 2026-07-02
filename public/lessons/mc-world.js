/*
 * mc-world.js — reusable "voxel world" background for Vines Connection kids lessons.
 * Include it once: <script src="/lessons/mc-world.js"></script>  (auto-inits)
 *
 * v2 — true 3D scene:
 *  - perspective camera that tilts with scroll (and pointer on desktop)
 *  - blocks live on near / mid / far depth layers (translateZ) with
 *    depth-of-field: far blocks are dimmer + blurred
 *  - glowing 3D grid floor receding to a horizon
 *  - twinkling stars at depth, drifting voxel clouds
 * Respects prefers-reduced-motion.
 */
(function () {
  if (window.MCWorld) return;

  var CSS = [
    ".mc-world{position:fixed;inset:0;z-index:-1;overflow:hidden;perspective:900px;perspective-origin:50% 42%;",
    "background:radial-gradient(120% 90% at 50% 0%,#14204f 0%,#0c1640 38%,#0a0f2e 66%,#05081a 100%)}",
    ".mc-scene,.mc-sway,.mc-layer{position:absolute;inset:0;transform-style:preserve-3d}",
    ".mc-scene{will-change:transform}",
    ".mc-sway{animation:mcSway 26s ease-in-out infinite}",
    "@keyframes mcSway{0%,100%{transform:rotateY(-1.6deg) rotateX(.6deg)}50%{transform:rotateY(1.6deg) rotateX(-.6deg)}}",
    // depth layers — scale compensates translateZ so % positions stay put
    ".mc-far{transform:translateZ(-420px) scale(1.467);filter:blur(1.6px);opacity:.72}",
    ".mc-mid{transform:translateZ(-160px) scale(1.178)}",
    ".mc-near{transform:translateZ(90px) scale(.9);filter:drop-shadow(0 18px 22px rgba(0,0,0,.45))}",
    // cubes
    ".mc-cube{position:absolute;transform-style:preserve-3d;transform:rotateX(-24deg);",
    "animation:mcFloat var(--fd,16s) ease-in-out infinite, mcSpin var(--rd,52s) linear infinite;opacity:var(--op,.5)}",
    ".mc-face{position:absolute;left:0;top:0;box-shadow:inset 0 0 0 2px rgba(0,0,0,.16), inset 0 0 14px rgba(0,0,0,.12)}",
    "@keyframes mcFloat{0%,100%{margin-top:0}50%{margin-top:-20px}}",
    "@keyframes mcSpin{from{transform:rotateX(-24deg) rotateY(0)}to{transform:rotateX(-24deg) rotateY(360deg)}}",
    // glowing grid floor receding to the horizon
    ".mc-floor{position:absolute;left:-60vw;right:-60vw;bottom:-6vh;height:70vh;transform-origin:50% 100%;transform:rotateX(74deg);",
    "background-image:linear-gradient(rgba(0,240,255,.16) 2px,transparent 2px),linear-gradient(90deg,rgba(0,240,255,.16) 2px,transparent 2px);",
    "background-size:64px 64px;animation:mcFloorMove 7s linear infinite;",
    "-webkit-mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.85) 55%,#000 100%);",
    "mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.85) 55%,#000 100%)}",
    "@keyframes mcFloorMove{from{background-position:0 0,0 0}to{background-position:0 64px,0 0}}",
    ".mc-horizon{position:absolute;left:0;right:0;bottom:26vh;height:26vh;pointer-events:none;",
    "background:radial-gradient(70% 100% at 50% 100%,rgba(0,240,255,.14) 0%,rgba(0,240,255,.05) 45%,transparent 75%)}",
    // stars
    ".mc-star{position:absolute;width:3px;height:3px;background:#dfe9ff;border-radius:1px;",
    "animation:mcTwinkle var(--td,3s) ease-in-out infinite;animation-delay:var(--tdl,0s);opacity:.7}",
    "@keyframes mcTwinkle{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:.85;transform:scale(1.15)}}",
    // clouds
    ".mc-cloud{position:absolute;display:grid;grid-auto-flow:column;opacity:.10;animation:mcDrift var(--cd,80s) linear infinite}",
    ".mc-cloud i{width:16px;height:16px;background:#cfe0ff;display:block}",
    "@keyframes mcDrift{from{transform:translateX(-20vw)}to{transform:translateX(120vw)}}",
    "@media (prefers-reduced-motion: reduce){.mc-cube,.mc-cloud,.mc-sway,.mc-floor,.mc-star{animation:none}}"
  ].join("");

  // block palettes: [top, side, dark]
  var PAL = {
    grass:   ["#6cb33f", "#7a4b27", "#5e3a1d"],
    stone:   ["#9b9b9b", "#7d7d7d", "#666"],
    diamond: ["#62f0e6", "#37b8c9", "#2a8fa3"],
    gold:    ["#ffd23f", "#e0a52a", "#bd861d"]
  };

  // scattered blocks (deterministic so it looks composed, not random)
  // layer: far | mid | near
  var BLOCKS = [
    { left: 6,  top: 14, size: 46, type: "grass",   fd: 15, rd: 60, op: .5,  dl: 0,   layer: "mid"  },
    { left: 84, top: 10, size: 38, type: "diamond", fd: 18, rd: 48, op: .55, dl: 2,   layer: "far"  },
    { left: 70, top: 26, size: 26, type: "stone",   fd: 13, rd: 70, op: .4,  dl: 1,   layer: "far"  },
    { left: 16, top: 40, size: 30, type: "gold",    fd: 17, rd: 55, op: .5,  dl: 3,   layer: "near" },
    { left: 90, top: 46, size: 44, type: "grass",   fd: 16, rd: 64, op: .45, dl: 1.5, layer: "mid"  },
    { left: 40, top: 58, size: 24, type: "diamond", fd: 14, rd: 50, op: .5,  dl: 2.5, layer: "far"  },
    { left: 8,  top: 66, size: 40, type: "stone",   fd: 19, rd: 58, op: .42, dl: 0.5, layer: "mid"  },
    { left: 78, top: 70, size: 30, type: "gold",    fd: 15, rd: 66, op: .5,  dl: 3.5, layer: "near" },
    { left: 30, top: 82, size: 50, type: "grass",   fd: 20, rd: 72, op: .48, dl: 1,   layer: "near" },
    { left: 60, top: 88, size: 28, type: "diamond", fd: 16, rd: 54, op: .5,  dl: 2,   layer: "mid"  },
    { left: 50, top: 20, size: 22, type: "stone",   fd: 12, rd: 62, op: .38, dl: 4,   layer: "far"  },
    { left: 94, top: 80, size: 34, type: "grass",   fd: 18, rd: 68, op: .45, dl: 0.8, layer: "far"  }
  ];

  var STARS = [
    [4,6,2.6,0],[12,22,3.4,1],[22,9,3,0.5],[33,30,2.8,1.4],[45,7,3.6,0.2],
    [56,26,2.5,2],[66,12,3.2,0.9],[76,33,2.9,1.7],[88,18,3.5,0.4],[95,32,2.7,1.1],
    [18,50,3.1,0.7],[52,44,2.6,1.9],[83,52,3.3,0.3],[38,16,2.4,2.4],[70,46,3,1.2]
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

  function makeStar(s) {
    var el = document.createElement("div");
    el.className = "mc-star";
    el.style.cssText = "left:" + s[0] + "%;top:" + s[1] + "%;--td:" + s[2] + "s;--tdl:" + s[3] + "s";
    return el;
  }

  function build() {
    var world = document.createElement("div");
    world.className = "mc-world";
    var scene = document.createElement("div"); scene.className = "mc-scene";
    var sway  = document.createElement("div"); sway.className  = "mc-sway";

    var far  = document.createElement("div"); far.className  = "mc-layer mc-far";
    var mid  = document.createElement("div"); mid.className  = "mc-layer mc-mid";
    var near = document.createElement("div"); near.className = "mc-layer mc-near";
    var layers = { far: far, mid: mid, near: near };

    STARS.forEach(function (s) { far.appendChild(makeStar(s)); });
    far.appendChild(makeCloud(8, 5, 90));
    far.appendChild(makeCloud(30, 4, 120));
    mid.appendChild(makeCloud(60, 6, 150));
    BLOCKS.forEach(function (b) { layers[b.layer || "mid"].appendChild(makeCube(b)); });

    var horizon = document.createElement("div"); horizon.className = "mc-horizon";
    var floor   = document.createElement("div"); floor.className   = "mc-floor";
    mid.appendChild(horizon);
    mid.appendChild(floor);

    sway.appendChild(far); sway.appendChild(mid); sway.appendChild(near);
    scene.appendChild(sway);
    world.appendChild(scene);
    document.body.appendChild(world);
    return { scene: scene, far: far, mid: mid, near: near };
  }

  // camera: tilt with scroll, follow pointer on desktop; smooth via rAF lerp
  function camera(els) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, tScroll = 0, cScroll = 0, raf = null;
    var hasHover = window.matchMedia && window.matchMedia("(hover:hover)").matches;

    function onScroll() {
      var h = Math.max(1, (document.documentElement.scrollHeight || 1) - window.innerHeight);
      tScroll = Math.max(0, Math.min(1, (window.scrollY || 0) / h));
      kick();
    }
    function onPointer(e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;   // -1..1
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      kick();
    }
    function frame() {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06; cScroll += (tScroll - cScroll) * 0.08;
      var rx = -3 - cScroll * 7 + cy * -2.2;   // tip forward as you scroll deeper
      var ry = cx * 3.2;
      els.scene.style.transform = "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      // parallax: layers slide at different speeds with scroll
      var s = cScroll * 100;
      els.far.style.transform  = "translateZ(-420px) scale(1.467) translateY(" + (s * 0.28) + "px)";
      els.mid.style.transform  = "translateZ(-160px) scale(1.178) translateY(" + (s * 0.62) + "px)";
      els.near.style.transform = "translateZ(90px) scale(.9) translateY(" + (s * 1.15) + "px)";
      if (Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(tScroll - cScroll) > 0.001) raf = requestAnimationFrame(frame);
      else raf = null;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }

    window.addEventListener("scroll", onScroll, { passive: true });
    if (hasHover) window.addEventListener("pointermove", onPointer, { passive: true });
    onScroll(); kick();
  }

  function init() { injectCSS(); camera(build()); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
  window.MCWorld = { _inited: true };
})();
