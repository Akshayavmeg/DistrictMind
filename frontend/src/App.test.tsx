import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App from './App';

const healthOk = () =>
  new Response(
    JSON.stringify({ status: 'ok', service: 'districtmind-backend', environment: 'development' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );

describe('application shell', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(healthOk()));
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the home page with the product title and live backend status', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'DistrictMind' })).toBeInTheDocument();
    expect(screen.getByText('Telangana District Intelligence')).toBeInTheDocument();
    expect(await screen.findByText(/Backend: ONLINE/)).toBeInTheDocument();
  });

  it('redirects a district page to the development login without a session', async () => {
    render(
      <MemoryRouter initialEntries={['/districts']}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByRole('heading', { name: 'Enter development session' })).toBeInTheDocument();
    expect(screen.getByText('DEVELOPMENT LOGIN', { exact: true })).toBeInTheDocument();
  });
});
