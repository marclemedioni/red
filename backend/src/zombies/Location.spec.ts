import { ZombiesLocation } from "./Location"

describe('ZombiesLocation', () => {
    it('should return a right distance to another location', () => {
        const a = new ZombiesLocation(0, 0);
        const b = new ZombiesLocation(2, 2);

        expect(a.distanceTo(b)).toEqual(4);
        expect(b.distanceTo(a)).toEqual(4)
    });

    it('sould tell if location is out of bounds', () => {
        const location = new ZombiesLocation(0, 9);

        expect(location.isInBounds(10)).toBe(true)
        expect(location.isInBounds(9)).toBe(false)
    })
})