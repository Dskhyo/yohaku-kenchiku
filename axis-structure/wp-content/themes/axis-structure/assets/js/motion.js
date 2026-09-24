(async () => {
  if (!document.querySelector('.hero') || window.axisMotionStarted) {document.documentElement.classList.remove('intro-pending');return;}
  window.axisMotionStarted=true;
  if (!window.gsap || !window.ScrollTrigger) {document.documentElement.classList.remove('intro-pending');return;}
  gsap.registerPlugin(ScrollTrigger);
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion:reduce)');
  const hero=AxisMotion.prepareHero();
  const skipOnReduction=()=>{if(reduce.matches){hero.finish();window.dispatchEvent(new Event('keydown'));}};
  reduce.addEventListener('change',skipOnReduction);
  await AxisMotion.intro({reveal:()=>hero.play(),skip:()=>hero.finish()});
  root.classList.add('intro-complete');
  const mm=gsap.matchMedia();
  mm.add({all:'(min-width:0px)',mobileStage:'(max-width:900px) and (min-height:600px)',desktop:'(min-width:901px) and (min-height:650px)',reduce:'(prefers-reduced-motion:reduce)'},context=>{
    if(context.conditions.reduce)return;
    root.classList.add('motion-ready');
    const cleanups=[];
    try{AxisMotion.modules.forEach(fn=>{const cleanup=fn({gsap,ScrollTrigger,desktop:context.conditions.desktop,mobileStage:context.conditions.mobileStage});if(cleanup)cleanups.push(cleanup);});}
    catch(error){console.error('AXIS motion initialization failed',error);}
    return ()=>{cleanups.reverse().forEach(fn=>fn());root.classList.remove('motion-ready');};
  });
  // The desktop query may be false on mobile, so this always-matching key keeps the context active.
  const stopCursor=AxisMotion.cursor();
  const header=document.querySelector('.site-header');
  const sentinel=document.createElement('div');sentinel.className='header-sentinel';sentinel.setAttribute('aria-hidden','true');document.body.prepend(sentinel);
  const observer=new IntersectionObserver(([entry])=>header.classList.toggle('is-scrolled',!entry.isIntersecting));observer.observe(sentinel);
  await document.fonts.ready;ScrollTrigger.refresh();
  window.addEventListener('pagehide',event=>{if(event.persisted)return;hero.dispose();mm.revert();stopCursor();observer.disconnect();reduce.removeEventListener('change',skipOnReduction);},{once:true});
  window.addEventListener('pageshow',event=>{if(event.persisted)ScrollTrigger.refresh();});
})();
