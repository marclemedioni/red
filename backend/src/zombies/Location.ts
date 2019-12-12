export class ZombiesLocation {
    constructor(public x: number, public y: number) {

    }

    distanceTo(location: ZombiesLocation): number {
        return Math.abs((this.x - location.x) + (this.y - location.y));
    }

    isInBounds(mapSize: number): boolean {
        return this.x >= 0 && this.y >= 0 && (this.x < mapSize) && (this.y < mapSize)
    }
}