import { ZombiesLocation } from "./Location";

export class ZombiesTile extends ZombiesLocation {
    zombiesCount: number = 0;
    constructor(public x: number, public y: number, public isCity: boolean | undefined) {
        super(x, y)
    }

    toString() {
        let result = '['
        result += this.isCity ? 'C' : this.zombiesCount ? `${this.zombiesCount}` : ' ';
        result += ']'
        return result
    }
}