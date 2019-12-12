export class ZombiesTile {
    constructor(public x: number, public y: number, public isCity: boolean | undefined) {
        // this.x = x;
        // this.y = y;
        // this.isCity = isCity
    }

    toString() {
        let result = '['
        result += this.isCity ? 'C' : ' ';
        result += ']'
        return result
    }
}