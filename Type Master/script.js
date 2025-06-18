const words = [
    "aberration", "acquiesce", "alacrity", "anathema", "antediluvian",
    "apocryphal", "approbation", "arbitrary", "ascetic", "assiduous",
    "bombastic", "capitulate", "circumlocution", "cogent", "conflagration",
    "conundrum", "deleterious", "demagogue", "diatribe", "disparate",
    "ebullient", "egregious", "enervate", "ephemeral", "esoteric",
    "exacerbate", "exculpate", "fastidious", "fatuous", "feckless",
    "grandiloquent", "hackneyed", "iconoclast", "impecunious", "inchoate",
    "ineffable", "intransigent", "inveterate", "juxtaposition", "laconic",
    "lugubrious", "mendacious", "nefarious", "obfuscate", "ostracize",
    "pellucid", "perspicacious", "recalcitrant", "sagacious", "vociferous"
];
let word, timer, inputword, globaltimer, txtscore, txthighScore, lshighScore, index, newWord, count, time, usedWords, score, pauseInterval, gamemaker;

function initialiser() {
    word = document.querySelector("#divwords");
    timer = document.querySelector("#timer");
    inputword = document.querySelector("#txtInput");
    globaltimer = document.querySelector('#divtimerGlobal');
    txtscore = document.querySelector('#divscore');
    txthighScore = document.querySelector('#divHighScore');
    index;
    newWord;
    count = 1;
    time = 3;
    usedWords = [];
    score = 0;
    pauseInterval = true;
    gameStart();
}

function loadHighScore() {
    console.log("loading");
    if (localStorage.getItem('highScore')) {
        lshighScore = localStorage.getItem('highScore');
        txthighScore.innerHTML = "Score: " + lshighScore.toString();
    }
    else {
        localStorage.setItem('highScore', 0);
    }
}

function wordmaker() {
    while (usedWords.includes(newWord)) {
        index = parseInt(Math.random() * 50);
        console.log(index);
        newWord = words[index];
    }
    usedWords.push(newWord);
    word.innerHTML = newWord;
}

function gameOver() {
    word.innerHTML = "Game Over!";
    clearInterval(gamemaker);
    if (score > lshighScore) {
        lshighScore = score;
        localStorage.setItem('highScore', lshighScore);
    }
}

function checkWord() {
    if (word.innerHTML == inputword.value) {
        inputword.value = "";
        time = 5;
        wordmaker();
        score++;
        txtscore.innerHTML = "Score: " + score.toString();
    }
}

function gameStart() {
    loadHighScore();
    wordmaker();
    gamemaker = setInterval(() => {
        timer.innerHTML = time;
        if (!pauseInterval) {
            if (time == 0) {
                pauseInterval = true;
                time = 4;
                inputword.value = "";
                checkWord()
            }
            else {
                globaltimer.innerHTML = "Time Left: " + (300 - count).toString() + "s";
            }
            if (time == 10) {
                gameOver();
            }
            count++;
        }
        else {
            word.innerHTML = "";
            if (time == 0) {
                time = 6;
                wordmaker();
                inputword.value = "";
                pauseInterval = false;
            }
        }

        if (count == 300) {
            gameOver();
        }
        time--;
    }, 1000);
}