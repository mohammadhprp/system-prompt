import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  parseArgs,
  initialItemValues,
  shouldPreselectAll,
  computeDiff,
  formatDiff,
  runInteractive,
  runNonInteractive,
} from '../src/cli.js';
import { install } from '../src/installer.js';
import { withWorkspace } from './helpers/workspace.js';

const CANCEL = Symbol('cancel');

function makeUi({ confirm = () => true, multiselect = () => [], select = () => CANCEL } = {}) {
  return {
    intro() {},
    outro() {},
    note() {},
    log() {},
    isCancel: value => value === CANCEL,
    spinner: () => ({ start() {}, stop() {} }),
    confirm: async options => confirm(options),
    multiselect: async options => multiselect(options),
    select: async options => select(options),
  };
}

function scripted(values) {
  const queue = [...values];
  return () => queue.shift();
}

test('parseArgs supports non-interactive installation options', () => {
  const options = parseArgs([
    '--target', 'config',
    '--skills=security-best-practices,taste',
    '--commands', 'review,pr',
    '--dry-run',
    '--force',
    '--no-agents-md',
  ]);

  assert.equal(options.targetDir, 'config');
  assert.deepEqual(options.selections.skills, ['security-best-practices', 'taste']);
  assert.deepEqual(options.selections.commands, ['review', 'pr']);
  assert.equal(options.dryRun, true);
  assert.equal(options.force, true);
  assert.equal(options.includeAgentsMd, false);
  assert.equal(options.nonInteractive, true);
});

test('parseArgs rejects unknown options', () => {
  assert.throws(() => parseArgs(['--unknown']), /Unknown option/);
});

test('parseArgs rejects missing target values', () => {
  assert.throws(() => parseArgs(['--target']), /Missing value for --target/);
  assert.throws(() => parseArgs(['--target', '--doctor']), /Missing value for --target/);
});

test('initialItemValues keeps only visible previously installed items', () => {
  const visible = [{ id: 'a' }, { id: 'b' }];
  assert.deepEqual(initialItemValues(visible, ['b', 'retired']), ['b']);
});

test('shouldPreselectAll defaults to all when few items and no previous install', () => {
  assert.equal(shouldPreselectAll([{ id: 'a' }], []), true);
  const many = Array.from({ length: 20 }, (_, index) => ({ id: String(index) }));
  assert.equal(shouldPreselectAll(many, []), false);
});

test('shouldPreselectAll follows the previous installation on re-run', () => {
  const visible = [{ id: 'a' }, { id: 'b' }];
  assert.equal(shouldPreselectAll(visible, ['a']), false);
  assert.equal(shouldPreselectAll(visible, ['a', 'b']), true);
});

test('computeDiff classifies added, removed, and kept items', () => {
  const diff = computeDiff(
    { skills: { adhd: {} }, commands: { learn: {} } },
    { skills: ['adhd', 'taste'], commands: [] },
  );

  assert.deepEqual(diff.added.skills.ids, ['taste']);
  assert.deepEqual(diff.removed.commands.ids, ['learn']);
  assert.deepEqual(diff.kept.skills.ids, ['adhd']);
});

test('formatDiff renders added and unchanged sections with display names', () => {
  const diff = computeDiff({ skills: { adhd: {} } }, { skills: ['adhd', 'taste'] });
  const text = formatDiff(diff);

  assert.match(text, /\+ Added:/);
  assert.match(text, /Skills: Taste/);
  assert.match(text, /~ Unchanged:/);
  assert.match(text, /Skills: ADHD/);
});

test('runInteractive cancels when the category selection is cancelled', () => withWorkspace(async () => {
  const ui = makeUi({ multiselect: () => CANCEL });

  const result = await runInteractive({ targetDir: '.opencode', ui });

  assert.deepEqual(result, { status: 'cancelled' });
}));

test('runInteractive installs generated files when no category is selected', () => withWorkspace(async () => {
  const ui = makeUi({ multiselect: () => [], confirm: () => true });

  const result = await runInteractive({ targetDir: '.opencode', ui });

  assert.equal(result.status, 'installed');
  await access(join('.opencode', 'AGENTS.md'));
  await access(join('.opencode', 'opencode.json'));
}));

test('runInteractive honors dry-run in the generated-only flow', () => withWorkspace(async () => {
  const ui = makeUi({ multiselect: () => [], confirm: () => true });

  const result = await runInteractive({ targetDir: '.opencode', dryRun: true, ui });

  assert.equal(result.status, 'installed');
  await assert.rejects(access(join('.opencode', 'AGENTS.md')), { code: 'ENOENT' });
}));

test('runInteractive installs the selected items', () => withWorkspace(async () => {
  // Confirmations: AGENTS.md, install all commands, customize TUI, proceed.
  const ui = makeUi({ multiselect: () => ['commands'], confirm: scripted([false, true, false, true]) });

  const result = await runInteractive({ targetDir: '.opencode', ui });

  assert.equal(result.status, 'installed');
  await access(join('.opencode', 'commands/summarize-changes.md'));
  await assert.rejects(access(join('.opencode', 'AGENTS.md')), { code: 'ENOENT' });
}));

test('runInteractive presents the plan and next steps as notes', () => withWorkspace(async () => {
  const notes = [];
  const ui = makeUi({ multiselect: () => ['commands'], confirm: scripted([false, true, false, true]) });
  ui.note = (message, title) => notes.push({ message, title });

  const result = await runInteractive({ targetDir: '.opencode', ui });

  assert.equal(result.status, 'installed');
  assert.deepEqual(notes.map(entry => entry.title), ['What will be installed', 'Generated files', 'Next steps']);
  assert.match(notes[0].message, /Slash Commands: /);
  assert.match(notes[0].message, /Summarize Changes/);
  assert.match(notes[1].message, /opencode\.json/);
  assert.match(notes[2].message, /OpenCode/);
}));

test('runInteractive writes nothing when the final confirmation is declined', () => withWorkspace(async () => {
  const ui = makeUi({ multiselect: () => ['commands'], confirm: scripted([false, true, false, false]) });

  const result = await runInteractive({ targetDir: '.opencode', ui });

  assert.deepEqual(result, { status: 'cancelled' });
  await assert.rejects(access(join('.opencode')), { code: 'ENOENT' });
}));

test('runInteractive cancels when an item selection is cancelled', () => withWorkspace(async () => {
  const ui = makeUi({
    multiselect: options => (options.message.startsWith('Which') ? CANCEL : ['commands']),
    confirm: scripted([false, false]),
  });

  const result = await runInteractive({ targetDir: '.opencode', ui });

  assert.deepEqual(result, { status: 'cancelled' });
}));

test('runInteractive writes customized TUI preferences', () => withWorkspace(async () => {
  const ui = makeUi({
    multiselect: () => ['commands'],
    confirm: (options) => {
      const answers = {
        'Generate AGENTS.md?': false,
        'Install all slash commands?': true,
        'Customize OpenCode TUI settings?': true,
        'Proceed with installation?': true,
      };
      return options.message in answers ? answers[options.message] : true;
    },
    select: (options) => {
      const answers = {
        'TUI theme': 'nord',
        'Diff style': 'stacked',
        'Cursor style': 'block',
        'Scroll speed': 5,
        'Alert volume': 0.8,
      };
      return answers[options.message];
    },
  });

  const result = await runInteractive({ targetDir: '.opencode', ui });

  assert.equal(result.status, 'installed');
  const tui = JSON.parse(await readFile(join('.opencode', 'tui.json'), 'utf-8'));
  assert.equal(tui.theme, 'nord');
  assert.equal(tui.diff_style, 'stacked');
  assert.equal(tui.scroll_speed, 5);
  assert.equal(tui.attention.volume, 0.8);
}));

test('runInteractive keeps deselected items when the user declines removal', () => withWorkspace(async () => {
  await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: { commands: ['summarize-changes'] },
    includeAgentsMd: false,
  });

  const ui = makeUi({
    multiselect: options => (options.message.startsWith('Which') ? ['adhd'] : ['skills']),
    // AGENTS.md, install all skills, customize TUI, remove deselected (no), proceed.
    confirm: scripted([false, false, false, false, true]),
  });

  const result = await runInteractive({ targetDir: '.opencode', ui });

  assert.equal(result.status, 'installed');
  await access(join('.opencode', 'commands/summarize-changes.md'));
  await access(join('.opencode', 'skills/adhd/SKILL.md'));
}));

test('runInteractive summarizes changes when updating a previous installation', () => withWorkspace(async () => {
  await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: { commands: ['summarize-changes'] },
    includeAgentsMd: false,
  });

  const notes = [];
  const ui = makeUi({
    multiselect: options => (options.message.startsWith('Which') ? ['adhd'] : ['skills']),
    confirm: scripted([false, false, false, false, true]),
  });
  ui.note = (message, title) => notes.push({ message, title });

  await runInteractive({ targetDir: '.opencode', ui });

  assert.equal(notes[0].title, 'Changes from previous installation');
  assert.match(notes[0].message, /\+ Added:/);
}));

test('runNonInteractive performs a dry run without writing files', () => withWorkspace(async () => {
  const logs = [];
  const ui = { log: message => logs.push(message) };

  await runNonInteractive({
    targetDir: '.opencode',
    selections: { commands: ['summarize-changes'] },
    includeAgentsMd: false,
    dryRun: true,
    ui,
  });

  assert.ok(logs.some(line => line.includes('Dry run complete.')));
  await assert.rejects(access(join('.opencode')), { code: 'ENOENT' });
}));
