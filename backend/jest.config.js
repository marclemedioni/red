module.exports = {
    name: 'backend',
    transform: {
        '^.+\\.[tj]s$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'js'],
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