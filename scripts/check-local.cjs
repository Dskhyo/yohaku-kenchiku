const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const dir=path.resolve(__dirname,'../artifacts');fs.mkdirSync(dir,{recursive:true});
 const errors=[];const results=[];
 for(const width of [1440,1024,768,480,390]) {
  const page=await browser.newPage({viewport:{width,height:width>900?1000:844},reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.documentElement.classList.contains('intro-complete'));
  await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';}await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
  results.push(await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0)})));
  if(width===1440||width===390){await page.screenshot({path:path.join(dir,`home-${width}.png`),fullPage:true});await page.screenshot({path:path.join(dir,`hero-${width}.png`)});}
  if(width===390){await page.locator('.menu-toggle').click();if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='true')throw Error('Menu did not open');await page.keyboard.press('Escape');if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false')throw Error('Escape did not close menu');}
  await page.locator('.work-card').first().click();await page.locator('dialog[open]').waitFor();if(!(await page.locator('#dialog-title').innerText()).includes('中庭'))throw Error('Work detail failed');await page.keyboard.press('Escape');
  await page.locator('.request-button').click();await page.locator('input[name=name]').fill('確認用');await page.locator('input[name=email]').fill('preview@example.com');await page.locator('input[type=checkbox]').check();await page.locator('.form-button').click();if(!(await page.locator('.form-status').innerText()).includes('送信されていません'))throw Error('Form preview failed');await page.keyboard.press('Escape');
  await page.close();
 }
 console.log(JSON.stringify({results,errors},null,2));await browser.close();if(errors.length||results.some(r=>r.overflow||!r.images||r.h1!==1))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1);});
