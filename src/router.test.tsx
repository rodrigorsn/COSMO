import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppRouter, router } from './router';

describe('AppRouter', () => {
  it('boots the dashboard shell at the root route without an uncaught error', async () => {
    render(<AppRouter />);

    await act(async () => {
      await router.navigate({ to: '/' } as never);
    });

    expect(
      await screen.findByRole('heading', { name: 'Painel Executivo de Investigação B2B' })
    ).toBeInTheDocument();
  });

  it('renders the unknown-route fallback for an unmapped path without an uncaught error', async () => {
    render(<AppRouter />);

    await act(async () => {
      await router.navigate({ to: '/rota-que-nao-existe' } as never);
    });

    expect(await screen.findByRole('heading', { name: 'Rota não reconhecida' })).toBeInTheDocument();
  });
});
