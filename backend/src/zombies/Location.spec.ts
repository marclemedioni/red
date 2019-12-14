import { ZombiesLocation } from "./Location"

describe('ZombiesLocation', () => {
    it('should return a right distance to another location', () => {
        const a = new ZombiesLocation(0, 0);
        const b = new ZombiesLocation(2, 2);

        expect(a.distanceTo(b)).toEqual(4);
        expect(b.distanceTo(a)).toEqual(4)
    });

    it('should be able to compute location after a move', () => {
        const location = new ZombiesLocation(0, 0);

        location.moveTo('UP');
        expect(location.x).toBe(0);
        expect(location.y).toBe(-1);

        location.moveTo('DOWN');
        expect(location.x).toBe(0);
        expect(location.y).toBe(0);

        location.moveTo('LEFT');
        expect(location.x).toBe(-1);
        expect(location.y).toBe(0);

        location.moveTo('RIGHT');
        expect(location.x).toBe(0);
        expect(location.y).toBe(0);
    })
})