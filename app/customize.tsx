import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/buttons/Button';
import { Panel } from '@/components/cards/Panel';
import { Icon } from '@/components/icons';
import { BottomNav } from '@/components/navigation/BottomNav';
import { ScreenBackground } from '@/components/navigation/ScreenBackground';
import { cosmetics, type Cosmetic, type CosmeticSlot } from '@/data/cosmetics';
import { environments, type Environment } from '@/data/environments';
import { palette, theme } from '@/data/theme';
import { useProgress } from '@/hooks/useProgress';

const SLOT_ORDER: CosmeticSlot[] = [
  'character',
  'outfit',
  'environment',
  'boardTheme',
  'confetti',
];

const SLOT_LABELS: Record<CosmeticSlot, string> = {
  character: 'Characters',
  outfit: 'Outfits',
  environment: 'Environments',
  boardTheme: 'Board Themes',
  confetti: 'Confetti',
};

type TileShellProps = {
  name: string;
  description: string;
  color: string;
  accessibilityLabel: string;
  children: ReactNode;
};

function TileShell({ name, description, color, accessibilityLabel, children }: TileShellProps) {
  return (
    <Panel
      tone="navy"
      style={styles.tile}
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.tileTop}>
        <View style={[styles.swatch, { backgroundColor: color }]} />
        <View style={styles.tileText}>
          <Text style={styles.tileName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.tileDesc} numberOfLines={2}>
            {description}
          </Text>
        </View>
      </View>
      <View style={styles.tileAction}>{children}</View>
    </Panel>
  );
}

type CosmeticTileProps = {
  cosmetic: Cosmetic;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  onEquip: () => void;
  onUnlock: () => void;
};

function CosmeticTile({
  cosmetic,
  owned,
  equipped,
  canAfford,
  onEquip,
  onUnlock,
}: CosmeticTileProps) {
  const cost = cosmetic.starCost;
  const state = owned
    ? equipped
      ? 'equipped'
      : 'owned, not equipped'
    : `locked, costs ${cost ?? 0} stars`;

  return (
    <TileShell
      name={cosmetic.name}
      description={cosmetic.description}
      color={cosmetic.color}
      accessibilityLabel={`${cosmetic.name}. ${cosmetic.description}. ${state}.`}
    >
      {owned ? (
        <Button
          label={equipped ? 'Equipped' : 'Equip'}
          variant={equipped ? 'secondary' : 'primary'}
          size="sm"
          icon={equipped ? 'trophy' : undefined}
          disabled={equipped}
          onPress={onEquip}
        />
      ) : (
        <View style={styles.lockRow}>
          <View style={styles.costPill}>
            <Icon name="lock" size={16} color={palette.mutedBlue} />
            <Text style={styles.costLabel}>{cost ?? 0}★</Text>
          </View>
          <Button
            label={canAfford ? 'Unlock' : 'Not enough'}
            variant="success"
            size="sm"
            icon="star"
            disabled={!canAfford}
            onPress={onUnlock}
          />
        </View>
      )}
    </TileShell>
  );
}

type EnvironmentTileProps = {
  env: Environment;
  unlocked: boolean;
  equipped: boolean;
  onEquip: () => void;
};

function EnvironmentTile({ env, unlocked, equipped, onEquip }: EnvironmentTileProps) {
  const state = !unlocked
    ? `locked, unlocks at level ${env.unlockLevel}`
    : equipped
      ? 'equipped'
      : 'unlocked, not equipped';

  return (
    <TileShell
      name={env.name}
      description={`Unlocks at level ${env.unlockLevel}.`}
      color={env.accent}
      accessibilityLabel={`${env.name}. ${state}.`}
    >
      {unlocked ? (
        <Button
          label={equipped ? 'Equipped' : 'Equip'}
          variant={equipped ? 'secondary' : 'primary'}
          size="sm"
          icon={equipped ? 'trophy' : undefined}
          disabled={equipped}
          onPress={onEquip}
        />
      ) : (
        <View style={styles.lockRow}>
          <View style={styles.costPill}>
            <Icon name="lock" size={16} color={palette.mutedBlue} />
            <Text style={styles.costLabel}>Lvl {env.unlockLevel}</Text>
          </View>
        </View>
      )}
    </TileShell>
  );
}

export default function Customize() {
  const { progress, unlockCosmetic, equipCosmetic, setSelectedEnvironment } = useProgress();

  return (
    <ScreenBackground environmentId={progress.selectedEnvironment}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title} accessibilityRole="header">
            Customize
          </Text>
          <View style={styles.noteRow}>
            <Icon name="star" size={16} color={palette.yellow} />
            <Text style={styles.note}>Earned with stars — no purchases.</Text>
          </View>

          {SLOT_ORDER.map((slot) => (
            <View key={slot} style={styles.section}>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                {SLOT_LABELS[slot]}
              </Text>

              {slot === 'environment'
                ? environments.map((env) => {
                    const unlocked = progress.highestUnlocked >= env.unlockLevel;
                    const equipped = progress.selectedEnvironment === env.id;
                    return (
                      <EnvironmentTile
                        key={env.id}
                        env={env}
                        unlocked={unlocked}
                        equipped={equipped}
                        onEquip={() => setSelectedEnvironment(env.id)}
                      />
                    );
                  })
                : cosmetics
                    .filter((c) => c.slot === slot)
                    .map((cosmetic) => {
                      const owned =
                        cosmetic.starCost === null ||
                        progress.cosmetics.includes(cosmetic.id);
                      const equipped = progress.equipped[cosmetic.slot] === cosmetic.id;
                      const canAfford =
                        cosmetic.starCost !== null &&
                        progress.totalStars >= cosmetic.starCost;
                      return (
                        <CosmeticTile
                          key={cosmetic.id}
                          cosmetic={cosmetic}
                          owned={owned}
                          equipped={equipped}
                          canAfford={canAfford}
                          onEquip={() => equipCosmetic(cosmetic.slot, cosmetic.id)}
                          onUnlock={() => unlockCosmetic(cosmetic.id)}
                        />
                      );
                    })}
            </View>
          ))}
        </ScrollView>
        <BottomNav />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  title: {
    ...theme.typography.title,
    color: palette.white,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: -theme.spacing.sm,
  },
  note: {
    ...theme.typography.caption,
    color: palette.mutedBlue,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.subheading,
    color: palette.white,
  },
  tile: {
    gap: theme.spacing.md,
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: palette.panelNavy,
  },
  tileText: {
    flex: 1,
    gap: 2,
  },
  tileName: {
    ...theme.typography.subheading,
    color: palette.white,
  },
  tileDesc: {
    ...theme.typography.caption,
    color: palette.mutedBlue,
  },
  tileAction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  costPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: palette.panelNavy,
    minHeight: 44,
  },
  costLabel: {
    ...theme.typography.label,
    color: palette.white,
  },
});
