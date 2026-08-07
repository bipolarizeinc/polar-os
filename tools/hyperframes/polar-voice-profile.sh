#!/usr/bin/env bash
set -euo pipefail

# Official original POLAR HyperFrames voice profile.
# Reproduces the voice used by the first GitHub/HyperFrames production.
# No HeyGen, no stock replacement, no pitch-shift workaround.

input_text="${1:?Usage: polar-voice-profile.sh <script.txt> <output.wav>}"
output_wav="${2:?Usage: polar-voice-profile.sh <script.txt> <output.wav>}"
raw_wav="${output_wav%.wav}.raw.wav"

espeak-ng -v en-us+m3 -s 168 -p 76 -a 145 -f "$input_text" -w "$raw_wav"

ffmpeg -y -i "$raw_wav" \
  -af "highpass=f=85,lowpass=f=9000,acompressor=threshold=-18dB:ratio=2.4:attack=18:release=180,loudnorm=I=-16:TP=-1.5:LRA=10" \
  -ar 48000 -ac 1 "$output_wav"

rm -f "$raw_wav"
