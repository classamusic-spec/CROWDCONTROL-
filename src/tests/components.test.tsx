import { render } from '@testing-library/react-native';

import { Emblem } from '@/components/branding/Emblem';
import { Logo } from '@/components/branding/Logo';
import { CrowdSprite } from '@/components/game/CrowdSprite';
import { DirectionArrow } from '@/components/game/DirectionArrow';
import { EnvironmentBackdrop } from '@/components/game/EnvironmentBackdrop';
import { Icon, type IconName } from '@/components/icons';
import { characterVariants } from '@/data/characters';
import { environments } from '@/data/environments';

const ALL_ICONS: IconName[] = [
  'star', 'heart', 'arrow', 'timer', 'remaining', 'mistakes', 'restart',
  'undo', 'hint', 'settings', 'home', 'levels', 'stats', 'customize', 'share',
  'calendar', 'streak', 'lock', 'trophy', 'reward', 'sound', 'music',
  'haptics', 'reducedmotion', 'theme', 'replay', 'continue', 'pause', 'close',
  'back',
];

describe('asset components render', () => {
  it('renders every icon without crashing', () => {
    for (const name of ALL_ICONS) {
      const { unmount } = render(<Icon name={name} />);
      unmount();
    }
  });

  it('renders the logo and emblem', () => {
    render(<Logo size="lg" />);
    render(<Emblem size={64} />);
  });

  it('renders all 4 direction arrows', () => {
    for (const d of ['up', 'down', 'left', 'right'] as const) {
      render(<DirectionArrow direction={d} />);
    }
  });

  it('renders every character sprite variant (front and back)', () => {
    for (const v of characterVariants) {
      render(<CrowdSprite variant={v.id} />);
      render(<CrowdSprite variant={v.id} facing="back" />);
    }
  });

  it('renders every environment backdrop', () => {
    for (const e of environments) {
      render(<EnvironmentBackdrop environmentId={e.id} />);
    }
  });
});
