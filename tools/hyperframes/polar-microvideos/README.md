# POLAR Website Microvideos — HyperFrames Production

This directory is the direct GitHub-to-HyperFrames production path for the eight approved POLAR website microvideos.

## Locked constraints

- HyperFrames is the renderer.
- GitHub Actions is the build environment.
- HeyGen is prohibited.
- Stock TTS, eSpeak, approximate voices, pitch shifting, and automatic fallback narration are prohibited.
- The workflow fails when any approved visual master or narration file is missing.

## Required media paths

Approved visual masters:

`public/brand/polar-microvideos/visual-masters/`

Approved narration recordings:

`public/brand/polar-microvideos/approved-narration/`

Required narration filenames:

- `greeting.wav`
- `idle.wav`
- `products.wav`
- `blueprint.wav`
- `dr-docx.wav`
- `nexus.wav`
- `about.wav`
- `intake.wav`

## Locked scripts

1. Greeting: “Welcome to BI POLARIZE ENTERPRISES. I’m P.O.L.A.R. Tell me what you’re building.”
2. Idle: “Ummm… are you okay? Is everything alright? You can always tell me about your thing, idea, or issues directly.”
3. Products: “Product systems.”
4. Blueprint: “Blueprint.”
5. Dr.Docx: “Doctor Docs.”
6. Nexus: “Nexus.”
7. About: “Founder intelligence.”
8. Intake: “P.O.L.A.R. intake.”

## Build

```bash
node tools/hyperframes/polar-microvideos/generate.mjs
```

The GitHub Actions workflow then copies the approved media, normalizes only loudness and sample format, lints, visually inspects, renders, verifies, hashes, and uploads the eight-video bundle.

The workflow does not synthesize a voice. HyperFrames composes and renders supplied audio; it does not clone speakers. Therefore, the eight approved narration recordings must be supplied directly before the render can complete.
