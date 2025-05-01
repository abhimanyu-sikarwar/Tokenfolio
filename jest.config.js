const nextJest = require('next/jest')

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files
    dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        // Update these paths to match your actual project structure
        '^@/components/(.*)$': '<rootDir>/src/components/$1',
        '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@/app/(.*)$': '<rootDir>/src/app/$1',
        '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
        '^@/types/(.*)$': '<rootDir>/src/types/$1',
        // Handle CSS imports
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    },
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    transformIgnorePatterns: [
        '/node_modules/',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
}

module.exports = createJestConfig(customJestConfig)
