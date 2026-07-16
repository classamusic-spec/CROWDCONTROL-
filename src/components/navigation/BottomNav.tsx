import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/icons';
import { palette } from '@/data/theme';

/** Persistent bottom navigation across the primary hub screens. */
type Tab = { name: string; label: string; icon: IconName; path: string };

const TABS: Tab[] = [
  { name: 'home', label: 'Home', icon: 'home', path: '/home' },
  { name: 'levels', label: 'Levels', icon: 'levels', path: '/levels' },
  { name: 'daily', label: 'Daily', icon: 'calendar', path: '/daily' },
  { name: 'stats', label: 'Stats', icon: 'stats', path: '/stats' },
  { name: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {TABS.map((tab) => {
        const active = pathname === tab.path;
        return (
          <Pressable
            key={tab.name}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
            style={styles.tab}
            onPress={() => {
              if (!active) router.replace(tab.path as never);
            }}
          >
            <Icon
              name={tab.icon}
              size={24}
              color={active ? palette.brightBlue : palette.mutedBlue}
            />
            <Text style={[styles.label, { color: active ? palette.white : palette.mutedBlue }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: palette.secondaryNavy,
    borderTopWidth: 1,
    borderTopColor: palette.panelNavy,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, minHeight: 48 },
  label: { fontSize: 11, fontWeight: '700' },
});

export default BottomNav;
