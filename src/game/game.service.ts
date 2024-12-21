import { Injectable } from '@nestjs/common';
import { Player } from './models/player.model';

@Injectable()
export class GameService {
    players: Map<string, Player> = new Map();
    ball: { x: number; y: number; dx: number; dy: number } = { x: 300, y: 300, dx: 2, dy: 2 }; // Ball speed
    gameStarted: boolean = false;

    addPlayer(clientId: string): Player | null {
        const sides: ('left' | 'right' | 'top' | 'bottom')[] = ['left', 'right', 'top', 'bottom'];
        const occupiedSides = Array.from(this.players.values()).map(player => player.side);
        const availableSides = sides.filter(side => !occupiedSides.includes(side));

        if (availableSides.length === 0) return null; // No room for a new player

        const newSide = availableSides[0];
        const newPlayer = new Player(clientId, newSide);
        newPlayer.setPaddlePosition();
        this.players.set(clientId, newPlayer);

        // Check if the game should start
        if (this.players.size >= 2 && !this.gameStarted) {
            this.startGame();
        }

        return newPlayer;
    }

    removePlayer(clientId: string): void {
        this.players.delete(clientId);

        // Stop the game if there are less than 2 players
        if (this.players.size < 2) {
            this.stopGame();
        }
    }

    startGame(): void {
        this.gameStarted = true;
        console.log('Game started!');
    }

    stopGame(): void {
        this.gameStarted = false;
        console.log('Game stopped!');
    }

    restartGame(): void {

        this.ball = {
            x: parseInt(process.env.BOARD_WIDTH) / 2,
            y: parseInt(process.env.BOARD_HEIGHT) / 2,
            dx: 2,
            dy: 2
        };

        this.players.forEach(player => player.setPaddlePosition());

        console.log('Game restarting...');
    }

    updateGame(): void {
        if (!this.gameStarted) return;

        // Add randomness to the ball's direction and speed
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Ball collision with walls (introduce randomness to direction)
        if (this.ball.y <= 0 || this.ball.y >= parseInt(process.env.BOARD_HEIGHT)) {
            // Reverse the vertical direction and add a small random variation to the speed
            this.ball.dy = -this.ball.dy + (Math.random() * 0.5 - 0.25); // Randomize within -0.25 to 0.25
        }

        // Ball collision with left or right side (restart the game with 5 second delay)
        if (this.ball.x <= 0 || this.ball.x >= parseInt(process.env.BOARD_WIDTH)) {
            // Stop the game and restart after 5 seconds
            this.stopGame();
            setTimeout(() => {
                this.restartGame();
                this.startGame(); // Start the game again after reset
            }, 5000); // 5 seconds delay
        }

        // Ball collision with paddles (bounce instead of restart)
        for (const player of this.players.values()) {
            const paddle = player.paddle;
            if (
                this.ball.x >= paddle.x &&
                this.ball.x <= paddle.x + paddle.width &&
                this.ball.y >= paddle.y &&
                this.ball.y <= paddle.y + paddle.height
            ) {
                // Reverse direction and add some randomness to both dx and dy for variability
                this.ball.dx = -this.ball.dx + (Math.random() * 0.5 - 0.25); // Randomize within -0.25 to 0.25
                this.ball.dy = this.ball.dy + (Math.random() * 0.5 - 0.25); // Randomize within -0.25 to 0.25
            }
        }
    }


    getGameState(): { players: Player[]; ball: { x: number; y: number }; gameStarted: boolean } {
        return {
            players: Array.from(this.players.values()),
            ball: { x: this.ball.x, y: this.ball.y },
            gameStarted: this.gameStarted,
        };
    }

    getRandomBallPosition(): { x: number; y: number; dx: number; dy: number; speed: number } {
        const middleX = parseInt(process.env.BOARD_WIDTH) / 2;
        const middleY = parseInt(process.env.BOARD_HEIGHT) / 2;
        const randomX = middleX + (Math.random() - 0.5) * 100; // Random position within 100px of center
        const randomY = middleY + (Math.random() - 0.5) * 100; // Random position within 100px of center

        // Randomize ball's direction and speed
        const randomDx = Math.random() > 0.5 ? 2 : -2; // Random horizontal speed
        const randomDy = Math.random() > 0.5 ? 2 : -2; // Random vertical speed
        const speed = Math.random() * 1.5 + 1; // Random speed between 1 and 2.5

        return {
            x: randomX,
            y: randomY,
            dx: randomDx * speed,
            dy: randomDy * speed,
            speed: speed
        };
    }
}
