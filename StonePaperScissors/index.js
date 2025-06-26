const opt = ['r', 'p', 's'];
let usrscore=0;
let compscore=0;

function maker() {
    let ind = parseInt(Math.random() * 3);
    return opt[ind];
}

function check(given) {
    const comp = maker();
    // let compchooses = document.querySelector('#'+comp);
    // compchooses.classList.add('bg-red-950');
    // setTimeout(()=> {
    //     compchooses.classList.remove('bg-red-950');
    // }, 300);
    // console.log(`You chose: ${given}`);
    // console.log(`Computer chose: ${comp}`);

    let body = document.querySelector('#body')

    if (given === comp) {
        console.log("It's a draw!");
        document.body.classList.add('bg-gray-950');
        document.body.classList.remove('bg-black');
        setTimeout(()=> {
            document.body.classList.remove('bg-gray-950');
            document.body.classList.add('bg-black');
        }, 300);
    } else if (
        (given === 'r' && comp === 's') ||
        (given === 'p' && comp === 'r') ||
        (given === 's' && comp === 'p')
    ) {
        console.log("You win!");
        usrscore++;
        document.body.classList.add('bg-green-950');
        document.body.classList.remove('bg-black');
        setTimeout(()=> {
            document.body.classList.remove('bg-green-950');
            document.body.classList.add('bg-black');
        }, 300);
    } else {
        console.log("You lose!");
        compscore++;
        document.body.classList.add('bg-red-950');
        document.body.classList.remove('bg-black');
        setTimeout(()=> {
            document.body.classList.remove('bg-red-950');
            document.body.classList.add('bg-black');
        }, 300);
    }
    document.querySelector('#divscore').innerHTML = `Score: ${usrscore}-${compscore}`
    if (compscore == usrscore)
        document.querySelector('#winner').innerHTML = "TIE"
    else if (compscore > usrscore) 
        document.querySelector('#winner').innerHTML = "COMPUTER WINNING"
    else
        document.querySelector('#winner').innerHTML = "USER WINNING"
}