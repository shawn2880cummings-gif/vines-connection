/*
 * Sunny — the official Vines Connection kids mascot.
 * Reusable across lessons. One include + Sunny.init({...}).
 *
 *   <script src="/lessons/sunny.js"></script>
 *   <script>
 *     Sunny.init({
 *       name: '☀️ Sunny says',
 *       sections: [['.hero','hero'], ['#ch1','ch1'], ['#finale','finale']],
 *       messages: {
 *         hero:   { text: "Hi! I'm <strong>Sunny</strong>!", mood: 'happy' },
 *         ch1:    { text: "Whoa!", mood: 'wow' },
 *         finale: { text: "You did it!", mood: 'celebrate' }
 *       }
 *     });
 *   </script>
 *
 * API: Sunny.say(key|{text,mood}), Sunny.setMood(m), Sunny.react('bounce'|'celebrate'),
 *      Sunny.celebrate(), Sunny.toggleVoice(bool)
 * Moods: happy · excited · wow · think · celebrate
 */
(function () {
  if (window.Sunny && window.Sunny._inited) return;

  var CSS = [
    ".sunny-guide{position:fixed;z-index:1500;display:flex;align-items:flex-end;gap:12px;max-width:min(380px,86vw);pointer-events:none}",
    ".sunny-bottom-left{left:16px;bottom:16px}",
    ".sunny-bottom-right{right:16px;bottom:16px;flex-direction:row-reverse}",
    ".sunny-char{width:80px;height:80px;flex-shrink:0;cursor:pointer;pointer-events:auto;filter:drop-shadow(0 0 16px rgba(255,200,60,.65));animation:sunnyBob 3.2s ease-in-out infinite}",
    "@keyframes sunnyBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}",
    ".sunny-char.sunny-bounce{animation:sunnyBounce .6s ease}",
    "@keyframes sunnyBounce{0%{transform:translateY(0) scale(1)}30%{transform:translateY(-16px) scale(1.08)}55%{transform:translateY(2px) scale(.95)}100%{transform:translateY(0) scale(1)}}",
    ".sunny-char.sunny-cele{animation:sunnyCele 1.3s ease}",
    "@keyframes sunnyCele{0%,100%{transform:rotate(0) scale(1)}20%{transform:rotate(-13deg) scale(1.12)}45%{transform:rotate(13deg) scale(1.14)}70%{transform:rotate(-8deg) scale(1.08)}}",
    ".sunny-rays{transform-box:fill-box;transform-origin:center;animation:sunnySpin 22s linear infinite}",
    "@keyframes sunnySpin{to{transform:rotate(360deg)}}",
    ".sunny-char[data-mood='excited'] .sunny-rays,.sunny-char[data-mood='celebrate'] .sunny-rays{animation:sunnySpin 6s linear infinite}",
    ".sunny-bubble{position:relative;width:max-content;min-width:160px;max-width:min(290px,66vw);background:#fff;color:#1a1433;border-radius:16px;padding:12px 16px;border:3px solid #ff9f1c;font-family:'Fredoka','Space Grotesk',system-ui,sans-serif;font-size:14.5px;line-height:1.45;box-shadow:0 10px 30px rgba(0,0,0,.45);transition:transform .25s cubic-bezier(.23,1,.32,1)}",
    ".sunny-bottom-left .sunny-bubble::after{content:'';position:absolute;left:-13px;bottom:20px;border:8px solid transparent;border-right-color:#ff9f1c}",
    ".sunny-bottom-right .sunny-bubble::after{content:'';position:absolute;right:-13px;bottom:20px;border:8px solid transparent;border-left-color:#ff9f1c}",
    ".sunny-bubble strong{color:#ff4757}",
    ".sunny-name{display:block;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1.5px;color:#ff9f1c;text-transform:uppercase;margin-bottom:3px}",
    ".sunny-voice,.sunny-min{position:absolute;top:-12px;width:30px;height:30px;border-radius:50%;border:2px solid #ff9f1c;background:#161b33;color:#ff9f1c;font-size:14px;line-height:1;cursor:pointer;pointer-events:auto;display:flex;align-items:center;justify-content:center}",
    ".sunny-voice{right:-10px}",
    ".sunny-min{right:24px;border-color:rgba(255,255,255,.2);color:rgba(240,233,210,.65);font-size:13px}",
    ".sunny-min-on .sunny-bubble{display:none}",
    /* faces */
    ".sunny-char .m{display:none}",
    ".sunny-char .e-happy{display:none}",
    ".sunny-char[data-mood='happy'] .m-smile{display:block}",
    ".sunny-char[data-mood='excited'] .m-grin{display:block}",
    ".sunny-char[data-mood='wow'] .m-o{display:block}",
    ".sunny-char[data-mood='think'] .m-think{display:block}",
    ".sunny-char[data-mood='celebrate'] .m-grin{display:block}",
    ".sunny-char[data-mood='celebrate'] .e-open{display:none}",
    ".sunny-char[data-mood='celebrate'] .e-happy{display:block}",
    ".sunny-char .e-open{transform-box:fill-box;transform-origin:center;transition:transform .09s}",
    ".sunny-char.sunny-blink .e-open{transform:scaleY(.12)}",
    "@media(max-width:560px){.sunny-char{width:62px;height:62px}.sunny-bubble{font-size:13px;padding:10px 12px}}"
  ].join("");

  var SVG =
    '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="sunny-rays" stroke="#ffd23f" stroke-width="4" stroke-linecap="round">' +
        '<line x1="80" y1="50" x2="93" y2="50"/><line x1="71" y1="71" x2="80" y2="80"/>' +
        '<line x1="50" y1="80" x2="50" y2="93"/><line x1="29" y1="71" x2="20" y2="80"/>' +
        '<line x1="20" y1="50" x2="7" y2="50"/><line x1="29" y1="29" x2="20" y2="20"/>' +
        '<line x1="50" y1="20" x2="50" y2="7"/><line x1="71" y1="29" x2="80" y2="20"/>' +
      '</g>' +
      '<circle cx="50" cy="50" r="26" fill="#ffd23f" stroke="#ff9f1c" stroke-width="3"/>' +
      '<circle cx="36" cy="55" r="3.2" fill="#ff8a5b" opacity="0.55"/>' +
      '<circle cx="64" cy="55" r="3.2" fill="#ff8a5b" opacity="0.55"/>' +
      '<g class="e e-open"><circle cx="42" cy="46" r="3.6" fill="#5a3a00"/><circle cx="58" cy="46" r="3.6" fill="#5a3a00"/></g>' +
      '<g class="e e-happy">' +
        '<path d="M38 47 Q42 41 46 47" fill="none" stroke="#5a3a00" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M54 47 Q58 41 62 47" fill="none" stroke="#5a3a00" stroke-width="3" stroke-linecap="round"/>' +
      '</g>' +
      '<path class="m m-smile" d="M40 56 Q50 64 60 56" fill="none" stroke="#5a3a00" stroke-width="3" stroke-linecap="round"/>' +
      '<path class="m m-grin" d="M39 55 Q50 71 61 55 Q50 60 39 55 Z" fill="#7a3b1d" stroke="#5a3a00" stroke-width="2"/>' +
      '<ellipse class="m m-o" cx="50" cy="59" rx="5" ry="6.5" fill="#7a3b1d" stroke="#5a3a00" stroke-width="2"/>' +
      '<path class="m m-think" d="M44 58 Q50 55 57 59" fill="none" stroke="#5a3a00" stroke-width="3" stroke-linecap="round"/>' +
    '</svg>';

  var opts = { messages: {}, sections: [], startKey: null, name: "☀️ Sunny says", voice: false, position: "bottom-left" };
  var voiceOn = false, lastKey = null, els = {}, blinkTimer = null;

  function injectCSS() {
    if (document.getElementById("sunny-css")) return;
    var s = document.createElement("style");
    s.id = "sunny-css"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function resolve(key) {
    if (key == null) return null;
    if (typeof key === "object") return { text: key.text, mood: key.mood || "happy" };
    var m = opts.messages[key];
    if (m == null) return null;
    return (typeof m === "string") ? { text: m, mood: "happy" } : { text: m.text, mood: m.mood || "happy" };
  }

  function stripHtml(s) { var d = document.createElement("div"); d.innerHTML = s; return d.textContent || ""; }
  function speakText(text) {
    if (!voiceOn || !("speechSynthesis" in window) || !text) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(stripHtml(text));
    u.rate = 1; u.pitch = 1.2;
    speechSynthesis.speak(u);
  }
  function toggleVoice(on) {
    voiceOn = (on === undefined) ? !voiceOn : !!on;
    if (els.voice) els.voice.textContent = voiceOn ? "🔊" : "🔈";
    var cur = resolve(lastKey);
    if (voiceOn && cur) speakText(cur.text);
    else if (!voiceOn && "speechSynthesis" in window) speechSynthesis.cancel();
  }

  function setMood(mood) { if (mood && els.char) els.char.setAttribute("data-mood", mood); }
  function react(type) {
    if (!els.char) return;
    var cls = (type === "celebrate") ? "sunny-cele" : "sunny-bounce";
    els.char.classList.remove("sunny-bounce", "sunny-cele");
    void els.char.offsetWidth;
    els.char.classList.add(cls);
    setTimeout(function () { if (els.char) els.char.classList.remove(cls); }, type === "celebrate" ? 1400 : 650);
  }
  function celebrate() { setMood("celebrate"); react("celebrate"); var c = resolve(lastKey); if (c) speakText(c.text); }

  function say(key) {
    var msg = resolve(key);
    if (!msg || !els.text) return;
    var isObj = (typeof key === "object");
    var same = (!isObj && key === lastKey);
    if (!isObj) lastKey = key;
    els.text.innerHTML = msg.text;
    setMood(msg.mood);
    els.bubble.style.transform = "scale(0.94)";
    requestAnimationFrame(function () { els.bubble.style.transform = "scale(1)"; });
    if (!same) speakText(msg.text);
  }

  function build() {
    var wrap = document.createElement("div");
    wrap.className = "sunny-guide sunny-" + (opts.position || "bottom-left");
    wrap.innerHTML =
      '<div class="sunny-char" data-mood="happy" role="button" tabindex="0" aria-label="Sunny the guide — tap to hear again">' + SVG + '</div>' +
      '<div class="sunny-bubble">' +
        '<button class="sunny-min" aria-label="Hide Sunny" title="Hide Sunny">–</button>' +
        '<button class="sunny-voice" aria-label="Toggle voice" title="Let Sunny read out loud">🔈</button>' +
        '<span class="sunny-name"></span><span class="sunny-text"></span>' +
      '</div>';
    document.body.appendChild(wrap);
    els.wrap = wrap;
    els.char = wrap.querySelector(".sunny-char");
    els.bubble = wrap.querySelector(".sunny-bubble");
    els.text = wrap.querySelector(".sunny-text");
    els.name = wrap.querySelector(".sunny-name");
    els.voice = wrap.querySelector(".sunny-voice");
    els.min = wrap.querySelector(".sunny-min");
    els.name.textContent = opts.name;

    els.voice.addEventListener("click", function (e) { e.stopPropagation(); toggleVoice(); });
    els.min.addEventListener("click", function (e) { e.stopPropagation(); wrap.classList.toggle("sunny-min-on"); });
    function poke() { wrap.classList.remove("sunny-min-on"); react("bounce"); var c = resolve(lastKey); if (c) speakText(c.text); }
    els.char.addEventListener("click", poke);
    els.char.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); poke(); } });
  }

  function observe() {
    if (!("IntersectionObserver" in window) || !opts.sections.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { var k = en.target.getAttribute("data-sunny"); if (k && k !== lastKey) say(k); }
      });
    }, { threshold: 0.45 });
    opts.sections.forEach(function (pair) {
      var el = document.querySelector(pair[0]);
      if (el) { el.setAttribute("data-sunny", pair[1]); io.observe(el); }
    });
  }

  function startBlink() {
    blinkTimer = setInterval(function () {
      if (!els.char) return;
      els.char.classList.add("sunny-blink");
      setTimeout(function () { if (els.char) els.char.classList.remove("sunny-blink"); }, 190);
    }, 3800);
  }

  function start() {
    build();
    if (opts.voice) toggleVoice(true);
    var first = opts.startKey || (opts.sections[0] && opts.sections[0][1]) || Object.keys(opts.messages)[0];
    if (first) { lastKey = null; say(first); }
    observe();
    startBlink();
  }

  function init(userOpts) {
    if (window.Sunny._started) return;
    window.Sunny._started = true;
    opts = Object.assign(opts, userOpts || {});
    injectCSS();
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  }

  window.Sunny = {
    _inited: true, _started: false,
    init: init, say: say, setMood: setMood, react: react, celebrate: celebrate, toggleVoice: toggleVoice
  };
})();
