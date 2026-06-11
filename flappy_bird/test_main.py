import unittest
from main import Bird, Pipe

class TestFlappyBird(unittest.TestCase):
    def test_bird_movement(self):
        bird = Bird(100, 100)
        bird.move()
        self.assertNotEqual(bird.y, 100)

    def test_pipe_generation(self):
        pipe = Pipe(300)
        self.assertEqual(pipe.x, 300)

if __name__ == '__main__':
    unittest.main()