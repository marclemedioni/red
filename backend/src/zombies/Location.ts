export class ZombiesLocation {
    constructor(public x: number, public y: number) {

    }

    distanceTo(location: ZombiesLocation): number {
        return Math.abs((this.x - location.x) + (this.y - location.y));
    }

    moveTo(direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') {
        switch (direction) {
            case 'UP':
                this.y -= 1;
                break;
            case 'DOWN':
                this.y += 1;
                break;
            case 'LEFT':
                this.x -= 1;
                break;
            case 'RIGHT':
                this.x += 1;
                break;
        }
        return this;
    }
}