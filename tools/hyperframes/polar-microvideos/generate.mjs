import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'microvideos.json'), 'utf8'));
const generatedRoot = path.join(root, 'generated');

fs.rmSync(generatedRoot, { recursive: true, force: true });
fs.mkdirSync(generatedRoot, { recursive: true });

for (const item of manifest) {
  const project = path.join(generatedRoot, item.slug);
  fs.mkdirSync(path.join(project, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(project, 'audio'), { recursive: true });

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>POLAR ${item.slug}</title>
<style>
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#020409}
*{box-sizing:border-box}
[data-composition-id]{position:relative;width:1920px;height:1080px;overflow:hidden;background:#020409}
.media-wrap{position:absolute;inset:0;overflow:hidden;background:#020409}
.media-wrap video{width:100%;height:100%;object-fit:cover}
.polarity{position:absolute;inset:-18%;pointer-events:none;background:linear-gradient(112deg,transparent 35%,rgba(0,229,255,.72) 47%,rgba(255,85,0,.72) 53%,transparent 65%);filter:blur(18px);mix-blend-mode:screen;opacity:.38}
.frame{position:absolute;inset:28px;border:1px solid rgba(0,229,255,.24);box-shadow:inset 0 0 70px rgba(0,229,255,.08),inset 0 0 110px rgba(255,85,0,.06);pointer-events:none}
.status{position:absolute;left:54px;bottom:42px;padding:10px 16px;border-left:4px solid #00E5FF;background:rgba(2,4,9,.72);color:#EFF8FF;font:700 18px/1.25 'Courier New',monospace;letter-spacing:.12em;text-transform:uppercase}
</style>
</head>
<body>
<div data-composition-id="polar-${item.slug}" data-start="0" data-duration="8" data-width="1920" data-height="1080">
  <div class="media-wrap" data-layout-ignore>
    <video id="visual" data-start="0" data-duration="8" data-track-index="0" src="assets/${item.visualMaster}" muted playsinline></video>
  </div>
  <div id="polarity" class="polarity" data-start="0" data-duration="8" data-track-index="1"></div>
  <div class="frame" data-layout-ignore></div>
  <div id="status" class="status">P.O.L.A.R. // ${item.slug}</div>
  <audio id="music" data-start="0" data-duration="8" data-track-index="3" src="audio/YA.wav" data-volume="0.18"></audio>
  <audio id="narration" data-start="0" data-duration="8" data-track-index="4" src="audio/${item.narration}" data-volume="1"></audio>
</div>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script>
window.__timelines=window.__timelines||{};
const tl=gsap.timeline({paused:true});
tl.from('#status',{x:-40,opacity:0,duration:.45,ease:'power3.out'},.18)
  .from('#polarity',{xPercent:-55,opacity:0,duration:.7,ease:'power2.out'},0)
  .to('#polarity',{xPercent:55,opacity:.2,duration:1.1,ease:'power2.inOut'},6.5)
  .to('#status',{y:18,opacity:0,duration:.35,ease:'power2.in'},7.5);
window.__timelines['polar-${item.slug}']=tl;
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(project, 'index.html'), html);
  fs.writeFileSync(path.join(project, 'SCRIPT.txt'), `${item.script}\n`);
}

console.log(`Generated ${manifest.length} approved POLAR microvideo projects.`);
