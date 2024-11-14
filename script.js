// ... (previous code remains the same)

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

// ... (rest of the code remains the same)
