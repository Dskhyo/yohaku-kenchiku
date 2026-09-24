const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const results=[],errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  for(const [width,height] of [[390,844],[375,667],[320,600],[768,1024]]){
   await page.setViewportSize({width,height});
   await page.goto('http://127.0.0.1:4173/axis-structure/index.html#technology');
   await page.waitForFunction(()=>!!window.ScrollTrigger?.getById('axis-technology'));
   await page.evaluate(async()=>{await document.fonts.ready;ScrollTrigger.refresh();});
   const phases=[];
   for(const progress of [.02,.23,.4,.58,.75,.99,.4]){
    await page.evaluate(p=>{const s=ScrollTrigger.getById('axis-technology');scrollTo(0,s.start+(s.end-s.start)*p)},progress);
    await page.waitForTimeout(400);
    const state=await page.evaluate(()=>{const s=document.querySelector('.mobile-analysis-stage').getBoundingClientRect();return {phase:document.querySelector('.technology').dataset.phase,top:s.top,bottom:s.bottom,header:document.querySelector('.site-header').getBoundingClientRect().bottom,overflow:document.documentElement.scrollWidth>innerWidth};});
    if(state.top<state.header-1||state.bottom>height||state.overflow)throw Error(JSON.stringify({width,height,progress,state}));
    phases.push(state.phase);
    if(progress===.58)await page.screenshot({path:path.resolve(__dirname,`../artifacts/mobile-analysis-${width}.png`)});
   }
   if(phases.join(',')!=='0,1,2,3,4,5,2')throw Error('Mobile phase sequence '+phases);
   await page.evaluate(()=>scrollTo(0,ScrollTrigger.getById('axis-technology').end+innerHeight));await page.waitForTimeout(300);
   const released=await page.locator('.mobile-analysis-stage').evaluate(el=>el.getBoundingClientRect().bottom<innerHeight);
   if(!released)throw Error('Pin did not release');
   results.push({width,height,phases,released});
  }
  await page.setViewportSize({width:844,height:390});await page.waitForTimeout(500);
  if(await page.locator('.mobile-analysis-stage').count())throw Error('Landscape stage not removed');
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);
  if(await page.locator('.mobile-analysis-stage').count()!==1)throw Error('Duplicate stage');
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(300);
  if(await page.locator('.mobile-analysis-stage').count()||await page.locator('.pin-spacer').count())throw Error('Reduced motion cleanup');
  if(await page.locator('.technology-model').count()!==1)throw Error('Model lost during cleanup');
  if(errors.length)throw Error(errors.join('\n'));
  const report={results,landscapeFallback:true,reducedMotionCleanup:true,errors};
  fs.writeFileSync(path.resolve(__dirname,'../artifacts/mobile-analysis-checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
