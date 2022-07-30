# Imports
import pygame
import random

# Import pygame.locals for easier access to key coordinates
# Updated to conform to flake8 and black standards
from pygame.locals import (
    MOUSEBUTTONDOWN,
    K_ESCAPE,
    KEYDOWN,
    QUIT,
)

# Define constants
SCREEN_WIDTH = 1800
SCREEN_HEIGHT = 900
TARGET_WIDTH = 50
TARGET_HEIGHT = 50
TARGET_COLOR = (0, 255, 0)
BACKGROUND_COLOR = (10, 10, 20)

# Define a target object
class Target(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.surf = pygame.Surface((TARGET_WIDTH, TARGET_HEIGHT))
        self.surf.fill(TARGET_COLOR)
        self.rect = self.get_spawn_location()

    def get_spawn_location(self):
        return self.surf.get_rect(
            center=(
                random.randint(TARGET_WIDTH/2, SCREEN_WIDTH-TARGET_WIDTH),
                random.randint(TARGET_HEIGHT/2, SCREEN_HEIGHT-TARGET_HEIGHT),
            )
        )

# Initialize pygame
pygame.init()

# Create the screen object
# The size is determined by the constant SCREEN_WIDTH and SCREEN_HEIGHT
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))

ADDENEMY = pygame.USEREVENT + 1
pygame.time.set_timer(ADDENEMY, 500)

target = Target()
targets = pygame.sprite.Group()
targets.add(target)

# Variable to keep the main loop running
running = True

# Main loop
while running:
    # for loop through the event queue
    for event in pygame.event.get():
        # Check for KEYDOWN event
        if event.type == KEYDOWN:
            # If the Esc key is pressed, then exit the main loop
            if event.key == K_ESCAPE:
                running = False
        # Check for QUIT event. If QUIT, then set running to false.
        elif event.type == QUIT:
            running = False

        elif event.type == ADDENEMY:
            # Create the new enemy and add it to sprite groups
            new_target = Target()
            targets.add(new_target)

        elif event.type == pygame.MOUSEBUTTONUP:
            pos = pygame.mouse.get_pos()

            clicked_sprites = [s for s in targets if s.rect.collidepoint(pos)]

            for s in clicked_sprites:
                s.kill()

    
    
    # Background color
    screen.fill(BACKGROUND_COLOR)

    # Draw all sprites
    for entity in targets:
        screen.blit(entity.surf, entity.rect)

    # Update the display
    pygame.display.flip()