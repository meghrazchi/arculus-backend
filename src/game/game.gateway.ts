import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayInit, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly gameService: GameService) { }

    afterInit() {
        console.log('WebSocket server initialized');
        setInterval(() => {
            this.gameService.updateGame();
            this.broadcastGameState();
        }, 1000 / 60); // Game loop at 60 FPS
    }

    handleDisconnect(client: Socket): void {
        this.gameService.removePlayer(client.id);
        this.broadcastGameState();
    }

    @SubscribeMessage('join')
    handleJoin(client: Socket, playerId: string): void {
        const player = this.gameService.addPlayer(client.id);
        if (player) {
            client.emit('joined', { playerId, side: player.side });
            console.log(`player joined id=${playerId}`);
            this.broadcastGameState();
        } else {
            client.emit('message', 'Game is full');
            client.disconnect();
        }
    }

    @SubscribeMessage('movePaddle')
    handleMovePaddle(client: Socket, { direction }: { direction: string }): void {
        const player = this.gameService.players.get(client.id);
        if (player) {
            player.movePaddle(direction);
            this.broadcastGameState();
        }
    }

    broadcastGameState() {
        this.server.emit('gameState', this.gameService.getGameState());
    }
}
