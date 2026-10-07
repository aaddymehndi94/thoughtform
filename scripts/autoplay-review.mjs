// Optional browser QA. Capture complete lessons at the reader's calm 1.0× baseline.
// Use a fixed production build; no synthetic clock or animation disabling.
const {chromium}=await import(process.env.THOUGHTFORM_PLAYWRIGHT||'playwright');
import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const root=process.cwd(),out=root+'/artifacts/autoplay-review',base=process.env.THOUGHTFORM_REVIEW_URL||'http://localhost:4173';
const files=process.argv.slice(2),cards=files.flatMap(file=>JSON.parse(fs.readFileSync(root+'/src/content/library/'+file+'.json')));fs.mkdirSync(out,{recursive:true});
const build=crypto.createHash('sha256').update(fs.readFileSync(root+'/dist/index.html')).digest('hex');
const browser=await chromium.launch({executablePath:process.env.THOUGHTFORM_BROWSER||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']});
const report=[],errors=[];let cursor=0;
async function worker(){const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'no-preference'});await context.addInitScript(()=>{localStorage.setItem('thoughtform.reading-guide.seen','true');localStorage.setItem('thoughtform.v1',JSON.stringify({paused:false,animationSpeed:1}));});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 while(cursor<cards.length){const card=cards[cursor++],dir=out+'/'+card.thinker;fs.mkdirSync(dir,{recursive:true});const item={id:card.id,build,beats:[]};try{
  await page.goto(base+'/#'+card.id);await page.waitForSelector('[data-thought-id="'+card.id+'"]');let started;
  for(let i=0;i<=card.scene.lesson.beats.length;i++){
   const index=i%card.scene.lesson.beats.length,beat=card.scene.lesson.beats[index];
   await page.waitForFunction(({index,caption})=>{const el=document.querySelector('.lesson-illustration');return el?.getAttribute('data-lesson-beat')===String(index)&&el.querySelector('.lesson-reading p')?.textContent===caption;},{index,caption:beat.caption},{timeout:20000});
   const now=Date.now();if(started){const prev=card.scene.lesson.beats[i-1],expected=(prev.duration||3.2)*2000,elapsed=now-started;assert(Math.abs(elapsed-expected)<(i===1?2200:1400),`beat ${i-1} dwell ${elapsed}ms, expected ${expected}ms`);item.beats[i-1].elapsed=elapsed;}started=now;
   if(i===card.scene.lesson.beats.length)break;
   await page.waitForTimeout(1500);assert(await page.locator('.lesson-illustration').getAttribute('data-lesson-beat')===String(index),'drawing advances before its transition settles');
   const screenshot=dir+'/'+card.id+'-beat-'+index+'.png';await page.locator('.lesson-illustration').screenshot({path:screenshot});item.beats.push({index,caption:beat.caption,screenshot});
  }item.ok=true;
 }catch(e){item.ok=false;item.error=e.stack;console.log('FAIL',card.id,e.message);}report.push(item);console.log('Autoplay',report.length+'/'+cards.length,card.id);fs.writeFileSync(out+'/report-'+files.join('-')+'.json',JSON.stringify({build,cards:report,errors},null,2));
 }await context.close();}
await Promise.all(Array.from({length:8},worker));assert(build===crypto.createHash('sha256').update(fs.readFileSync(root+'/dist/index.html')).digest('hex'),'build changed during capture');await browser.close();console.log('DONE',cards.length,'errors',errors.length,'failed',report.filter(r=>!r.ok).length);if(report.some(r=>!r.ok)||errors.length)process.exitCode=1;
