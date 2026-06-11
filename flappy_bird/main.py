import pygame
import sys

# Initialize Pygame
pygame.init()

# Set up the display
screen_width = 400
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption('Flappy Bird')

# Set up the clock
clock = pygame.time.Clock()

# Load assets
bird_image = pygame.image.load('assets/bird.png')
pipe_image = pygame.image.load('assets/pipe.png')

# Set up the bird
bird_rect = bird_image.get_rect()
bird_rect.center = (100, screen_height // 2)
bird_velocity = 0
gravity = 0.5

# Set up the pipes
pipe_width = 50
pipe_height = 300
pipe_gap = 150
pipe_velocity = 3
pipes = []

# Game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                bird_velocity = -10
    
    # Update bird position
    bird_velocity += gravity
    bird_rect.y += bird_velocity
    
    # Update pipe positions
    for pipe in pipes:
        pipe['rect'].x -= pipe_velocity
        if pipe['rect'].x < -pipe_width:
            pipes.remove(pipe)
    
    # Check for collisions
    if bird_rect.y > screen_height or bird_rect.y < 0:
        running = False
    for pipe in pipes:
        if bird_rect.colliderect(pipe['rect']):
            running = False
    
    # Draw everything
    screen.fill((0, 0, 0))
    screen.blit(bird_image, bird_rect)
    for pipe in pipes:
        screen.blit(pipe_image, pipe['rect'])
    
    # Cap the frame rate
    clock.tick(60)
    pygame.display.flip()