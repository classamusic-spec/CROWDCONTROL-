/** Onboarding page content (directive §8). Copy is rendered natively. */

export type OnboardingPage = {
  id: 'welcome' | 'directions' | 'strategy' | 'daily' | 'rewards';
  headline: string;
  copy: string;
};

export const onboardingPages: OnboardingPage[] = [
  {
    id: 'welcome',
    headline: 'Welcome to Crowd Control',
    copy: 'Every character knows where they want to go. Your job is to clear the way.',
  },
  {
    id: 'directions',
    headline: 'Every Crowd Has a Direction',
    copy: 'Tap a character when the path ahead is completely clear.',
  },
  {
    id: 'strategy',
    headline: 'One Move Unlocks Another',
    copy: 'Clear the right character to open new paths across the board.',
  },
  {
    id: 'daily',
    headline: 'A New Crowd Every Day',
    copy: 'Solve the shared daily puzzle, build your streak, and share your result.',
  },
  {
    id: 'rewards',
    headline: 'Clear Crowds. Unlock New Places.',
    copy: 'Earn stars, discover environments, and customize your game.',
  },
];
