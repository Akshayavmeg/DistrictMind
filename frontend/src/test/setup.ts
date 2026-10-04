import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest runs without globals, so Testing Library's automatic cleanup is not registered.
// Unmount rendered trees after every test so no DOM leaks between tests.
afterEach(() => {
  cleanup();
});
