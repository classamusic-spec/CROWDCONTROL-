import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomNav } from '@/components/navigation/BottomNav';
import { Icon } from '@/components/icons';
import { ScreenBackground } from '@/components/navigation/ScreenBackground';
import { bundledLevels } from '@/data/bundledLevels';
import { environments } from '@/data/environments';
import { palette, theme } from '@/data/theme';
import { useProgress } from '@/hooks/useProgress';
import type { LevelDefinition } from '@/types/game';

function LevelTile({
  level,
  locked,
  stars,
  onPress,
}: {
  level: LevelDefinition;
  locked: boolean;
  stars: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        locked ? `Level ${level.number}, locked` : `Level ${level.number}, ${stars} stars`
      }
      accessibilityState={{ disabled: locked }}
      disabled={locked}
      onPress={onPress}
      style={[styles.tile, locked ? styles.tileLocked : styles.tileOpen]}
    >
      {locked ? (
        <Icon name="lock" size={22} color={palette.mutedBlue} />
      ) : (
        <>
          <Text style={styles.tileNumber}>{level.number}</Text>
          <View style={styles.tileStars}>
            {[0, 1, 2].map((i) => (
              <Icon key={i} name="star" size={9} color={i < stars ? palette.yellow : palette.secondaryNavy} />
            ))}
          </View>
        </>
      )}
    </Pressable>
  );
}

export default function Levels() {
  const router = useRouter();
  const { progress } = useProgress();

  return (
    <ScreenBackground environmentId={progress.selectedEnvironment} contentStyle={styles.root}>
      <Text style={styles.heading}>Levels</Text>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {environments.map((env) => {
          const group = bundledLevels.filter((l) => l.environmentId === env.id);
          if (group.length === 0) return null;
          const unlocked = progress.highestUnlocked >= env.unlockLevel;
          return (
            <View key={env.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{env.name}</Text>
                {!unlocked ? <Icon name="lock" size={16} color={palette.mutedBlue} /> : null}
              </View>
              <View style={styles.grid}>
                {group.map((level) => {
                  const locked = level.number > progress.highestUnlocked;
                  const stars = progress.levels[level.number]?.stars ?? 0;
                  return (
                    <LevelTile
                      key={level.id}
                      level={level}
                      locked={locked}
                      stars={stars}
                      onPress={() =>
                        router.push({ pathname: '/game', params: { level: String(level.number) } })
                      }
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <BottomNav />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {},
  heading: {
    color: palette.white,
    fontSize: 28,
    fontWeight: '900',
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: 12,
  },
  scroll: { paddingHorizontal: theme.layout.screenPadding, paddingBottom: 24, gap: 18 },
  section: { gap: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: palette.mutedBlue, fontSize: 15, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    width: 58,
    height: 58,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.sm,
  },
  tileOpen: { backgroundColor: palette.panelNavy, borderWidth: 1, borderColor: palette.brightBlue },
  tileLocked: { backgroundColor: palette.secondaryNavy, opacity: 0.6 },
  tileNumber: { color: palette.white, fontSize: 18, fontWeight: '900' },
  tileStars: { flexDirection: 'row', gap: 2, marginTop: 3 },
});
