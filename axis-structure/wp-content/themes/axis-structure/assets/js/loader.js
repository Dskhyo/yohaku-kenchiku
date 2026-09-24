AxisMotion.intro = async function ({reveal=()=>{},skip=()=>{}} = {}) {
  const root = document.documentElement;
  if (!root.classList.contains('intro-pending') || !window.gsap) {
    skip();root.classList.remove('intro-pending'); return;
  }
  await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 350))]);
  if (!root.classList.contains('intro-pending')) {skip();return;}
  const loader = document.createElement('div');
  loader.className='axis-loader'; loader.setAttribute('aria-hidden','true');
  loader.innerHTML=`<div class="loader-shutter left"></div><div class="loader-shutter right"></div><div class="loader-grid"></div><div class="loader-core"><p class="loader-caption">STRUCTURAL ANALYSIS / BRAND INTRO</p><p class="loader-logo">AXIS <span>STRUCTURE</span></p><div class="loader-wave"><svg viewBox="0 0 400 50"><path d="M0 25H100l8-4 7 9 8-20 8 31 8-37 8 45 8-30 8 19 8-15 8 6 8-3H400" fill="none" stroke="currentColor"/></svg></div><p class="loader-state">FRAME ANALYSIS</p><small>CONCEPT VISUALIZATION — NOT A SAFETY ASSESSMENT</small></div><button class="loader-skip" tabindex="-1">SKIP INTRO ↗</button>`;
  document.body.append(loader);
  root.classList.add('intro-mounted');
  // Overlay is decorative and does not trap keyboard users; any input skips it.
  return new Promise(resolve => {
    let done=false;
    const finish=(skipped=true)=>{if(done)return;done=true;if(skipped)skip();timeline.kill();clearTimeout(window.axisIntroDeadline);clearTimeout(safety);root.classList.remove('intro-pending','intro-mounted');loader.remove();try{sessionStorage.setItem('axis_intro_played','1');}catch(_){}for(const type of ['wheel','touchstart','keydown'])window.removeEventListener(type,finish);resolve();};
    const timeline=gsap.timeline({onComplete:()=>finish(false)});
    const safety=setTimeout(finish,3200);
    const state=loader.querySelector('.loader-state');
    timeline.from('.loader-grid',{opacity:0,duration:.35})
      .from('.loader-core',{opacity:0,duration:.35},.2)
      .call(()=>{state.textContent='SEISMIC CHECK';},[],.6)
      .call(()=>{state.textContent='LOAD CALCULATION';},[],.95)
      .fromTo('.loader-wave path',{strokeDasharray:500,strokeDashoffset:500},{strokeDashoffset:0,duration:.7},.85)
      .call(()=>{state.textContent='SAFETY VERIFIED / CONCEPT';},[],1.65)
      .call(reveal,[],1.9)
      .to('.loader-core',{opacity:0,duration:.22},1.9)
      .to('.loader-shutter.left',{xPercent:-100,duration:.5,ease:'power3.inOut'},1.9)
      .to('.loader-shutter.right',{xPercent:100,duration:.5,ease:'power3.inOut'},1.9)
      .to('.loader-grid',{opacity:0,duration:.5},1.9);
    loader.querySelector('button').addEventListener('click',finish);
    for(const type of ['wheel','touchstart','keydown'])window.addEventListener(type,finish,{once:true,passive:true});
  });
};
