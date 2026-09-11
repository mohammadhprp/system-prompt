import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { install } from '../src/install/index.js';
import { loadLockFile, lockToSelections } from '../src/install/lock.js';
import { withWorkspace } from './helpers/workspace.js';

const SKILL_FIXTURES = [
  {
    id: 'taste',
    files: [
      'skills/taste/SKILL.md',
      'skills/taste/references/design-taste-frontend.md',
      'skills/taste/references/brandkit.md',
    ],
    content: [
      ['skills/taste/SKILL.md', /name: taste/],
      ['skills/taste/SKILL.md', /references\/design-taste-frontend\.md/],
      ['skills/taste/references/design-taste-frontend.md', /Anti-Slop Frontend Skill/],
      ['skills/taste/references/brandkit.md', /BRANDKIT IMAGE GENERATION SKILL/],
    ],
  },
  {
    id: 'effective-html',
    files: [
      'skills/effective-html/SKILL.md',
      'skills/effective-html/examples.md',
      'skills/effective-html/references/design-artifact.md',
      'skills/effective-html/references/html-prototype.md',
      'skills/effective-html/references/interfaces.md',
    ],
    content: [
      ['skills/effective-html/SKILL.md', /name: effective-html/],
      ['skills/effective-html/SKILL.md', /references\/html-prototype\.md/],
    ],
  },
  {
    id: 'glab',
    files: [
      'skills/glab/SKILL.md',
      'skills/glab/references/commands-detailed.md',
      'skills/glab/references/quick-reference.md',
      'skills/glab/references/troubleshooting.md',
    ],
    content: [['skills/glab/SKILL.md', /name: glab/]],
  },
  {
    id: 'jira-cli',
    files: [
      'skills/jira-cli/SKILL.md',
      'skills/jira-cli/references/commands-detailed.md',
      'skills/jira-cli/references/quick-reference.md',
      'skills/jira-cli/references/troubleshooting.md',
    ],
    content: [['skills/jira-cli/SKILL.md', /name: jira-cli/]],
  },
];

test('install writes selected framework files and generated config', () => withWorkspace(async () => {
  const absTarget = await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: {
      skills: ['backend-best-practices'],
      agents: ['reviewer'],
      commands: ['summarize-changes'],
      standards: ['security'],
      templates: ['adr'],
      plugins: ['opencode-goal-plugin'],
      memory: ['codebase-insights', 'user-preferences'],
      mcps: ['playwright-mcp'],
    },
    includeAgentsMd: true,
  });

  assert.equal(absTarget, resolve(process.cwd(), '.opencode'));

  const skill = await readFile(join(absTarget, 'skills/backend-best-practices/SKILL.md'), 'utf-8');
  assert.match(skill, /Backend Best Practices/);

  const agent = await readFile(join(absTarget, 'agents/reviewer.md'), 'utf-8');
  assert.match(agent, /review code changes/i);

  const command = await readFile(join(absTarget, 'commands/summarize-changes.md'), 'utf-8');
  assert.match(command, /summarize/i);

  const standard = await readFile(join(absTarget, 'references/standards/security.md'), 'utf-8');
  assert.match(standard, /Security/);

  const template = await readFile(join(absTarget, 'references/templates/adr.md'), 'utf-8');
  assert.match(template, /ADR|Architecture Decision Record/);

  const agentsMd = await readFile(join(absTarget, 'AGENTS.md'), 'utf-8');
  assert.match(agentsMd, /Behavioral guidelines to reduce common LLM coding mistakes/);
  assert.match(agentsMd, /Read CONTEXT\.md for repository-specific setup/);

  await assert.rejects(access(join(absTarget, 'system-prompt.md')), { code: 'ENOENT' });

  const memoryFile1 = await readFile(join(absTarget, 'memory/codebase-insights.md'), 'utf-8');
  assert.match(memoryFile1, /Codebase Insights/);
  const memoryFile2 = await readFile(join(absTarget, 'memory/user-preferences.md'), 'utf-8');
  assert.match(memoryFile2, /User Preferences/);

  const opencode = JSON.parse(await readFile(join(absTarget, 'opencode.json'), 'utf-8'));
  assert.ok(opencode.instructions.includes('.opencode/memory/*.md'));
  assert.deepEqual(opencode.plugin, ['@prevalentware/opencode-goal-plugin']);
  assert.ok(opencode.mcp);

  const tui = JSON.parse(await readFile(join(absTarget, 'tui.json'), 'utf-8'));
  assert.deepEqual(tui.plugin, ['@prevalentware/opencode-goal-plugin']);

  const gitignore = await readFile(join(absTarget, '.gitignore'), 'utf-8');
  assert.match(gitignore, /^\.env\*$/m);

  const lock = JSON.parse(await readFile(join(absTarget, 'system-prompt-lock.json'), 'utf-8'));
  assert.equal(lock.version, 1);
  assert.equal(lock.agentType, 'opencode');
  assert.equal(lock.includeAgentsMd, true);
  assert.match(lock.installedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.ok(lock.skills['backend-best-practices']);
  assert.equal(lock.skills['backend-best-practices'].sourceType, 'bundled');
  assert.match(lock.skills['backend-best-practices'].source, /^system-prompt@/);
  assert.equal(lock.skills['backend-best-practices'].itemPath, 'framework/skills/backend-best-practices');
  assert.match(lock.skills['backend-best-practices'].computedHash, /^[a-f0-9]{64}$/);
  assert.match(lock.skills['backend-best-practices'].files['skills/backend-best-practices/SKILL.md'], /^[a-f0-9]{64}$/);
  assert.ok(lock.agents.reviewer);
  assert.ok(lock.generated['AGENTS.md']);
  assert.ok(lock.generated['opencode.json']);
  assert.deepEqual(lockToSelections(lock).skills, ['backend-best-practices']);
}));

test('install copies skills with their reference directories', () => withWorkspace(async () => {
  const absTarget = await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: { skills: SKILL_FIXTURES.map(fixture => fixture.id) },
    includeAgentsMd: false,
  });

  for (const fixture of SKILL_FIXTURES) {
    for (const file of fixture.files) await access(join(absTarget, file));
    for (const [file, pattern] of fixture.content) {
      assert.match(await readFile(join(absTarget, file), 'utf-8'), pattern);
    }
  }
}));

test('install writes TUI preferences into tui.json', () => withWorkspace(async () => {
  const absTarget = await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: {},
    includeAgentsMd: false,
    tuiPreferences: {
      theme: 'nord',
      diff_style: 'stacked',
      mouse: false,
      attention: { enabled: false },
    },
  });

  const tui = JSON.parse(await readFile(join(absTarget, 'tui.json'), 'utf-8'));
  assert.equal(tui.theme, 'nord');
  assert.equal(tui.diff_style, 'stacked');
  assert.equal(tui.mouse, false);
  assert.equal(tui.attention.enabled, false);
  assert.equal(tui.attention.notifications, true);
}));

test('loadLockFile reads the lock file written by install', () => withWorkspace(async ({ workspace }) => {
  await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: {
      skills: ['backend-best-practices'],
      agents: ['reviewer'],
    },
    includeAgentsMd: true,
  });

  const absTarget = resolve(workspace, '.opencode');
  const lock = await loadLockFile(absTarget);
  assert.ok(lock);
  assert.equal(lock.version, 1);
  assert.equal(lock.agentType, 'opencode');
  assert.deepEqual(lockToSelections(lock).skills, ['backend-best-practices']);
  assert.deepEqual(lockToSelections(lock).agents, ['reviewer']);
  assert.equal(lock.includeAgentsMd, true);
  assert.match(lock.installedAt, /^\d{4}-\d{2}-\d{2}T/);

  const noLock = await loadLockFile(resolve(workspace, 'nonexistent'));
  assert.equal(noLock, null);
}));

test('install removes files for items dropped on re-install', () => withWorkspace(async () => {
  const absTarget = await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: {
      skills: ['backend-best-practices'],
      agents: ['reviewer'],
      commands: ['summarize-changes'],
    },
    includeAgentsMd: false,
  });

  await access(join(absTarget, 'skills/backend-best-practices/SKILL.md'));
  await access(join(absTarget, 'agents/reviewer.md'));
  await access(join(absTarget, 'commands/summarize-changes.md'));

  await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: {
      skills: ['backend-best-practices'],
      commands: ['summarize-changes'],
    },
    oldSelections: {
      skills: ['backend-best-practices'],
      agents: ['reviewer'],
      commands: ['summarize-changes'],
    },
    includeAgentsMd: false,
  });

  await assert.rejects(access(join(absTarget, 'agents/reviewer.md')), { code: 'ENOENT' });
  await access(join(absTarget, 'skills/backend-best-practices/SKILL.md'));
  await access(join(absTarget, 'commands/summarize-changes.md'));

  const lock = await loadLockFile(absTarget);
  assert.ok(lock);
  assert.deepEqual(lockToSelections(lock).skills, ['backend-best-practices']);
  assert.deepEqual(lockToSelections(lock).commands, ['summarize-changes']);
  assert.equal(lock.agents?.reviewer, undefined);
}));

test('re-install preserves user-edited managed files', () => withWorkspace(async ({ workspace }) => {
  await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: { commands: ['summarize-changes'] },
    includeAgentsMd: true,
  });
  const target = resolve(workspace, '.opencode');
  await writeFile(join(target, 'AGENTS.md'), 'User instructions\n');
  const lock = await loadLockFile(target);

  await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: { commands: ['summarize-changes'] },
    includeAgentsMd: true,
    oldSelections: lockToSelections(lock),
    oldLock: lock,
  });

  assert.equal(await readFile(join(target, 'AGENTS.md'), 'utf-8'), 'User instructions\n');
}));

test('loadLockFile rejects malformed and unknown selections', () => withWorkspace(async ({ workspace }) => {
  await writeFile(join(workspace, 'system-prompt-lock.json'), JSON.stringify({
    version: 1,
    agentType: 'opencode',
    installedAt: new Date().toISOString(),
    includeAgentsMd: false,
    commands: { '../outside': { source: 'x', sourceType: 'bundled', itemPath: 'y', computedHash: '0'.repeat(64), files: {} } },
    generated: {},
  }));
  await assert.rejects(loadLockFile(workspace), /unknown commands item/);

  await writeFile(join(workspace, 'system-prompt-lock.json'), JSON.stringify({ nope: true }));
  await assert.rejects(loadLockFile(workspace), /unsupported version/);

  await writeFile(join(workspace, 'system-prompt-lock.json'), JSON.stringify({ selections: { commands: ['summarize-changes'] } }));
  await assert.rejects(loadLockFile(workspace), /legacy lock format/);
}));

test('dry-run does not create the installation directory', () => withWorkspace(async ({ workspace }) => {
  await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: { commands: ['summarize-changes'] },
    includeAgentsMd: false,
    dryRun: true,
  });
  await assert.rejects(access(join(workspace, '.opencode')), { code: 'ENOENT' });
}));

test('installer rejects symlink destinations', () => withWorkspace(async ({ workspace, makeTemp }) => {
  const outside = await makeTemp('system-prompt-outside-');
  await mkdir(join(workspace, '.opencode'), { recursive: true });
  await symlink(outside, join(workspace, '.opencode', 'commands'));

  await assert.rejects(install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: { commands: ['summarize-changes'] },
    includeAgentsMd: false,
  }), /symlink/);
}));

test('installer rejects nested symlinks during directory cleanup', () => withWorkspace(async ({ workspace, makeTemp }) => {
  const outside = await makeTemp('system-prompt-outside-');
  await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: { skills: ['backend-best-practices'] },
    includeAgentsMd: false,
  });
  const target = resolve(workspace, '.opencode');
  const references = join(target, 'skills/backend-best-practices/references');
  const lock = await loadLockFile(target);
  await rm(references, { recursive: true, force: true });
  await symlink(outside, references);

  await assert.rejects(install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: {},
    includeAgentsMd: false,
    oldSelections: lockToSelections(lock),
    oldLock: lock,
  }), /symlink/);
}));

test('re-install preserves modified directory items when deselected', () => withWorkspace(async ({ workspace }) => {
  await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: { skills: ['backend-best-practices'] },
    includeAgentsMd: false,
  });
  const target = resolve(workspace, '.opencode');
  const skillPath = join(target, 'skills/backend-best-practices/SKILL.md');
  await writeFile(skillPath, 'User skill changes\n');
  const lock = await loadLockFile(target);

  await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: {},
    includeAgentsMd: false,
    oldSelections: lockToSelections(lock),
    oldLock: lock,
  });

  assert.equal(await readFile(skillPath, 'utf-8'), 'User skill changes\n');
}));

test('re-install removes deselected generated plugins', () => withWorkspace(async ({ workspace }) => {
  await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: { plugins: ['opencode-goal-plugin'] },
    includeAgentsMd: false,
  });
  const target = resolve(workspace, '.opencode');
  const lock = await loadLockFile(target);

  await install({
    targetDir: '.opencode',
    agentType: 'opencode',
    selections: {},
    includeAgentsMd: false,
    oldSelections: lockToSelections(lock),
    oldLock: lock,
  });

  const config = JSON.parse(await readFile(join(target, 'opencode.json'), 'utf-8'));
  assert.equal(config.plugin, undefined);
}));
