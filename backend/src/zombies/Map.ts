import { IMap, ITile, ILocation } from "./zombies";
import { Tile } from "./Tile";
import { Location } from "./Location";

export class Map implements IMap {
    size: number;
    tiles: ITile[][];
    cityLocation: ILocation;

    constructor(map: IMap | null, size: number) {
        if (map) {
            Object.assign(this, map)
        }
        else {
            this.size = size;
            this.generateMap();
        }
    }

    randomClampToSize() {
        return Math.floor(Math.random() * (this.size));
    }

    generateMap() {
        this.tiles = [];
        this.cityLocation = new Location(this.randomClampToSize(), this.randomClampToSize());
        for (let x = 0; x < this.size; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.size; y++) {
                this.tiles[x][y] = new Tile({
                    x,
                    y,
                    isCity: this.isCity(x, y)
                })
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