import { formatTime } from '@/utils/formatting';

/**
 * Builds the daily-challenge share text. Never reveals the solution — only the
 * summary stats. See directive §12.
 */

export type DailyShareData = {
  puzzleNumber: number;
  timeMs: number;
  moves: number;
  mistakes: number;
  streak: number;
};

export function buildDailyShareText(data: DailyShareData): string {
  const lines = [
    `CROWD CONTROL #${data.puzzleNumber}`,
    '',
    `⏱ ${formatTime(data.timeMs)}`,
    `🎯 ${data.moves} moves`,
    `💀 ${data.mistakes} mistakes`,
    `🔥 ${data.streak}-day streak`,
    '',
    "Can you clear today's crowd?",
    '#CrowdControlDaily',
  ];
  return lines.join('\n');
}
