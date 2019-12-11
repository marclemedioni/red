import { ILocation } from "./zombies";

export class Location implements ILocation {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}