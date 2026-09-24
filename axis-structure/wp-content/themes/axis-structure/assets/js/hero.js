// Prepare beneath the opaque loader. This one-shot reveal is independent of resize.
AxisMotion.prepareHero = () => {
  if (!document.documentElement.classList.contains('intro-pending') ||
      matchMedia('(prefers-reduced-motion:reduce)').matches ||
      scrollY > innerHeight*.5 || location.hash) {
    return {play(){},finish(){},dispose(){}};
  }
  let timeline;
  const context=gsap.context(()=>{
  timeline=gsap.timeline({paused:true,defaults:{ease:'power2.out'}});
  timeline.from('.hero>.frame-overlay',{opacity:0,duration:.55})
    .from('.hero-image',{opacity:0,scale:1.04,duration:1.7},.1)
    .from('.site-header .brand',{opacity:0,duration:.55},.35)
    .from('.hero-kicker',{opacity:0,duration:.6},.5)
    .from('.hero h1',{clipPath:'inset(0 100% 0 0)',duration:.9},.65)
    .from('.hero-description,.hero-level',{opacity:0,duration:.65},.95);
  });
  return {
    play(){if(timeline.progress()===0)timeline.play();},
    finish(){timeline.progress(1).pause();},
    dispose(){context.revert();}
  };
};
