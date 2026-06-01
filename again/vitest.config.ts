import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    pool: 'vmThreads',
    poolOptions: {
      vmThreads: {
        singleThread: true,
      },
    },
  },
});
