export class Player {
    id: string;
    paddle: { x: number; y: number; width: number; height: number };
    score: number;
    side: 'left' | 'right' | 'top' | 'bottom';
    direction: string;

    constructor(id: string, side: 'left' | 'right' | 'top' | 'bottom') {
        this.id = id;
        this.score = 0;
        this.side = side;
        this.paddle = { x: 0, y: 0, width: 10, height: 50 };
        this.direction = '';
    }

    setPaddlePosition(): void {

        const boardWidth = parseInt(process.env.BOARD_WIDTH);
        const boardHeight = parseInt(process.env.BOARD_HEIGHT);

        switch (this.side) {
            case 'left':
                this.paddle = {
                    x: 0,
                    y: (boardHeight / 2) - (this.paddle.height / 2),
                    width: 10,
                    height: 200
                };
                break;
            case 'right':
                this.paddle = {
                    x: this.paddle.x = boardWidth - this.paddle.width,
                    y: (boardHeight / 2) - (this.paddle.height / 2),
                    width: 10,
                    height: 200
                };
                break;
            case 'top':
                this.paddle = {
                    x: (boardWidth / 2) - (this.paddle.width / 2),
                    y: 0,
                    width: 200,
                    height: 10
                };
                break;
            case 'bottom':
                this.paddle = {
                    x: (boardWidth / 2) - (this.paddle.width / 2),
                    y: boardHeight - this.paddle.height,
                    width: 200,
                    height: 10
                };
                break;
        }
    }

    movePaddle(direction: string): void {
        const paddleSpeed = 10;

        if (this.side === 'left' || this.side === 'right') {
            if (direction === 'up' && this.paddle.y > 0) {
                this.paddle.y -= paddleSpeed;
            } else if (direction === 'down' && this.paddle.y + this.paddle.height < parseInt(process.env.BOARD_HEIGHT)) {
                this.paddle.y += paddleSpeed;
            }
        } else if (this.side === 'top' || this.side === 'bottom') {
            if (direction === 'left' && this.paddle.x > 0) {
                this.paddle.x -= paddleSpeed;
            } else if (direction === 'right' && this.paddle.x + this.paddle.width < parseInt(process.env.BOARD_WIDTH)) {
                this.paddle.x += paddleSpeed;
            }
        }
    }
}
