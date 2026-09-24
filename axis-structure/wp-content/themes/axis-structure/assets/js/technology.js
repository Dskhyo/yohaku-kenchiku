AxisMotion.add(({gsap,desktop,mobileStage}) => {
  const section=document.querySelector('.technology');
  const model=section.querySelector('.technology-model');
  const overlay=document.createElement('div'); overlay.className='technology-overlay';overlay.innerHTML=AxisMotion.frame();
  model.append(overlay);
  const completed=document.querySelector('.hero-image').cloneNode();
  completed.className='completed-building';completed.alt='';completed.loading='lazy';completed.removeAttribute('fetchpriority');completed.setAttribute('aria-hidden','true');model.append(completed);
  const phases=['ARCHITECTURE','FRAME','LOAD','SEISMIC CONTROL','VERIFICATION','SAFETY VERIFIED'];
  const descriptions=[
    ['美しい空間を、<strong>見えない構造</strong>が支える。','大きな窓や開放的な間取り。その内側で建物を支える仕組みを、外観から順に読み解いていきます。'],
    ['<strong>柱と梁</strong>を、ひとつの骨組みに。','外装を透かすと、建物の骨格が現れます。部材の配置とつながりを確かめ、力を伝える道筋を考えます。'],
    ['矢印で見える、<strong>力の通り道</strong>。','屋根や床の重さは、柱・梁を通って地盤へ。どこに、どの向きの力がかかるかを整理することが、構造設計の出発点です。'],
    ['青い部材が示す、<strong>揺れを抑える仕組み</strong>。','地震への備えは、硬さだけではありません。建物を支える骨組みと、揺れのエネルギーを受け止める部材の役割を考えます。'],
    ['「強そう」を、<strong>確かめられる根拠</strong>へ。','揺れたときの変形や、部材にかかる力を解析。想定した条件で結果を確認し、必要に応じて設計を見直します。'],
    ['検証の先にある、<strong>暮らしの安心</strong>。','骨組み・荷重・耐震部材を確かめ、完成した建築へ。見えない部分の積み重ねで、日々の暮らしを支えることを目指します。']
  ];
  const panel=document.createElement('div');panel.className='phase-panel';
  panel.innerHTML=`<ol>${phases.map((p,i)=>`<li><span>0${i+1}</span>${p}</li>`).join('')}</ol><p class="phase-description">${descriptions.map(([title,body])=>`<span class="phase-copy" aria-hidden="true"><span class="phase-copy-title">${title}</span><span class="phase-copy-body">${body}</span></span>`).join('')}</p><p class="phase-reading" aria-hidden="true">FRAME 03 / LOAD 24.8 kN</p><small>CONCEPT ANALYSIS / 解析の概念図</small><div class="phase-progress"><i></i></div>`;
  section.querySelector('.technology-grid').append(panel);
  section.classList.add('has-phases');
  let stage;
  let current;
  if(mobileStage){
    stage=document.createElement('div');stage.className='mobile-analysis-stage';
    model.before(stage);stage.append(model,panel);
    current=document.createElement('p');current.className='mobile-phase-title';panel.prepend(current);
    const hint=document.createElement('p');hint.className='mobile-phase-hint';hint.textContent='SCROLL TO ANALYZE ↓';stage.prepend(hint);
  }
  const steps=[...panel.querySelectorAll('li')];
  const copies=[...panel.querySelectorAll('.phase-copy')];
  let activePhase=-1;
  const update=progress=>{const n=Math.min(5,Math.floor(progress*6));if(n===activePhase)return;activePhase=n;steps.forEach((s,i)=>{s.classList.toggle('is-active',i===n);if(i===n)s.setAttribute('aria-current','step');else s.removeAttribute('aria-current');});copies.forEach((copy,i)=>{copy.classList.toggle('is-active',i===n);copy.setAttribute('aria-hidden',String(i!==n));});section.dataset.phase=String(n);};
  const updatePhase=progress=>{update(progress);if(current)current.textContent=`${String(Number(section.dataset.phase)+1).padStart(2,'0')} / 06 — ${phases[Number(section.dataset.phase)]}`;};
  updatePhase(0);
  gsap.set(overlay,{opacity:0});gsap.set(overlay.querySelectorAll('.frame-control,.frame-load'),{opacity:0});
  const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{id:'axis-technology',trigger:stage||section,start:desktop?'top 92px':mobileStage?()=>`top ${document.querySelector('.site-header').offsetHeight+12}px`:'top 55%',end:desktop?()=>'+='+Math.round(innerHeight*1.8):mobileStage?()=>'+='+Math.round(innerHeight*1.35):'bottom 25%',pin:desktop||mobileStage,pinSpacing:true,scrub:mobileStage?.18:.35,invalidateOnRefresh:true}});
  tl.to(completed,{opacity:0,duration:1},0)
    .to(model.querySelector('img:not(.completed-building)'),{opacity:.15,duration:1},.7)
    .to(overlay,{opacity:1,duration:.8},.6)
    .to(overlay.querySelector('.frame-load'),{opacity:1,duration:.6},1.8)
    .to(overlay.querySelector('.frame-control'),{opacity:1,duration:.7},2.8)
    .fromTo(panel.querySelector('.phase-reading'),{opacity:.3},{opacity:1,duration:.7},3.8)
    .to(completed,{opacity:1,duration:.9},5)
    .to(overlay,{opacity:0,duration:.8},5.1)
    .to(panel.querySelector('.phase-progress i'),{scaleX:1,duration:6},0);
  tl.eventCallback('onUpdate',()=>updatePhase(tl.progress()));
  return ()=>{tl.scrollTrigger?.kill(true);if(stage){stage.before(model);stage.remove();}section.classList.remove('has-phases');delete section.dataset.phase;overlay.remove();completed.remove();panel.remove();};
});
