import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DistrictDetailPage } from './DistrictDetailPage';
import { DistrictsPage } from './DistrictsPage';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const warangal = {
  id: 'telangana-warangal',
  name: 'Warangal',
  state: 'Telangana',
  status: 'active',
  reference: { source: 'test provenance', source_id: null, source_url: null, vintage: null },
};

/** Routes the fake backend by URL, so tests prove data flows through the API path. */
function fakeBackend(routes: Record<string, () => Response | Promise<Response>>) {
  return vi.fn((input: string | URL | Request) => {
    const url = String(input);
    for (const [suffix, handler] of Object.entries(routes)) {
      if (url.endsWith(suffix)) return Promise.resolve(handler());
    }
    return Promise.resolve(json({ error: 'not_found' }, 404));
  });
}

function renderListPage() {
  return render(
    <MemoryRouter initialEntries={['/districts']}>
      <Routes>
        <Route path="/districts" element={<DistrictsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function renderDetailPage(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/districts/:id" element={<DistrictDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('district list page', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows a loading state while the API request is pending', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => {})),
    );
    renderListPage();
    expect(screen.getByRole('status')).toHaveTextContent('Loading districts');
  });

  it('renders the districts that the API returns, not a hardcoded list', async () => {
    vi.stubGlobal(
      'fetch',
      fakeBackend({
        '/api/v1/districts': () =>
          json({
            items: [
              { ...warangal, id: 'telangana-alpha', name: 'Alpha District' },
              { ...warangal, id: 'telangana-beta', name: 'Beta District' },
            ],
            total: 2,
          }),
      }),
    );
    renderListPage();
    expect(await screen.findByText('Alpha District')).toBeInTheDocument();
    expect(screen.getByText('Beta District')).toBeInTheDocument();
    expect(screen.queryByText('Warangal')).not.toBeInTheDocument();
  });

  it('links each district to its canonical /districts/:id route', async () => {
    vi.stubGlobal('fetch', fakeBackend({ '/api/v1/districts': () => json({ items: [warangal], total: 1 }) }));
    renderListPage();
    const link = await screen.findByRole('link', { name: /Warangal/ });
    expect(link).toHaveAttribute('href', '/districts/telangana-warangal');
  });

  it('shows an API failure state and no fallback district names', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('network down'))),
    );
    renderListPage();
    expect(await screen.findByText('District list unavailable')).toBeInTheDocument();
    expect(screen.queryByText('Warangal')).not.toBeInTheDocument();
  });

  it('shows an empty-catalog state when the API returns zero districts', async () => {
    vi.stubGlobal('fetch', fakeBackend({ '/api/v1/districts': () => json({ items: [], total: 0 }) }));
    renderListPage();
    expect(await screen.findByText('No districts in the reference catalog')).toBeInTheDocument();
  });
});

describe('district detail page', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows loading while the detail request is pending', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => {})),
    );
    renderDetailPage('/districts/telangana-warangal');
    expect(screen.getByRole('status')).toHaveTextContent('Loading district reference');
  });

  it('renders verified reference fields from the API and labels unavailable areas', async () => {
    vi.stubGlobal('fetch', fakeBackend({ '/api/v1/districts/telangana-warangal': () => json(warangal) }));
    renderDetailPage('/districts/telangana-warangal');
    expect(await screen.findByRole('heading', { name: 'Warangal' })).toBeInTheDocument();
    expect(screen.getByText('Telangana')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Not available — validated GIS layer not yet connected.')).toBeInTheDocument();
  });

  it('shows a district-not-found state on a 404', async () => {
    vi.stubGlobal('fetch', fakeBackend({ '/api/v1/districts/telangana-atlantis': () => json({}, 404) }));
    renderDetailPage('/districts/telangana-atlantis');
    expect(await screen.findByText('District not found')).toBeInTheDocument();
  });

  it('shows an invalid-reference state on a 400', async () => {
    vi.stubGlobal('fetch', fakeBackend({ '/api/v1/districts/Bad-Id': () => json({}, 400) }));
    renderDetailPage('/districts/Bad-Id');
    expect(await screen.findByText('Invalid district reference')).toBeInTheDocument();
  });

  it('shows a generic error and no hardcoded district when the API fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new TypeError('network down'))),
    );
    renderDetailPage('/districts/telangana-warangal');
    expect(await screen.findByText('District unavailable')).toBeInTheDocument();
    expect(screen.queryByText('Warangal')).not.toBeInTheDocument();
  });
});
