let words;
let word, timer, inputword, globaltimer, txtscore, txthighScore, lshighScore, index, newWord, count, time, usedWords, score, pauseInterval, gamemaker, bonusscore, allWords, timePerWord, getReadyTime;
let flag = 0;
function initialiser() {
    allWords = {
        easy: [
            "cat", "dog", "sun", "run", "big", "red", "sky", "fly", "eat", "cup",
            "hat", "pen", "map", "joy", "fun", "leg", "arm", "box", "key", "ice"
        ],
        medium: [
            "adventure", "beautiful", "challenge", "discovery", "education",
            "freedom", "generous", "happiness", "imagine", "journey",
            "knowledge", "laughter", "mystery", "navigate", "opportunity",
            "passion", "quality", "resource", "strength", "treasure",
            "understanding", "vibrant", "wisdom", "xylophone", "yearning",
            "zephyr", "brilliant", "creative", "dedicated", "enthusiastic",
            "fantastic", "grateful", "harmonious", "innovative", "joyful",
            "kindness", "limitless", "magnificent", "optimistic", "peaceful",
            "resilient", "sincere", "tranquil", "unique", "valiant",
            "wonderful", "excitement", "curiosity", "patience", "respect"
        ],
        hard: [
            "juxtaposition", "onomatopoeia", "quintessential", "ubiquitous", "vicarious",
            "idiosyncrasy", "ephemeral", "magnanimous", "serendipity", "cacophony",
            "effervescent", "labyrinthine", "mellifluous", "perspicacious", "surreptitious"
        ]
    };
    word = document.querySelector("#divwords");
    timer = document.querySelector("#timer");
    inputword = document.querySelector("#txtInput");
    globaltimer = document.querySelector('#divtimerGlobal');
    txtscore = document.querySelector('#divscore');
    txthighScore = document.querySelector('#divHighScore');
    startbutton = document.querySelector('#divButton')
    index;
    newWord = '';
    count = 1;
    time = 3;
    usedWords = [];
    score = 0;
    pauseInterval = true;
    bonusscore = 0;
    let difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    switch (difficulty) {
        case 'easy':
            words = allWords.easy // Use a copy
            timePerWord = 7,
                getReadyTime = 3,
                totalGameTime = 60 // seconds
            break;
        case 'hard':
            words = allWords.hard,
                timePerWord = 4,
                getReadyTime = 2,
                totalGameTime = 60
            break;
        case 'medium':
        default:
            words = allWords.medium;
            timePerWord = 5; // Adjusted from original complex logic
            getReadyTime = 3;
            totalGameTime = 60;
            break;
    }
    gameStart();
}

function bonusmaker() {
    console.log(bonusscore)
    if (bonusscore == 3) {
        count -= 1;
    }
    if (bonusscore == 5) {
        count -= 2;
    }
    if (bonusscore == 10) {
        count -= 3;
    }
}

function loadHighScore() {
    console.log("loading");
    if (localStorage.getItem('highScore')) {
        lshighScore = localStorage.getItem('highScore');
        txthighScore.innerHTML = "High Score: " + lshighScore.toString();
    }
    else {
        localStorage.setItem('highScore', 0);
    }
}
loadHighScore();

function wordmaker() {
    if (words.length != 0) {
        index = parseInt(Math.random() * words.length);
        newWord = words[index];
        usedWords.push(newWord);
        words.splice(index, 1)
        word.innerHTML = newWord;
    }
    else {
        gameOver();
    }

}

function gameOver() {
    word.innerHTML = "Game Over!";
    clearInterval(gamemaker);
    if (score > lshighScore) {
        lshighScore = score;
        localStorage.setItem('highScore', lshighScore);
    }
    startbutton.disabled = false;
}

function checkWord() {
    if (word.innerHTML == inputword.value && inputword.value != "") {
        inputword.value = "";
        time = timePerWord;
        wordmaker();
        bonusscore++;
        score++;
        inputword.classList.remove('bg-gray-800')
        inputword.classList.add('bg-emerald-300')
        setTimeout(() => {
            inputword.classList.add('bg-gray-800')
            inputword.classList.remove('bg-emerald-300')
        }, 75);
        txtscore.innerHTML = "Score: " + score.toString();
        bonusmaker();
    }
}

function gameStart() {
    loadHighScore();
    startbutton.disabled = true;
    gamemaker = setInterval(() => {
        console.log(time)
        timer.innerHTML = time;
        if (!pauseInterval) {
            if (time == 0) {
                pauseInterval = true;
                time = getReadyTime;
                inputword.value = "";
                bonusscore = 0;
                checkWord()
            }
            else {
                globaltimer.innerHTML = "Time Left: " + (60 - count).toString() + "s";
            }
            count++;
            if (count == 60) {
                gameOver();
            }
        }
        else {
            word.innerHTML = "";
            if (time == 0) {
                time = timePerWord;
                wordmaker();
                inputword.value = "";
                pauseInterval = false;
            }
        }

        if (count == 60) {
            gameOver();
        }
        if (count >= 50) {
            globaltimer.classList.remove('text-white');
            globaltimer.classList.add('text-red-500', 'font-bold')
        }
        time--;
    }, 1000);
}