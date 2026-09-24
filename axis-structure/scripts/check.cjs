const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');
(async()=>{
const browser=await chromium.launch({channel:'chrome',headless:true});
const dir=path.resolve(__dirname,'../artifacts');fs.mkdirSync(dir,{recursive:true});
const errors=[];const results=[];
for(const width of [1440,1280,1024,390]){
 const page=await browser.newPage({viewport:{width,height:width>600?900:844},reducedMotion:'reduce'});
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4173/axis-structure/index.html',{waitUntil:'networkidle'});
 await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode()));});
 const state=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,images:[...document.images].every(i=>i.naturalWidth>0),missingAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)}));results.push(state);
 if(width===1440||width===390){await page.screenshot({path:path.join(dir,`home-${width}.png`),fullPage:true});await page.screenshot({path:path.join(dir,`hero-${width}.png`)});}
 await page.locator('.menu-toggle').click();if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='true')throw Error('menu');await page.keyboard.press('Escape');if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false')throw Error('escape');
 for(const id of ['project-0','data','contact','request']){await page.locator(`[data-detail="${id}"]`).first().click();await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');}
 await page.close();
}
await browser.close();fs.writeFileSync(path.join(dir,'checks.json'),JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));if(errors.length||results.some(r=>r.overflow||r.h1!==1||!r.images||r.missingAnchors.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
