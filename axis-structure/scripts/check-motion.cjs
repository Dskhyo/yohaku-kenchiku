const {chromium}=require('playwright');const fs=require('node:fs');const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const errors=[];const findings=[];const dir=path.resolve(__dirname,'../artifacts');
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 const url='http://127.0.0.1:4173/axis-structure/index.html';
 await page.goto(url+'?intro=1');await page.locator('.axis-loader').waitFor();await page.screenshot({path:path.join(dir,'intro-1440.png')});await page.waitForFunction(()=>document.documentElement.classList.contains('intro-complete'));await page.waitForTimeout(1900);
 if(await page.evaluate(()=>sessionStorage.getItem('axis_intro_played'))!=='1')throw Error('Session flag');
 await page.screenshot({path:path.join(dir,'motion-hero-1440.png')});
 const phases=[];
 for(const p of [.02,.23,.4,.58,.75,.99]){
  await page.evaluate(p=>{const s=ScrollTrigger.getById('axis-technology');scrollTo(0,s.start+(s.end-s.start)*p);},p);await page.waitForTimeout(650);
  phases.push(await page.locator('.technology').getAttribute('data-phase'));
  if(p===.58)await page.screenshot({path:path.join(dir,'motion-technology-1440.png')});
 }
 if(new Set(phases).size!==6)throw Error('Phases '+phases);findings.push({desktopPhases:phases});
 await page.locator('.metrics').scrollIntoViewIfNeeded();await page.waitForTimeout(1500);
 const numbers=await page.locator('.metrics dd').allTextContents();if(numbers.join('|')!=='03|-42%|1,240|386')throw Error('Numbers '+numbers);findings.push({numbers});
 const count=await page.evaluate(()=>ScrollTrigger.getAll().length);
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(700);
 if(await page.locator('.phase-panel').count()!==1)throw Error('Duplicate phases');
 const mobile=await page.evaluate(()=>({pin:!!ScrollTrigger.getById('axis-technology').pin,overflow:document.documentElement.scrollWidth>innerWidth}));if(!mobile.pin||mobile.overflow)throw Error('Mobile '+JSON.stringify(mobile));
 await page.evaluate(()=>{const s=ScrollTrigger.getById('axis-technology');scrollTo(0,s.start+(s.end-s.start)*.58);});await page.waitForTimeout(650);await page.screenshot({path:path.join(dir,'motion-technology-390.png')});findings.push({mobile});
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(400);if(await page.evaluate(()=>ScrollTrigger.getAll().length)!==0)throw Error('Reduced motion triggers remain');if(await page.locator('.phase-panel').count())throw Error('Reduced motion markup remains');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(700);const after=await page.evaluate(()=>ScrollTrigger.getAll().length);if(after>count)throw Error('Duplicate triggers '+count+' '+after);findings.push({initialTriggers:count,afterResize:after});
 await page.goto(url);if(await page.locator('.axis-loader').count())throw Error('Repeated intro');await page.waitForFunction(()=>document.documentElement.classList.contains('intro-complete'));
 await page.goto(url+'?intro=1');await page.locator('.axis-loader').waitFor();await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('.axis-loader'));
 const noJS=await browser.newPage({javaScriptEnabled:false,viewport:{width:1440,height:900}});await noJS.goto(url);if(!await noJS.locator('h1').isVisible())throw Error('No JS content hidden');await noJS.close();
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto(url+'?intro=1');if(await reduced.locator('.axis-loader').count())throw Error('Reduced intro');await reduced.close();
 const blocked=await browser.newPage();await blocked.route('**/vendor/**',route=>route.abort());await blocked.goto(url+'?intro=1');await blocked.waitForFunction(()=>!document.documentElement.classList.contains('intro-pending'));if(!await blocked.locator('h1').isVisible())throw Error('GSAP failure hid page');await blocked.close();
 await browser.close();const result={findings,errors};fs.writeFileSync(path.join(dir,'motion-checks.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
