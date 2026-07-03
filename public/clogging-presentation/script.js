(function () {
    'use strict';

    let current = 0;
    const slides = document.querySelectorAll('.slide');
    const counter = document.getElementById('slide-counter');
    let timer = null;
    let isPlaying = false;
    let synth = window.speechSynthesis;
    let utterance = null;

    function init() {
        document.getElementById('btn-start').addEventListener('click', () => {
            document.getElementById('start-overlay').style.display = 'none';
            document.getElementById('global-logo').style.display = 'block';
            isPlaying = true;
            playSlide(0);
        });

        document.getElementById('btn-play-pause').addEventListener('click', togglePlay);
        document.getElementById('btn-next').addEventListener('click', () => {
            if(current < slides.length - 1) playSlide(current + 1);
        });
        document.getElementById('btn-prev').addEventListener('click', () => {
            if(current > 0) playSlide(current - 1);
        });
    }

    function togglePlay() {
        isPlaying = !isPlaying;
        if(isPlaying) {
            document.getElementById('icon-play').style.display = 'none';
            document.getElementById('icon-pause').style.display = 'block';
            playSlide(current);
        } else {
            document.getElementById('icon-play').style.display = 'block';
            document.getElementById('icon-pause').style.display = 'none';
            if(synth) synth.cancel();
            if(timer) clearTimeout(timer);
        }
    }

    function playSlide(index) {
        if(timer) clearTimeout(timer);
        if(synth) synth.cancel();

        slides.forEach(s => s.classList.remove('active'));
        if(index >= slides.length) {
            isPlaying = false;
            document.getElementById('icon-play').style.display = 'block';
            document.getElementById('icon-pause').style.display = 'none';
            return;
        }
        
        slides[index].classList.add('active');
        counter.innerText = `${index + 1} / ${slides.length}`;
        current = index;

        if(!isPlaying) return;

        document.getElementById('icon-play').style.display = 'none';
        document.getElementById('icon-pause').style.display = 'block';

        const textElement = slides[index].querySelector('.slide-text');
        const text = textElement ? textElement.innerText : slides[index].innerText;
        
        // Calculate fallback time based on word count
        const wordCount = text.split(' ').length;
        const fallbackTimeMs = Math.max(5000, wordCount * 300);

        if (synth && text.trim().length > 0) {
            utterance = new SpeechSynthesisUtterance(text);
            const voices = synth.getVoices();
            const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha'));
            if(preferred) utterance.voice = preferred;
            
            utterance.rate = 0.9;
            utterance.pitch = 1.0;

            let safetyTimer = setTimeout(() => {
                if(synth.speaking) synth.cancel();
                playSlide(current + 1);
            }, fallbackTimeMs + 5000);

            utterance.onend = () => {
                clearTimeout(safetyTimer);
                playSlide(current + 1);
            };
            
            utterance.onerror = () => {
                clearTimeout(safetyTimer);
                timer = setTimeout(() => playSlide(current + 1), 3000);
            };

            synth.speak(utterance);
        } else {
            // Fallback if no speech synthesis
            timer = setTimeout(() => {
                playSlide(current + 1);
            }, fallbackTimeMs);
        }
    }

    // Wait for voices to load
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {};
    }

    init();
})();
