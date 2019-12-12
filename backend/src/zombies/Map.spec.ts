import { ZombiesMap, ZombiesMapSettings } from './Map';
import { plainToClass } from 'class-transformer';
import { ZombiesTile } from './Tile';
import { ZombiesLocation } from './Location';

const MAP_SIZE = 10;
const MAP_OBJECT = {
    tiles: [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
        [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
        [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
    ],
    cityLocation: { x: 1, y: 1 }
}

describe('ZombiesMap', () => {
    it('should generate a square map', () => {
        const map = new ZombiesMap(MAP_SIZE);
        map.generate();
        expect(map.tiles.length).toBe(MAP_SIZE);
        expect(map.tiles[0].length).toBe(MAP_SIZE);
    });

    it('should place city in the map', () => {
        const map = new ZombiesMap(MAP_SIZE);
        map.generate();
        expect(map.cityLocation.x).toBeLessThanOrEqual(MAP_SIZE - 1);
        expect(map.cityLocation.y).toBeLessThanOrEqual(MAP_SIZE - 1);
    });

    it('should hydrate normaly', () => {
        const map = plainToClass(ZombiesMap, MAP_OBJECT)
        expect(map.tiles.length).toBe(MAP_OBJECT.tiles.length)
        expect(map.tiles[0][0]).toBeInstanceOf(ZombiesTile)
        expect(map.cityLocation).toBeInstanceOf(ZombiesLocation)
    });

    it('should populate accordingly to day', () => {
        const map = new ZombiesMap(MAP_SIZE);
        map.generate();
        for (let i = 0; i < 100; i++) {
            map.populate(1);
            expect(map.zombiesCount).toBeLessThanOrEqual(15);
            map.populate(2);
            expect(map.zombiesCount).toBeLessThanOrEqual(30);
            map.populate(45)
            expect(map.zombiesCount).toBeLessThanOrEqual(675);
        }
    });

    it('should not pop zombies to near from city', () => {
        const map = new ZombiesMap(MAP_SIZE);
        map.generate();
        map.populate(1);

        // TODO - Implement this
    })

    it('should return a valid area arround a given location', () => {
        const map = new ZombiesMap(MAP_SIZE);
        map.generate();

        expect(() => {
            map.getArea(new ZombiesLocation(0, 0), 4);
        }).toThrow();

        // Location on top left corner
        let area = map.getArea(new ZombiesLocation(0, 0), 3);
        expect(area.length).toEqual(4)

        // Location on bottom right corner
        area = map.getArea(new ZombiesLocation(9, 9), 3);
        expect(area.length).toEqual(4)

        // Location on top center
        area = map.getArea(new ZombiesLocation(0, 3), 3);
        expect(area.length).toEqual(6)

        area = map.getArea(new ZombiesLocation(0, 0), 21);
        expect(area.length).toBe(100);
    })

    it('should return a tile for a given location', () => {
        const map = new ZombiesMap(MAP_SIZE);
        map.generate();

        expect(map.getTileByLocation(new ZombiesLocation(1, 1))).toBe(map.tiles[1][1]);
        expect(map.getTileByLocation(new ZombiesLocation(15, 15))).toBe(null);
    })
})