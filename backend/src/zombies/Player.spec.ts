import { plainToClass } from "class-transformer"
import { ZombiesPlayer } from "./Player"

describe('ZombiesPlayer', () => {
    it('should hydrate correctly', () => {
        const player = plainToClass(ZombiesPlayer, {});
    })
})