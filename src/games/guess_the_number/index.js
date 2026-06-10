const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function startGame() {
    const numberToGuess = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    console.log('Welcome to Guess the Number!');
    console.log('I've picked a number between 1 and 100. Can you guess it?');

    function askQuestion() {
        rl.question('Enter your guess: ', (answer) => {
            const guess = parseInt(answer);
            attempts++;

            if (isNaN(guess)) {
                console.log('Please enter a valid number.');
                askQuestion();
                return;
            }

            if (guess < 1 || guess > 100) {
                console.log('Please enter a number between 1 and 100.');
                askQuestion();
                return;
            }

            if (guess === numberToGuess) {
                console.log(`Congratulations! You guessed the number in ${attempts} attempts.`);
                rl.close();
            } else if (guess < numberToGuess) {
                console.log('Too low! Try again.');
                askQuestion();
            } else {
                console.log('Too high! Try again.');
                askQuestion();
            }
        });
    }

    askQuestion();
}

startGame();