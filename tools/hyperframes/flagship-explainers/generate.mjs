import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectsRoot = path.join(here, 'generated');
const flagships = JSON.parse(fs.readFileSync(path.join(here, 'flagships.json'), 'utf8'));

fs.rmSync(projectsRoot, { recursive: true, force: true });
fs.mkdirSync(projectsRoot, { recursive: true });

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

for (const item of flagships) {
  const dir = path.join(projectsRoot, item.slug);
  fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'audio'), { recursive: true });

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(item.name)} Flagship Explainer</title>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; background: #020405; }
    body { font-family: Arial, Helvetica, sans-serif; }
    [data-composition-id="${item.slug}"] { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: radial-gradient(circle at 75% 35%, rgba(0,229,255,.12), transparent 34%), linear-gradient(135deg, #020405, #0b1114 58%, #160500); color: #f7fbfc; }
    .grid { position: absolute; inset: 0; opacity: .2; background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px); background-size: 64px 64px; }
    .flare { position: absolute; width: 560px; height: 560px; border-radius: 50%; right: -90px; bottom: -180px; background: rgba(255,77,0,.18); filter: blur(60px); }
    .scene-content { position: relative; z-index: 3; width: 100%; height: 100%; padding: 92px 110px; display: grid; grid-template-columns: 1.08fr .92fr; gap: 70px; align-items: center; }
    .copy { display: flex; flex-direction: column; justify-content: center; gap: 24px; min-width: 0; }
    .system { color: #ff6a2a; font: 700 22px/1.2 monospace; letter-spacing: .18em; }
    h1 { margin: 0; max-width: 990px; font-size: 96px; line-height: .92; letter-spacing: -.055em; text-transform: uppercase; }
    h2 { margin: 0; max-width: 900px; color: #ff6a2a; font-size: 34px; line-height: 1.05; text-transform: uppercase; }
    .body { max-width: 940px; margin: 4px 0 0; color: #c3d0d4; font-size: 31px; line-height: 1.42; }
    .cta { align-self: flex-start; margin-top: 8px; padding: 18px 24px; border: 2px solid #ff4d00; color: #ffe4d9; font: 800 20px/1 monospace; letter-spacing: .12em; }
    .visual { position: relative; height: 820px; display: grid; place-items: center; }
    .logo-frame { position: absolute; top: 80px; left: 10px; width: 390px; height: 260px; padding: 22px; border: 1px solid rgba(255,77,0,.45); background: rgba(2,4,5,.72); backdrop-filter: blur(14px); }
    .logo-frame img { width: 100%; height: 100%; object-fit: contain; }
    .polar { position: absolute; right: -10px; bottom: 4px; width: 670px; height: 720px; object-fit: contain; object-position: center bottom; filter: drop-shadow(0 24px 32px rgba(0,0,0,.55)); }
    .division-code { position: absolute; right: 0; top: 24px; color: rgba(255,255,255,.48); font: 700 18px/1 monospace; letter-spacing: .15em; writing-mode: vertical-rl; }
    .caption { position: absolute; left: 110px; bottom: 42px; right: 110px; z-index: 5; padding-top: 14px; border-top: 2px solid rgba(255,77,0,.75); color: white; font: 700 24px/1.25 monospace; text-transform: uppercase; letter-spacing: .04em; }
  </style>
</head>
<body>
  <div data-composition-id="${item.slug}" data-width="1920" data-height="1080">
    <div class="grid" data-layout-ignore></div>
    <div class="flare" data-layout-ignore></div>
    <div class="scene-content">
      <section class="copy">
        <div class="system">POLAR OS // FLAGSHIP SYSTEM</div>
        <h1>${escapeHtml(item.name)}</h1>
        <h2>${escapeHtml(item.headline)}</h2>
        <p class="body">${escapeHtml(item.script)}</p>
        <div class="cta">${escapeHtml(item.cta)} →</div>
      </section>
      <section class="visual">
        <div class="logo-frame"><img src="assets/${escapeHtml(item.logo)}" alt="" /></div>
        <img class="polar" src="assets/${escapeHtml(item.polarStance)}" alt="" />
        <div class="division-code">BI POLARIZE // ${escapeHtml(item.slug.toUpperCase())}</div>
      </section>
    </div>
    <div class="caption">${escapeHtml(item.script)}</div>
    <audio id="narration" data-start="0" data-duration="24" data-track-index="2" src="audio/narration.wav" data-volume="1"></audio>
    <audio id="music" data-start="0" data-duration="24" data-track-index="3" src="audio/YA.wav" data-volume="0.18"></audio>
  </div>
  <script>
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
    tl.from('.system', { y: 24, opacity: 0, duration: .55, ease: 'power3.out' }, 0.1)
      .from('h1', { x: -70, opacity: 0, duration: .8, ease: 'power3.out' }, 0.25)
      .from('h2', { y: 30, opacity: 0, duration: .65, ease: 'power3.out' }, 0.75)
      .from('.body', { y: 34, opacity: 0, duration: .75, ease: 'power2.out' }, 1.15)
      .from('.cta', { scale: .92, opacity: 0, duration: .5, ease: 'back.out(1.5)' }, 2.0)
      .from('.logo-frame', { x: 70, opacity: 0, duration: .7, ease: 'power3.out' }, 0.55)
      .from('.polar', { y: 95, opacity: 0, duration: .9, ease: 'power3.out' }, 0.8)
      .to('.polar', { y: -12, duration: 3.2, repeat: 5, yoyo: true, ease: 'sine.inOut' }, 2.1)
      .to('.scene-content', { opacity: 0, duration: .8, ease: 'power2.in' }, 22.9)
      .to('.caption', { opacity: 0, duration: .5 }, 23.2);
    window.__timelines['${item.slug}'] = tl;
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  fs.writeFileSync(path.join(dir, 'script.txt'), item.script + '\n');
}

console.log(`Generated ${flagships.length} flagship explainer projects in ${projectsRoot}`);
