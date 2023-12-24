export class MovablePosition implements Position {
    x: number;
    y: number;

    private initialPosition: Position;

    get position(): Position {
        return { x: this.x, y: this.y };
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.initialPosition = { x, y };
    }

    moveTo(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    resetPosition() {
        this.x = this.initialPosition.x;
        this.y = this.initialPosition.y;
    }
}