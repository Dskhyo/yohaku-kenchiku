const {chromium}=require('playwright');
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/axis-structure/index.html?intro=1');
    const samples=await page.evaluate(()=>new Promise(resolve=>{
      const rows=[];const start=performance.now();
      function sample(){
        const image=document.querySelector('.hero-image');
        const shutter=document.querySelector('.loader-shutter.left');
        rows.push({time:Math.round(performance.now()-start),opacity:Number(getComputedStyle(image).opacity),loader:!!shutter,shutterX:shutter?new DOMMatrix(getComputedStyle(shutter).transform).m41:null});
        if(performance.now()-start<4400)requestAnimationFrame(sample);else resolve(rows);
      }sample();
    }));
    const closed=samples.filter(row=>row.loader&&Math.abs(row.shutterX)<.1);
    if(!closed.length||closed.some(row=>row.opacity>.01))throw Error('FV visible before shutter reveal');
    if(samples.some((row,i)=>i>0&&row.opacity<samples[i-1].opacity-.005))throw Error('FV opacity reset during handoff');
    if(samples.at(-1).opacity!==1)throw Error('FV did not finish');
    await page.setViewportSize({width:390,height:844});
    await page.waitForTimeout(250);
    if(await page.locator('.hero-image').evaluate(el=>Number(getComputedStyle(el).opacity))!==1)throw Error('Resize replayed FV');
    if(errors.length)throw Error(errors.join('\n'));
    console.log(JSON.stringify({samples:samples.length,hiddenBeforeReveal:true,opacityNeverDecreased:true,finalOpacity:1,resizeDoesNotReplay:true,errors},null,2));
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
