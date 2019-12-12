import { ZombiesTile } from "./Tile";
import { ZombiesLocation } from "./Location";
import { Type } from "class-transformer";

export class ZombiesMap {
    @Type(() => ZombiesTile)
    private tiles: ZombiesTile[][];
    @Type(() => ZombiesLocation)
    private cityLocation: ZombiesLocation;

    constructor(private size: number) { }

    randomClampToSize() {
        return Math.floor(Math.random() * (this.size));
    }

    generateMap() {
        this.tiles = [];
        this.cityLocation = new ZombiesLocation(this.randomClampToSize(), this.randomClampToSize());
        for (let x = 0; x < this.size; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.size; y++) {
                this.tiles[x][y] = new ZombiesTile(x, y, this.isCity(x, y))
            }
        }
    }

    isCity(x, y) {
        return this.cityLocation.x === x && this.cityLocation.y === y;
    }

    toString() {
        return this.tiles.reduce((lineAcc, line) => {
            lineAcc += line.map((rowAcc, col) => {
                return rowAcc;
            }, '').join('');
            return lineAcc += '\n';
        }, '');
    }
}