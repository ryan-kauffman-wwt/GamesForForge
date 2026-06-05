from.game import TicTacToe

def print_board(board):
    for row in board:
        print('|'.join(row))
        print('-' * 5)

def main():
    game = TicTacToe()
    while True:
        print_board(game.board)
        row = int(input('Enter row (0, 1, 2): '))
        col = int(input('Enter column (0, 1, 2): '))
        if game.make_move(row, col):
            winner = game.check_winner()
            if winner:
                print_board(game.board)
                if winner == 'Draw':
                    print('It\'s a draw!')
                else:
                    print(f'Player {winner} wins!')
                break
        else:
            print('Invalid move, try again.')

if __name__ == '__main__':
    main()