/* ============================================
   ERASED FROM HISTORY — CINEMATIC NARRATION
   Pre-generated ElevenLabs audio with
   word-level sync via timestamps
   ============================================ */

const Narration = (function () {
    'use strict';

    let isEnabled = true;
    let isSpeaking = false;
    let currentAudio = null;
    let syncInterval = null;
    let onWordCallback = null;
    let onEndCallback = null;
    let wordTimings = null;
    let currentSlideTimings = null;
    let lastWordIndex = 0;
    let isBeingDestroyed = false;  // true while stop() is cleaning up

    const CONFIG = {
        volume: 1.0,
        pauseAfterMs: 800,
        audioBasePath: 'narration/',
        syncIntervalMs: 50,
        safetyTimeoutMs: 120000, // 2-minute safety net per slide
    };

    let safetyTimer = null;

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        loadWordTimings();
    }

    function loadWordTimings() {
        fetch(CONFIG.audioBasePath + 'word_timings.json')
            .then(r => r.json())
            .then(data => {
                wordTimings = data;
                console.log('Narration: word timings loaded for', Object.keys(data).length, 'slides');
            })
            .catch(err => {
                console.warn('Narration: could not load word_timings.json —', err);
            });
    }

    // ============================================
    // SPEAKING (AUDIO PLAYBACK)
    // ============================================

    function speak(slideIndex, callbacks = {}) {
        if (!isEnabled) return;

        // Cancel any in-progress narration (with guard)
        stop();

        // Set new callbacks AFTER stop() so they can't be triggered by stop
        onWordCallback = callbacks.onWord || null;
        onEndCallback = callbacks.onEnd || null;

        const padded = String(slideIndex).padStart(2, '0');
        const audioSrc = CONFIG.audioBasePath + 'slide_' + padded + '.mp3';

        const audio = new Audio(audioSrc);
        audio.volume = CONFIG.volume;
        currentAudio = audio;

        // Set up word timing sync
        currentSlideTimings = wordTimings ? wordTimings[String(slideIndex)] : null;
        lastWordIndex = 0;

        // Helper: fire the onEnd callback exactly once
        function fireOnEnd(reason) {
            clearSafetyTimer();
            if (onEndCallback) {
                const cb = onEndCallback;
                onEndCallback = null; // Prevent double-fire
                if (reason !== 'ended') {
                    console.warn('Narration: advancing via fallback —', reason, '— slide', slideIndex);
                }
                setTimeout(cb, CONFIG.pauseAfterMs);
            }
        }

        // Audio finished playing normally
        audio.addEventListener('ended', function () {
            if (currentAudio !== audio) return;
            // Normal completion
            isSpeaking = false;
            stopSync();
            if (onWordCallback) {
                flushRemainingWords();
            }
            fireOnEnd('ended');
        });

        // Audio failed to load or decode
        audio.addEventListener('error', function (e) {
            if (currentAudio !== audio) return;
            if (isBeingDestroyed) return;  // ignore errors triggered by stop() cleanup
            console.warn('Narration: audio error for slide', slideIndex, e);
            isSpeaking = false;
            stopSync();
            if (onWordCallback) {
                flushRemainingWords();
            }
            // Still advance on error so the presentation doesn't stall
            fireOnEnd('error');
        });

        // Play immediately
        isSpeaking = true;

        // Safety timeout: if nothing fires ended/error within 2 minutes, force advance
        clearSafetyTimer();
        safetyTimer = setTimeout(function () {
            if (currentAudio === audio && isSpeaking) {
                console.warn('Narration: safety timeout hit for slide', slideIndex);
                isSpeaking = false;
                stopSync();
                if (onWordCallback) {
                    flushRemainingWords();
                }
                fireOnEnd('safety-timeout');
            }
        }, CONFIG.safetyTimeoutMs);

        audio.play().then(() => {
            if (currentAudio !== audio) return;
            // Audio loaded and playing
            startSync();
        }).catch(err => {
            console.warn('Narration: play failed for slide', slideIndex, '—', err);
            if (currentAudio !== audio) return;
            isSpeaking = false;
            if (onWordCallback) {
                flushRemainingWords();
            }
            // Still advance on play failure
            fireOnEnd('play-failed');
        });
    }

    // ============================================
    // WORD SYNC ENGINE
    // ============================================

    function startSync() {
        stopSync();

        if (!currentSlideTimings || !onWordCallback) {
            flushRemainingWords();
            return;
        }

        syncInterval = setInterval(() => {
            if (!currentAudio || currentAudio.paused) return;

            const currentTime = currentAudio.currentTime;

            while (lastWordIndex < currentSlideTimings.length) {
                const wordData = currentSlideTimings[lastWordIndex];
                if (currentTime >= wordData.start) {
                    if (onWordCallback) onWordCallback(lastWordIndex, 1);
                    lastWordIndex++;
                } else {
                    break;
                }
            }
        }, CONFIG.syncIntervalMs);
    }

    function stopSync() {
        if (syncInterval) {
            clearInterval(syncInterval);
            syncInterval = null;
        }
    }

    function clearSafetyTimer() {
        if (safetyTimer) {
            clearTimeout(safetyTimer);
            safetyTimer = null;
        }
    }

    function flushRemainingWords() {
        if (!onWordCallback) return;
        // Flush based on DOM word count, not timestamp count
        // Just fire many times — WordReveal.revealNextWord handles bounds
        for (let i = 0; i < 500; i++) {
            onWordCallback(i, 1);
        }
    }

    // ============================================
    // CONTROLS
    // ============================================

    function stop() {
        // Clear callbacks FIRST to prevent any events from firing them
        onWordCallback = null;
        onEndCallback = null;

        stopSync();
        clearSafetyTimer();

        if (currentAudio) {
            isBeingDestroyed = true;  // block error events during cleanup
            try {
                currentAudio.pause();
                // Release the network connection — browsers limit concurrent
                // media connections (~6 in Chrome). Without this, old Audio
                // objects hold their connections open until GC, causing new
                // Audio elements to stall after several slides.
                currentAudio.removeAttribute('src');
                currentAudio.load();
            } catch (e) {}
            currentAudio = null;
            isBeingDestroyed = false;
        }

        isSpeaking = false;
        currentSlideTimings = null;
        lastWordIndex = 0;
    }

    function pause() {
        if (currentAudio && isSpeaking) {
            currentAudio.pause();
            stopSync();
        }
    }

    function resume() {
        if (currentAudio && isSpeaking && currentAudio.paused) {
            currentAudio.play().then(() => {
                startSync();
            }).catch(() => {});
        }
    }

    function toggle() {
        isEnabled = !isEnabled;
        if (!isEnabled) stop();
        return isEnabled;
    }

    function getIsEnabled() {
        return isEnabled;
    }

    function getIsSpeaking() {
        return isSpeaking;
    }

    function getNarrationWordCount() {
        return currentSlideTimings ? currentSlideTimings.length : 0;
    }

    return {
        init,
        speak,
        stop,
        pause,
        resume,
        toggle,
        getIsEnabled,
        getIsSpeaking,
        getNarrationWordCount,
        CONFIG,
    };
})();
