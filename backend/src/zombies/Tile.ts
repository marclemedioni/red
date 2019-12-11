import { ITile } from "./zombies";

export class Tile implements ITile {
    x: number;
    y: number;
    isCity: boolean | undefined;

    constructor({ x, y, isCity }) {
        this.x = x;
        this.y = y;
        this.isCity = isCity
    }

    toString() {
        let result = '['
        result += this.isCity ? 'C' : ' ';
        result += ']'
        return result
    }
}