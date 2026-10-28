import type { ReactNode } from 'react';

/** The checkout's sections, built by the screen; a layout only arranges them. */
export interface CheckoutLayoutProps {
  bookCard: ReactNode;
  form: ReactNode;
  summary: ReactNode;
  /** The quote error and the Pay button */
  pay: ReactNode;
}
