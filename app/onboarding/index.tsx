import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/buttons/Button';
import { ScreenBackground } from '@/components/navigation/ScreenBackground';
import { OnboardingHero } from '@/components/onboarding/OnboardingHero';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { onboardingPages } from '@/data/onboarding';
import { palette, theme } from '@/data/theme';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';

/**
 * First-run onboarding: five state-driven pages with a reanimated crossfade
 * between them (a plain switch when reduced motion is requested). Each page pairs
 * an original SVG hero with a headline + copy from `onboardingPages`. Finishing
 * (or skipping) marks onboarding complete and hands off to the tutorial.
 */

// One environment backdrop per page for a little variety (all valid ids).
const PAGE_ENVIRONMENTS = ['concert', 'airport', 'subway', 'themepark', 'mall'];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();
  const reducedMotion = useReducedMotionPref();
  const [currentIndex, setCurrentIndex] = useState(0);

  const opacity = useSharedValue(1);
  const stageStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const applyIndex = useCallback(
    (next: number) => {
      setCurrentIndex(next);
      opacity.value = withTiming(1, { duration: theme.motion.base });
    },
    [opacity],
  );

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= onboardingPages.length || next === currentIndex) {
        return;
      }
      if (reducedMotion) {
        setCurrentIndex(next);
        return;
      }
      opacity.value = withTiming(0, { duration: theme.motion.fast }, (finished) => {
        if (finished) {
          runOnJS(applyIndex)(next);
        }
      });
    },
    [currentIndex, reducedMotion, opacity, applyIndex],
  );

  const finish = useCallback(() => {
    completeOnboarding();
    router.replace('/tutorial' as never);
  }, [completeOnboarding, router]);

  const page = onboardingPages[currentIndex];
  if (!page) {
    return null;
  }

  const isLast = currentIndex === onboardingPages.length - 1;
  const envId = PAGE_ENVIRONMENTS[currentIndex] ?? 'concert';

  return (
    <ScreenBackground environmentId={envId} contentStyle={styles.safe}>
      <View style={styles.container}>
        <Animated.View style={[styles.stage, stageStyle]}>
          <OnboardingHero id={page.id} size={220} />
          <View style={styles.copyBlock}>
            <Text
              style={styles.headline}
              accessibilityRole="header"
              allowFontScaling
            >
              {page.headline}
            </Text>
            <Text style={styles.copy} allowFontScaling>
              {page.copy}
            </Text>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <ProgressDots count={onboardingPages.length} index={currentIndex} />
          <Button
            label={isLast ? 'Start Tutorial' : 'Next'}
            icon="continue"
            variant="primary"
            size="lg"
            fullWidth
            onPress={isLast ? finish : () => goTo(currentIndex + 1)}
          />
          {isLast ? null : (
            <Button label="Skip" variant="ghost" size="md" fullWidth onPress={finish} />
          )}
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  container: {
    flex: 1,
    maxWidth: theme.layout.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  copyBlock: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  headline: {
    ...theme.typography.title,
    color: palette.white,
    textAlign: 'center',
  },
  copy: {
    ...theme.typography.body,
    color: palette.mutedBlue,
    textAlign: 'center',
  },
  footer: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    alignItems: 'stretch',
  },
});
