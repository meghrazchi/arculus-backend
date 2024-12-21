import { GameService } from './game.service';
import { Player } from './models/player.model';

jest.mock('./models/player.model'); // Mock the Player class

describe('GameService', () => {
    let service: GameService;

    beforeEach(() => {
        service = new GameService();
        // Clear the mock calls before each test
        (Player as jest.Mock).mockClear();
        // Mock environment variables for ball position calculations
        process.env.BOARD_WIDTH = '600';
        process.env.BOARD_HEIGHT = '400';
    });

    describe('addPlayer', () => {
        it('should add a new player and assign a side', () => {
            const clientId = 'player1';

            // Mock the Player constructor to return a player with a side property
            const mockPlayerInstance = { side: 'left', setPaddlePosition: jest.fn() };
            (Player as jest.Mock).mockImplementationOnce(() => mockPlayerInstance);

            const player = service.addPlayer(clientId);

            expect(player).not.toBeNull();
            expect(player?.side).toBe('left');
            expect(service.players.size).toBe(1);
        });

        it('should start the game when there are 2 players', () => {
            const clientId1 = 'player1';
            const clientId2 = 'player2';
            service.addPlayer(clientId1);
            service.addPlayer(clientId2);

            expect(service.gameStarted).toBeTruthy();
        });
    });

    describe('removePlayer', () => {
        it('should remove a player and stop the game if there are less than 2 players', () => {
            const clientId1 = 'player1';
            const clientId2 = 'player2';
            service.addPlayer(clientId1);
            service.addPlayer(clientId2);

            service.removePlayer(clientId1);
            expect(service.players.size).toBe(1);

            // When one player is left, the game should stop
            expect(service.gameStarted).toBeFalsy();
        });

        it('should stop the game if there is no player', () => {
            const clientId1 = 'player1';
            const clientId2 = 'player2';
            service.addPlayer(clientId1);
            service.addPlayer(clientId2);

            service.removePlayer(clientId1);
            service.removePlayer(clientId2);
            expect(service.gameStarted).toBeFalsy();
        });
    });

    describe('updateGame', () => {
        it('should not update game if the game has not started', () => {
            const initialBallPosition = { ...service.ball };

            service.updateGame();

            expect(service.ball).toEqual(initialBallPosition);
        });

        it('should update the ball position if the game has started', () => {
            service.gameStarted = true;
            const initialBallPosition = { ...service.ball };

            service.updateGame();

            expect(service.ball).not.toEqual(initialBallPosition);
        });
    });

    describe('restartGame', () => {
        it('should reset the ball position and restart the game', () => {
            service.restartGame();

            expect(service.ball.x).toBeGreaterThan(0);
            expect(service.ball.y).toBeGreaterThan(0);
        });
    });

    describe('getGameState', () => {
        it('should return the correct game state', () => {
            const clientId1 = 'player1';
            const clientId2 = 'player2';
            service.addPlayer(clientId1);
            service.addPlayer(clientId2);

            const gameState = service.getGameState();

            expect(gameState.players.length).toBe(2);
            expect(gameState.gameStarted).toBeTruthy();
        });
    });

    describe('getRandomBallPosition', () => {
        it('should return a random ball position', () => {
            const ball = service.getRandomBallPosition();

            expect(ball.x).toBeGreaterThan(0);
            expect(ball.y).toBeGreaterThan(0);
            expect(ball.dx).toBeGreaterThan(0);
            expect(ball.dy).toBeGreaterThan(0);
        });
    });
});
