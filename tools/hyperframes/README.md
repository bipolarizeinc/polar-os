# POLAR OS HyperFrames Workspace

This directory is the isolated video-composition toolchain for POLAR OS.

## Install

```bash
npm install
```

## Validate

```bash
npm run hf:info
npm run hf:doctor
npm run hf:lint
npm run hf:inspect
```

## Preview

```bash
npm run hf:preview
```

## Render

```bash
npm run hf:render
```

## Website behavior

1. Autoplay the greeting muted on first load.
2. Keep captions visible.
3. Show **Skip Introduction** and **Enable Voice** controls.
4. Remember `polarIntroSkipped`, `polarVoiceEnabled`, and `polarReducedMotion`.
5. Never force the introduction on returning visitors.
6. Provide a replay control.
7. Trigger a destination-specific 0.6–1.2 second transition before navigation.
8. Smooth-scroll internal anchors beneath the transition overlay.
9. Hold full-page transitions until the destination is ready.
10. After 180 seconds without pointer, keyboard, touch, scroll, or visibility activity, play the idle inquiry once.
11. Respect `prefers-reduced-motion` with a static title and short fade.

## Transition map

```js
export const polarTransitions = {
  products: "products",
  blueprint: "blueprint",
  drdocx: "drdocx",
  nexus: "nexus",
  about: "about",
  intake: "intake",
};
```

## Approved messaging

- Greeting: “Welcome to BI POLARIZE ENTERPRISES. I’m P.O.L.A.R. Tell me what you’re building.”
- Products: `P.O.L.A.R. MODULE NETWORK // ACCESSING PRODUCT SYSTEMS`
- Blueprint: `BLUEPRINT™ // ARCHITECTURE PROTOCOL INITIALIZED`
- Dr.Docx: `DR.DOCX™ // DOCUMENTATION CORE ONLINE`
- Nexus: `NEXUS™ // AUTOMATION PATHWAYS CONNECTING`
- About: `FOUNDER INTELLIGENCE // ACCESSING ORIGIN RECORD`
- Intake: `P.O.L.A.R. INTAKE // SECURE TRANSMISSION CHANNEL OPEN`
- Idle inquiry: “Ummm, are you okay? Is everything alright? You can always tell me about your thing, idea, or issues directly.”
