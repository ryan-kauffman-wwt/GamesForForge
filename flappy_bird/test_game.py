import pytest
from main import Bird, Pipe, Game


def test_bird_gravity():
    bird = Bird(100, 100)
    bird.update()
    assert bird.y > 100


def test_bird_jump():
    bird = Bird(100, 100)
    bird.jump()
    assert bird.y < 100


def test_pipe_movement():
    pipe = Pipe(300)
    pipe.update()
    assert pipe.x < 300


def test_collision_detection():
    bird = Bird(100, 100)
    pipe = Pipe(300)
    game = Game()
    game.birds.append(bird)
    game.pipes.append(pipe)
    game.check_collisions()
    assert bird in game.birds


def test_score_tracking():
    game = Game()
    game.score += 1
    assert game.score == 1


def test_game_state_transitions():
    game = Game()
    game.start()
    assert game.state == 'playing'
    game.game_over()
    assert game.state == 'game_over'