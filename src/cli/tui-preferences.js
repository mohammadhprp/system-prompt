import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { normalizeTuiPreferences, TUI_THEMES, tuiPreferencesFromConfig } from '../config/tui.js';

export async function readTuiPreferences(absTarget) {
  try {
    return tuiPreferencesFromConfig(JSON.parse(await readFile(resolve(absTarget, 'tui.json'), 'utf-8')));
  } catch (error) {
    if (error.code === 'ENOENT' || error instanceof SyntaxError) return {};
    throw error;
  }
}

export async function collectTuiPreferences(existing, ui) {
  const base = normalizeTuiPreferences(existing);

  const theme = await ui.select({
    message: 'TUI theme',
    options: TUI_THEMES.map(value => ({
      value,
      label: value,
      hint: value === 'system' ? 'Adapts to your terminal' : undefined,
    })),
    initialValue: base.theme,
  });
  if (ui.isCancel(theme)) return null;

  const diffStyle = await ui.select({
    message: 'Diff style',
    options: [
      { value: 'auto', label: 'auto', hint: 'Adapts to terminal width' },
      { value: 'stacked', label: 'stacked', hint: 'Always single column' },
    ],
    initialValue: base.diff_style,
  });
  if (ui.isCancel(diffStyle)) return null;

  const cursorStyle = await ui.select({
    message: 'Cursor style',
    options: ['block', 'underline', 'line', 'default'].map(value => ({ value, label: value })),
    initialValue: base.cursor.style,
  });
  if (ui.isCancel(cursorStyle)) return null;

  const scrollSpeed = await ui.select({
    message: 'Scroll speed',
    options: [
      { value: 1, label: '1', hint: 'Slow' },
      { value: 2, label: '2' },
      { value: 3, label: '3', hint: 'Default' },
      { value: 4, label: '4' },
      { value: 5, label: '5', hint: 'Fast' },
    ],
    initialValue: base.scroll_speed,
  });
  if (ui.isCancel(scrollSpeed)) return null;

  const scrollAcceleration = await ui.confirm({
    message: 'Enable scroll acceleration?',
    initialValue: base.scroll_acceleration,
  });
  if (ui.isCancel(scrollAcceleration)) return null;

  const mouse = await ui.confirm({
    message: 'Enable mouse support?',
    initialValue: base.mouse,
  });
  if (ui.isCancel(mouse)) return null;

  const attentionEnabled = await ui.confirm({
    message: 'Enable attention notifications and sounds?',
    initialValue: base.attention.enabled,
  });
  if (ui.isCancel(attentionEnabled)) return null;

  const attention = { ...base.attention, enabled: attentionEnabled };
  if (attentionEnabled) {
    const notifications = await ui.confirm({
      message: 'Desktop notifications?',
      initialValue: base.attention.notifications,
    });
    if (ui.isCancel(notifications)) return null;

    const sound = await ui.confirm({
      message: 'Sound alerts?',
      initialValue: base.attention.sound,
    });
    if (ui.isCancel(sound)) return null;

    const volume = await ui.select({
      message: 'Alert volume',
      options: [
        { value: 0.2, label: '20%' },
        { value: 0.4, label: '40%', hint: 'Default' },
        { value: 0.6, label: '60%' },
        { value: 0.8, label: '80%' },
        { value: 1, label: '100%' },
      ],
      initialValue: base.attention.volume,
    });
    if (ui.isCancel(volume)) return null;

    attention.notifications = notifications;
    attention.sound = sound;
    attention.volume = volume;
  }

  return normalizeTuiPreferences({
    theme,
    diff_style: diffStyle,
    cursor: { style: cursorStyle, blinking: base.cursor.blinking },
    scroll_speed: scrollSpeed,
    scroll_acceleration: scrollAcceleration,
    mouse,
    attention,
  });
}
