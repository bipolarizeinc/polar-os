# POLAR Flagship Explainers

This directory contains the nine official BI POLARIZE division explainer compositions.

## Scope

- Sav.VidzGen™
- Dr.Docx™
- Blueprint™
- BrandForge™
- LaunchPad™
- Nexus™
- Pulse™
- Vault™
- Cipher™

## Source files

- `flagships.json` contains the division-specific scripts, approved logo names, approved POLAR stances, headlines, and calls to action.
- `generate.mjs` generates one deterministic 1920 × 1080 HyperFrames project for each division.
- `.github/workflows/render-polar-flagship-explainers.yml` downloads the exact approved Drive assets, generates the approved original POLAR HyperFrames voice, lints, visually inspects, renders, hashes, and packages all nine review MP4s.

## Voice

The workflow uses the locked original POLAR HyperFrames voice profile:

```text
espeak-ng -v en-us+m3 -s 168 -p 76 -a 145
```

This is not HeyGen, a stock replacement, or a pitch-shifted substitute.

## Media policy

Only Drive IDs declared in `../polar-microvideos/approved-assets.json` may be downloaded. Each composition requires:

- its approved division logo
- one approved POLAR character stance
- approved `YA.wav`

Unknown, legacy, rejected, or stock assets are not accepted.

## Output

The workflow artifact is named:

```text
POLAR-Flagship-Explainers-Review
```

It contains nine MP4 files, `SHA256SUMS.txt`, and `FLAGSHIP-MANIFEST.json`.

These renders are review masters. Public release remains subject to founder approval of each final video.
