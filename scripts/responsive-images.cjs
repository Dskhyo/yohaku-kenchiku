const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');
const root=path.resolve(__dirname,'..');
const names=['concept','courtyard','light','mountain','design','material','wood','plaster'];
(async()=>{
 for(const name of names) {
  await sharp(path.join(root,'assets/images',name+'.webp')).resize({width:768}).webp({quality:82}).toFile(path.join(root,'assets/images',name+'-768.webp'));
 }
 const htmlPath=path.join(root,'index.html');
 let html=fs.readFileSync(htmlPath,'utf8');
 html=html.replace(/src="assets\/images\/(concept|courtyard|light|mountain|design|material|wood|plaster)\.webp"(?! srcset)/g,(_,name)=>`src="assets/images/${name}.webp" srcset="assets/images/${name}-768.webp 768w, assets/images/${name}.webp 1536w" sizes="auto, 100vw"`);
 fs.writeFileSync(htmlPath,html);
 console.log('Responsive variants ready.');
})().catch(e=>{console.error(e);process.exit(1);});
