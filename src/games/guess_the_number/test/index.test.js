const { startGame } = require('../index');

describe('Guess the Number Game', () => {
    it('should correctly identify a correct guess', () => {
        // Mocking readline to simulate user input
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const mockInputs = ['50'];
        let inputIndex = 0;

        rl._read = () => {
            const nextInput = mockInputs[inputIndex++];
            rl.emit('line', nextInput);
        };

        startGame();
    });
});