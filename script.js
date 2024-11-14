let timerState = 'idle';
let timeRemaining = 0;
let interval;
let boilTime = 60;

const mashPrompts = [
    { time: 119, message: "PH Test" },
    { time: 75, message: "Recirc" },
    { time: 60, message: "Start sparge, loiter and first sample" },
    { time: 40, message: "Second sample, turn elements on" },
    { time: 20, message: "Third Sample" },
    { time: 0, message: "Final Sample" }
];

const boilPrompts60 = [
    { time: 30, message: "Bittering hops addition" },
    { time: 20, message: "Whirlpool" },
    { time: 15, message: "Flavour" },
    { time: 0, message: "Flame out" }
];

const boilPrompts90 = [
    { time: 60, message: "Bittering hops addition" },
    { time: 30, message: "Second Bittering hops addition" },
    { time: 20, message: "Whirlpool" },
    { time: 15, message: "Flavour" },
    { time: 0, message: "Flame out" }
];

document.addEventListener('DOMContentLoaded', () => {
    const startMashButton = document.getElementById('startMashButton');
    const startBoilButton = document.getElementById('startBoilButton');
    const timerDisplay = document.getElementById('time');
    const timerStateDisplay = document.getElementById('timerState');
    const promptDisplay = document.getElementById('promptDisplay');
    const boilTimeRadios = document.getElementsByName('boilTime');

    boilTimeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            boilTime = parseInt(e.target.value);
        });
    });

    startMashButton.addEventListener('click', () => {
        timerState = 'mashing';
        timeRemaining = 120 * 60; // 2 hours in seconds
        startTimer();
        startMashButton.style.display = 'none';
        timerStateDisplay.textContent = 'Mashing';
    });

    startBoilButton.addEventListener('click', () => {
        timerState = 'boiling';
        timeRemaining = boilTime * 60; // 60 or 90 minutes in seconds
        startTimer();
        startBoilButton.style.display = 'none';
        timerStateDisplay.textContent = 'Boiling';
    });

    function startTimer() {
        clearInterval(interval);
        interval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateDisplay();
                checkPrompts();
            } else {
                clearInterval(interval);
                if (timerState === 'mashing') {
                    startBoilButton.style.display = 'inline-block';
                } else {
                    timerStateDisplay.textContent = 'Finished';
                }
            }
        }, 1000);
    }

    function updateDisplay() {
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function checkPrompts() {
        const prompts = timerState === 'mashing' ? mashPrompts : (boilTime === 60 ? boilPrompts60 : boilPrompts90);
        const currentPrompt = prompts.find(prompt => prompt.time === Math.floor(timeRemaining / 60));
        if (currentPrompt) {
            promptDisplay.textContent = currentPrompt.message;
            promptDisplay.classList.add('show');
            playBeep();
        } else {
            promptDisplay.classList.remove('show');
        }
    }

    function playBeep() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 2);
    }
});
