const keyDisplay = document.getElementById('key-display');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const timeDisplay = document.getElementById('time');
const message = document.getElementById('message');
const startBtn = document.getElementById('start-btn');

// sounds
const soundCorrect = document.getElementById('sound-correct');
const soundWrong = document.getElementById('sound-wrong');
const soundFail = document.getElementById('sound-fail');
const soundGameOver = document.getElementById('sound-gameover');

let score = 0;
let lives = 3;
let currentKey = '';
let startTime = 0;
let timer;
let playing = false;

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// Pick a random key (A-Z)
function randomKey() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
}

function newRound() {
    if (!playing) return;
    currentKey = randomKey();
    keyDisplay.textContent = currentKey;
    startTime = performance.now();

    // Timer for auto fail
    clearTimeout(timer);
    timer = setTimeout(() => {
        playSound(soundFail);
        loseLife('Too slow!');
    }, 2000); // 2 seconds to react
}

function loseLife(reason) {
    lives--;
    livesDisplay.textContent = lives;
    message.textContent = reason;
    clearTimeout(timer);
    playSound(soundWrong);

    if (lives <= 0) {
        gameOver();
    } else {
        setTimeout(() => {
            message.textContent = '';
            newRound();
        }, 1000);
    }
}

function gameOver() {
    playing = false;
    keyDisplay.textContent = '💀';
    message.textContent = 'Game Over! Final Score: ' + score;
    playSound(soundGameOver);
    startBtn.style.display = 'inline-block';
}

// Handle key press
document.addEventListener('keydown', e => {
    if (!playing) return;
    const pressed = e.key.toUpperCase();
    const reactionTime = ((performance.now() - startTime) / 1000).toFixed(2);

    if (pressed === currentKey) {
        score++;
        scoreDisplay.textContent = score;
        timeDisplay.textContent = `${reactionTime}s`;
        message.textContent = 'Nice!';
        playSound(soundCorrect);
        clearTimeout(timer);
        setTimeout(() => {
            message.textContent = '';
            newRound();
        }, 500);
    } else {
        loseLife('Wrong key!');
    }
});

startBtn.addEventListener('click', () => {
    score = 0;
    lives = 3;
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    timeDisplay.textContent = '0.0s';
    message.textContent = '';
    startBtn.style.display = 'none';
    playing = true;
    newRound();
});