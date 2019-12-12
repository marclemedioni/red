import { ZombiesTile } from "./Tile";
import { ZombiesLocation } from "./Location";
import { Type } from "class-transformer";

export const ZombiesMapSettings = {
    easy: {
        zombiesMultiplicator: 1,
        safeRange: 4
    }
}

function randomBetween(min: number, max: number, decimalPlaces: number = 0) {
    const rand = Math.random() * (max - min);
    const power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
}

export class ZombiesMap {
    @Type(() => ZombiesTile)
    public tiles: ZombiesTile[][];
    @Type(() => ZombiesLocation)
    public cityLocation: ZombiesLocation;
    public zombiesCount: number = 0;

    constructor(public size: number, public mode: string = 'easy') { }

    generate() {
        this.tiles = [];
        this.cityLocation = new ZombiesLocation(randomBetween(0, this.size), randomBetween(0, this.size));
        for (let x = 0; x < this.size; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.size; y++) {
                this.tiles[x][y] = new ZombiesTile(x, y, this.isCity(x, y))
            }
        }
    }

    populate(day: number) {
        const zMultiplicator = ZombiesMapSettings[this.mode].zombiesMultiplicator;

        /**
         * stable part of horde
         * (day 1, easy, 10 tiles) = 10z
         * 
         */
        this.zombiesCount = this.size * zMultiplicator * day;

        /**
         * random part of horde
         */
        this.zombiesCount += randomBetween(0, 6) * day * zMultiplicator;

        for (let z = 0; z < this.zombiesCount; z++) {

        }
    }

    private isCity(x, y) {
        return this.cityLocation.x === x && this.cityLocation.y === y;
    }

    /**
     * Get an area arround a location (clamped to map)
     * @param location 
     * @param size 
     */
    getArea(location: ZombiesLocation, size: number): ZombiesTile[] {
        let result: ZombiesTile[] = [];

        if (size < 3 || size % 2 === 0) {
            throw new Error('Area size should be odd number')
        }

        for (let i = location.x - (Math.floor(size / 2)); i <= location.x + (Math.floor(size / 2)); i++) {
            for (let j = location.y - (Math.floor(size / 2)); j <= location.y + (Math.floor(size / 2)); j++) {
                let locationToTest = new ZombiesLocation(i, j);

                if (!locationToTest.isInBounds(this.size)) {
                    continue;
                }

                result.push(this.tiles[i][j])
            }
        }

        return result;
    }

    getTileByLocation(location: ZombiesLocation): ZombiesTile | null {
        if (!location.isInBounds(this.size)) {
            return null;
        }

        return this.tiles[location.x][location.y]
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