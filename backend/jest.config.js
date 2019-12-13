const { defaults } = require('jest-config');
module.exports = {
    name: 'zombies',
    transform: {
        '^.+\\.[tj]s$': 'ts-jest'
    },
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'js'],
    coverageDirectory: './coverage',
    setupFiles: ['./jest.setup.ts'],
    collectCoverage: true,
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.spec.json',
            ignoreCoverageForAllDecorators: true
        }
    }
};