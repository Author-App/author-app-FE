import { renderWithProviders, screen } from '@/src/test-utils/render';
import SectionHeader from '../SectionHeader';

describe('SectionHeader', () => {
  it('shows the title', () => {
    renderWithProviders(<SectionHeader title="Featured Books" />);

    expect(screen.getByText('Featured Books')).toBeOnTheScreen();
  });

  it('shows the subtitle under the title when one is given', () => {
    renderWithProviders(
      <SectionHeader title="Featured Books" subtitle="Picked for you" />
    );

    expect(screen.getByText('Featured Books')).toBeOnTheScreen();
    expect(screen.getByText('Picked for you')).toBeOnTheScreen();
  });

  it('shows nothing extra when no subtitle is given', () => {
    renderWithProviders(<SectionHeader title="Featured Books" />);

    expect(screen.queryByText('Picked for you')).not.toBeOnTheScreen();
  });

  // An empty string is falsy, so it hides the subtitle the same way undefined does.
  // Counts rendered Text elements, not their content: an empty Text still renders.
  it('renders only one line of text when the subtitle is an empty string', () => {
    renderWithProviders(<SectionHeader title="Featured Books" subtitle="" />);

    expect(screen.getAllByRole('text')).toHaveLength(1);
  });
});
