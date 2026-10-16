/*
 * Ka Kha Ga: scroll-driven "process" chart (Discovery > Strategy > Create & Build > Scale & Optimize).
 *
 * Framer renders the four bars with a time-based entrance. This takes over: as you scroll, each bar fills
 * left-to-right in turn and its description fades in underneath.
 *
 *  - Pinned mode (chart fits on screen, i.e. most desktops): the chart uses native position:sticky, so the
 *    browser pins it with no JS in the scroll path (no stutter). JS only turns scroll distance into progress.
 *  - Flow mode (phones / short windows): nothing is pinned; the fill is tied to where the chart sits in the
 *    viewport as you scroll through it.
 *
 * Progressive enhancement: skipped for prefers-reduced-motion, and if the markup isn't found Framer's own
 * animation is left alone.
 */
(function () {
  'use strict';
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var NAV = 72;          // fixed header height to pin below
  var HOLD = 0.9;        // share of the pinned scroll spent filling; the rest is a short hold
  var css = document.createElement('style');
  css.textContent =
    '.kkg-bar{transform:none!important;transform-origin:left center;opacity:1!important}' +
    '.kkg-text{opacity:var(--kkg-o,0)!important;translate:0 calc((1 - var(--kkg-o,0)) * 14px)}';
  document.head.appendChild(css);

  var st = null, ro = null, lastP = -1;
  function visible(el) { return el.getClientRects().length > 0; }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function find() {
    var s7 = document.querySelector('[data-framer-name="s7"]');
    if (!s7) return null;
    var bars = [].filter.call(s7.querySelectorAll('[data-framer-name="--"]'), visible);
    var titles = [].filter.call(s7.querySelectorAll('[data-framer-name="Title"]'), visible);
    if (bars.length !== 4 || titles.length !== 4) return null;
    // smallest ancestor holding the chart and all four descriptions; only usable for pinning if it isn't the section itself
    var block = bars[0];
    while (block && !(block.contains(bars[3]) && block.contains(titles[0]) && block.contains(titles[3]))) block = block.parentElement;
    if (block === s7 || !block) block = null;
    return { s7: s7, bars: bars, titles: titles, block: block, pinned: false, start: 0, dist: 1 };
  }

  function unpin(b, sec) { b.style.position = ''; b.style.top = ''; sec.style.minHeight = ''; sec.style.justifyContent = ''; }

  function layout() {
    if (!st) return;
    var b = st.block, vh = innerHeight;
    if (!b) { st.pinned = false; return; }
    unpin(b, st.s7);                            // measure in normal flow
    var h = b.getBoundingClientRect().height;
    st.pinned = h + NAV + 16 <= vh;
    if (!st.pinned) return;
    st.dist = Math.round(vh * 1.6);
    st.start = b.getBoundingClientRect().top + scrollY - NAV;   // scroll position where the chart reaches the header
    b.style.position = 'sticky';
    b.style.top = NAV + 'px';
    // Sticky only travels inside its parent, so the section itself is made `dist` taller (content stays at the top).
    st.s7.style.justifyContent = 'flex-start';
    st.s7.style.minHeight = (st.s7.getBoundingClientRect().height + st.dist) + 'px';
  }

  function paint(p) {
    if (Math.abs(p - lastP) < 0.0005) return;
    lastP = p;
    for (var i = 0; i < 4; i++) {
      var f = clamp(p * 4 - i);
      st.bars[i].style.clipPath = 'inset(0 ' + ((1 - f) * 100).toFixed(2) + '% 0 0)';
      st.titles[i].style.setProperty('--kkg-o', clamp((f - 0.5) / 0.5).toFixed(3));   // text lands as its bar completes
    }
  }

  function attach() {
    st = find();
    if (!st) return;
    st.bars.forEach(function (b) { b.classList.add('kkg-bar'); });
    st.titles.forEach(function (t) { t.classList.add('kkg-text'); });
    layout();
    if (window.ResizeObserver) {
      if (ro) ro.disconnect();
      ro = new ResizeObserver(function () { layout(); });
      ro.observe(st.s7);
    }
    lastP = -1;
  }

  function frame() {
    if (!st || !st.s7.isConnected || !st.bars.every(function (b) { return b.isConnected; })) { attach(); }
    if (st) {
      var p;
      if (st.pinned) {
        p = clamp((scrollY - st.start) / (st.dist * HOLD));
      } else {
        // flow mode: bars begin as the chart enters the lower part of the screen, descriptions finish near the middle
        var top = st.bars[0].getBoundingClientRect().top;
        var bottom = st.titles[3].getBoundingClientRect().bottom;
        var span = Math.max(1, bottom - top);
        p = clamp((innerHeight * 0.85 - top) / (span * 0.85));
      }
      paint(p);
    }
    requestAnimationFrame(frame);
  }

  var w = 0;
  addEventListener('resize', function () { if (innerWidth !== w) { w = innerWidth; st = null; } });   // breakpoint swap re-renders the chart
  addEventListener('load', function () {
    w = innerWidth;
    requestAnimationFrame(frame);
    setTimeout(layout, 1500);                   // late fonts/images can change heights
  });
})();
