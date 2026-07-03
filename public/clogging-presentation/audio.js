/* ============================================
   CRE FORENSIC TOOL — AUDIO ENGINE v5
   CRITICAL RULE: audio.pause() is NEVER called.
   Suspension = volume lowered to 0.02, not paused.
   This eliminates all autoplay-restriction issues.
   ============================================ */

const AmbientAudio = (function () {
    'use strict';

    let audio         = null;
    let animId        = null;
    let isInitialized = false;
    let isMuted       = false;
    let isDucked      = false;
    let targetVol     = 0.4;

    const MUSIC_SRC   = 'music/background.mp3';
    const NORMAL_VOL  = 0.40;
    const DUCK_VOL    = 0.12;   // for ElevenLabs narration
    const SYNTH_VOL   = 0.22;   // for browser TTS (clearer, less ducking)
    const SUSPEND_VOL = 0.02;   // "paused" = very quiet, NOT stopped

    // ── Smooth volume loop ────────────────────────────────
    function smoothTick() {
        if (!audio) return;
        const diff = targetVol - audio.volume;
        audio.volume = Math.abs(diff) < 0.002
            ? (targetVol)
            : (audio.volume + diff * 0.06);
        animId = requestAnimationFrame(smoothTick);
    }

    function startSmooth() {
        if (!animId) animId = requestAnimationFrame(smoothTick);
    }

    // ── Public API ─────────────────────────────────────────
    function init() {
        if (isInitialized) return;
        audio         = new Audio(MUSIC_SRC);
        audio.loop    = true;
        audio.volume  = 0;
        audio.preload = 'auto';
        isInitialized = true;
        targetVol     = NORMAL_VOL;

        audio.play()
             .then(() => startSmooth())
             .catch(err => console.warn('[Music] autoplay blocked:', err));
    }

    // Slide-based volume by act (only when not ducked/muted)
    function setSlide(slideIndex) {
        if (isMuted || isDucked) return;
        if      (slideIndex >= 8  && slideIndex <= 14) targetVol = 0.22;
        else if (slideIndex >= 15 && slideIndex <= 20) targetVol = 0.18;
        else if (slideIndex >= 21)                     targetVol = 0.50;
        else                                           targetVol = NORMAL_VOL;
    }

    // Duck for ElevenLabs narration (deeper duck)
    function duckForNarration(duck) {
        if (isMuted) return;
        if (duck) {
            isDucked  = true;
            targetVol = DUCK_VOL;
            startSmooth();
        } else {
            isDucked  = false;
            targetVol = NORMAL_VOL;
            startSmooth();
        }
    }

    // Lighter duck for browser TTS
    function duckForSynth(duck) {
        if (isMuted) return;
        if (duck) {
            isDucked  = true;
            targetVol = SYNTH_VOL;
        } else {
            isDucked  = false;
            targetVol = NORMAL_VOL;
        }
        startSmooth();
    }

    // Called on every timed/synth slide — guarantees audible music
    function ensureAudible() {
        if (isMuted) return;
        isDucked  = false;
        targetVol = NORMAL_VOL;
        // If somehow audio got paused (browser policy), restart it
        if (audio && audio.paused) {
            audio.play().catch(() => {});
        }
        startSmooth();
    }

    // "Suspend" = lower to near-silence. NEVER pause the element.
    function suspend() {
        targetVol = SUSPEND_VOL;
    }

    // Resume from suspension
    function resume() {
        if (isMuted) return;
        isDucked  = false;
        targetVol = NORMAL_VOL;
        if (audio && audio.paused) audio.play().catch(() => {});
        startSmooth();
    }

    function mute() {
        isMuted   = true;
        targetVol = 0;
    }

    function unmute() {
        isMuted   = false;
        targetVol = NORMAL_VOL;
        if (audio && audio.paused) audio.play().catch(() => {});
        startSmooth();
    }

    function toggleMute() {
        if (isMuted) unmute(); else mute();
        return isMuted;
    }

    function getIsMuted() { return isMuted; }

    return {
        init, setSlide,
        duckForNarration, duckForSynth, ensureAudible,
        suspend, resume,
        mute, unmute, toggleMute, getIsMuted
    };
})();
