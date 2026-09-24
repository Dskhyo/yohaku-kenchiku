window.AxisMotion = {
  modules: [],
  add(fn) { this.modules.push(fn); },
  frame() {
    return `<svg class="motion-frame" viewBox="0 0 660 480" fill="none" aria-hidden="true"><g class="frame-lines" stroke="currentColor" stroke-width="1"><path d="M65 155 400 40 600 120 260 245ZM65 155V345L260 450 600 325V120M260 245V450M400 40V240M65 250 260 350 600 225M65 345 400 240 600 325M175 117V401M288 79V280M373 205V408M486 163V366M175 117 373 205M288 79 486 163M65 203 260 295 600 174M65 300 260 400 600 275"/><path d="M40 155V355M26 155H78M26 345H78M60 130 399 16 616 102M280 467 619 342" stroke-dasharray="3 6"/></g><g class="frame-control" stroke="#479aff" stroke-width="5"><path d="M175 117V401M373 205V408M486 163V366M260 245V450"/></g><g class="frame-load" stroke="#91caff" stroke-width="2"><path d="M175 52V103m-7-9 7 9 7-9M288 12V65m-7-9 7 9 7-9M373 136V191m-7-9 7 9 7-9M486 95V150m-7-9 7 9 7-9"/></g></svg>`;
  },
  draw(gsap, selector, trigger, start = 'top 85%') {
    document.querySelectorAll(selector).forEach(path => {
      const length = path.getTotalLength();
      gsap.fromTo(path, {strokeDasharray:length,strokeDashoffset:length}, {strokeDashoffset:0,ease:'none',scrollTrigger:{trigger,start,end:'bottom 50%',scrub:true}});
    });
  }
};
