# P.O.L.A.R. Media Approval Lock

## Status
Rejected greeting media is prohibited from runtime use.

## Runtime rule
`app/components/PolarConsole.tsx` must not reference `/media/polar/01_POLAR_Greeting.mp4` until the approved master is promoted and hash-verified.

## Approved source
- Master: `POLAR_INTRO_APPROVED_MASTER_v1.mp4`
- Approved master SHA-256: `67dd7e55a61c24e62cdbcf56714e2f776f1533e6a9778aab8828e8e5436a2a81`

## Temporary production behavior
P.O.L.A.R. uses the approved character image in the console while video playback is safety-locked.

## Promotion requirement
Before video playback is restored, the promoted web asset must be derived from the approved master, its checksum recorded here, and the production component must reference only that verified asset.
