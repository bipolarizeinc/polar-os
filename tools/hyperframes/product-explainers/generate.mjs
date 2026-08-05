import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const products = JSON.parse(fs.readFileSync(path.join(root, 'products.json'), 'utf8'));
const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

for (const product of products) {
  const dir = path.join(root, 'generated', product.slug);
  fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'audio'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'narration.txt'), `${product.narration}\n`);

  const benefits = product.benefits.map((benefit, index) =>
    `<div class="benefit"><small>0${index + 1}</small><strong>${esc(benefit)}</strong></div>`
  ).join('');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(product.name)} Explainer</title>
<style>
:root{--black:#020409;--cyan:#00e5ff;--orange:#ff5500;--gold:#ffb300;--white:#eff8ff}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:var(--black);color:var(--white)}
body{font-family:Inter,Arial,sans-serif}.comp{position:relative;width:1920px;height:1080px;overflow:hidden;background:var(--black)}
.clip{visibility:hidden}.scene{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;background:var(--black)}
.bg{position:absolute;inset:-3%;width:106%;height:106%;object-fit:cover;opacity:.62;filter:saturate(.92) contrast(1.1)}
.polar{position:absolute;right:40px;bottom:-40px;width:720px;height:940px;object-fit:contain;z-index:2;filter:drop-shadow(-22px 0 58px rgba(255,85,0,.22)) drop-shadow(22px 0 62px rgba(0,229,255,.28))}
.veil{position:absolute;inset:0;background:radial-gradient(circle at 73% 48%,transparent 0 24%,rgba(2,4,9,.4) 54%,rgba(2,4,9,.96) 100%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,229,255,.052) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.052) 1px,transparent 1px);background-size:70px 70px}
.content{position:relative;z-index:3;display:flex;flex-direction:column;justify-content:center;width:100%;height:100%;padding:110px 140px;gap:25px}
.eyebrow{font:800 20px/1.2 'Courier New',monospace;letter-spacing:.2em;color:var(--cyan)}
h1,h2{margin:0;max-width:1220px;font-family:Montserrat,Arial,sans-serif;font-weight:900;line-height:.92;letter-spacing:-.055em;text-transform:uppercase}h1{font-size:136px}h2{font-size:100px}.accent{color:var(--cyan)}
.lede{max-width:1050px;margin:0;font-size:36px;line-height:1.3;color:#d8e4e9}.system{font:700 18px/1.3 'Courier New',monospace;letter-spacing:.14em;color:var(--gold)}
.benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;max-width:1500px}.benefit{min-height:220px;padding:32px;border-top:5px solid var(--cyan);background:rgba(5,13,19,.88)}.benefit:nth-child(even){border-color:var(--orange)}.benefit small{font:800 19px 'Courier New';color:var(--gold)}.benefit strong{display:block;margin-top:42px;font-size:34px;line-height:1.1}
.cta .content{align-items:center;text-align:center}.seal{width:230px;height:230px;object-fit:contain}.sweep{position:absolute;inset:-16%;z-index:20;background:linear-gradient(112deg,transparent 38%,rgba(0,229,255,.9) 47%,rgba(255,85,0,.92) 53%,transparent 62%);filter:blur(14px)}
.caption{position:absolute;left:90px;right:90px;bottom:44px;z-index:30;padding:15px 20px;border:1px solid rgba(0,229,255,.34);background:rgba(1,7,12,.84);font:700 21px/1.35 'Courier New',monospace;text-align:center}
</style>
</head>
<body>
<div class="comp" data-composition-id="${product.slug}-explainer" data-start="0" data-duration="27" data-width="1920" data-height="1080">
<section id="s1" class="clip scene" data-start="0" data-duration="9" data-track-index="1"><img class="bg" src="assets/17_branded_environment.png" alt=""><div class="veil"></div><div class="grid"></div><img class="polar" src="assets/full-body-master.png" alt=""><div class="content"><span class="eyebrow">${product.code} // P.O.L.A.R. FLAGSHIP MODULE</span><h1>${esc(product.name)}</h1><p class="lede">${esc(product.tagline)}</p><span class="system">BI POLARIZE ENTERPRISES, INC.</span></div></section>
<div id="t1" class="clip sweep" data-start="8.5" data-duration="1" data-track-index="2"></div>
<section id="s2" class="clip scene" data-start="9" data-duration="10" data-track-index="1"><div class="grid"></div><div class="content"><span class="eyebrow">WHAT THE MODULE DELIVERS</span><h2>BUILT TO MOVE THE BUSINESS <span class="accent">FORWARD.</span></h2><div class="benefits">${benefits}</div></div></section>
<div id="t2" class="clip sweep" data-start="18.5" data-duration="1" data-track-index="2"></div>
<section id="s3" class="clip scene cta" data-start="19" data-duration="8" data-track-index="1"><div class="grid"></div><div class="content"><img class="seal" src="assets/bipolarization-symbol.png" alt=""><span class="eyebrow">P.O.L.A.R. MODULE // READY</span><h2>${esc(product.tagline)}</h2><p class="lede">Tell P.O.L.A.R. about your thing at PolarPaw.Online.</p><span class="system">OFF THE WALL. OUT OF THE BOX.</span></div></section>
<div class="caption">${esc(product.narration)}</div>
<audio id="narration" data-start="0" data-duration="27" data-track-index="5" src="audio/narration.wav" data-volume="1"></audio>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script>
window.__timelines=window.__timelines||{};
const tl=gsap.timeline({paused:true});
tl.from('#s1 .eyebrow',{y:36,opacity:0,duration:.55},.25).from('#s1 h1',{x:-70,opacity:0,duration:.75},.42).from('#s1 .lede',{y:44,opacity:0,duration:.58},.72).from('#s1 .polar',{x:100,opacity:0,scale:.93,duration:.8},.35).fromTo('#t1',{xPercent:-120,opacity:0},{xPercent:120,opacity:1,duration:.9},8.5).from('#s2 .eyebrow',{x:-42,opacity:0,duration:.52},9.2).from('#s2 h2',{y:48,opacity:0,duration:.68},9.38).from('#s2 .benefit',{y:56,opacity:0,scale:.96,duration:.58,stagger:.14},9.72).fromTo('#t2',{xPercent:-120,opacity:0},{xPercent:120,opacity:1,duration:.9},18.5).from('#s3 .seal',{scale:.72,rotation:-12,opacity:0,duration:.7},19.25).from('#s3 h2',{x:58,opacity:0,duration:.7},19.65).to('#s3 .content',{opacity:0,scale:.985,duration:.6},26.2);
window.__timelines['${product.slug}-explainer']=tl;
</script>
</div>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

console.log(`Generated ${products.length} flagship product explainer projects.`);
