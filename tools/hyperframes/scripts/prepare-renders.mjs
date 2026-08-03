import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('generated');
fs.mkdirSync(outDir, { recursive: true });

const modules = [
  ['products-transition','POL-7709 // MODULE NETWORK','P.O.L.A.R. MODULE NETWORK','ACCESSING PRODUCT SYSTEMS'],
  ['blueprint-transition','POL-7709 // ARCHITECTURE','BLUEPRINT™','ARCHITECTURE PROTOCOL INITIALIZED'],
  ['drdocx-transition','POL-7709 // DOCUMENT CORE','DR.DOCX™','DOCUMENTATION CORE ONLINE'],
  ['nexus-transition','POL-7709 // AUTOMATION','NEXUS™','AUTOMATION PATHWAYS CONNECTING'],
  ['about-transition','POL-7709 // ORIGIN RECORD','FOUNDER INTELLIGENCE','ACCESSING ORIGIN RECORD'],
  ['intake-transition','POL-7709 // SECURE CHANNEL','P.O.L.A.R. INTAKE','SECURE TRANSMISSION CHANNEL OPEN'],
];

const css = `html,body{margin:0;background:#020409;overflow:hidden}.module{position:relative;width:1280px;height:720px;overflow:hidden;background:#020409;color:#eff8ff;font-family:Arial,sans-serif}.grid{position:absolute;inset:0;background-image:linear-gradient(#07212b 1px,transparent 1px),linear-gradient(90deg,#07212b 1px,transparent 1px);background-size:64px 64px;opacity:.44}.energy-c,.energy-r{position:absolute;top:-160px;width:120px;height:1040px;transform:rotate(18deg);filter:blur(4px)}.energy-c{left:170px;background:#00e5ff;box-shadow:0 0 44px #00e5ff}.energy-r{right:170px;background:#ff264a;box-shadow:0 0 44px #ff264a}.silhouette{position:absolute;left:74px;bottom:45px;width:260px;height:430px;border-radius:46% 54% 42% 58%;background:radial-gradient(circle at 50% 25%,#eff8ff 0 9%,#87959b 10% 28%,#11161b 29% 62%,transparent 63%);filter:drop-shadow(-12px 0 18px #ff264a) drop-shadow(12px 0 18px #00e5ff)}.content{position:relative;width:100%;height:100%;padding:110px 90px 90px 420px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;gap:22px}.code{font-size:20px;letter-spacing:.18em;color:#b9ced8}.title{max-width:760px;font-size:58px;line-height:1;font-weight:900}.subtitle{max-width:760px;font-size:30px;line-height:1.2;font-weight:800;color:#00e5ff}.progress{width:720px;height:9px;background:#142830}.progress span{display:block;width:100%;height:100%;background:#00e5ff;transform-origin:left}`;

for (const [id, code, title, subtitle] of modules) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script><style>${css}</style></head><body><div id="stage" data-composition-id="${id}" data-start="0" data-duration="1.05" data-width="1280" data-height="720" class="module"><div class="grid" data-layout-ignore></div><div class="energy-c" data-layout-ignore></div><div class="energy-r" data-layout-ignore></div><div class="silhouette" data-layout-ignore></div><div class="content"><div class="code">${code}</div><div class="title">${title}</div><div class="subtitle">${subtitle}</div><div class="progress"><span></span></div></div></div><script>const tl=gsap.timeline({paused:true});tl.from('.grid',{opacity:0,duration:.22,ease:'power1.out'},.1);tl.from('.energy-c',{x:-420,opacity:0,duration:.45,ease:'expo.out'},.1);tl.from('.energy-r',{x:420,opacity:0,duration:.45,ease:'circ.out'},.1);tl.from('.silhouette',{x:-70,scale:.9,opacity:0,duration:.42,ease:'back.out(1.2)'},.16);tl.from('.code',{y:18,opacity:0,duration:.25,ease:'sine.out'},.18);tl.from('.title',{x:60,opacity:0,duration:.34,ease:'power3.out'},.22);tl.from('.subtitle',{y:28,opacity:0,duration:.3,ease:'back.out(1.4)'},.35);tl.from('.progress span',{scaleX:0,duration:.66,ease:'power2.inOut'},.25);tl.to('.content',{opacity:0,duration:.12,ease:'power1.in'},.9);window.__timelines={ '${id}':tl };</script></body></html>`;
  fs.writeFileSync(path.join(outDir, `${id}.html`), html);
}
