import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile, access, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { install, loadLockFile, lockToSelections } from '../src/installer.js';

test('install writes selected framework files and generated config', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);

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

    await assert.rejects(
      access(join(absTarget, 'system-prompt.md')),
      { code: 'ENOENT' }
    );

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
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});

test('install copies skill references directories with the skill', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);

    const absTarget = await install({
      targetDir: '.opencode',
      agentType: 'opencode',
      selections: {
        skills: ['taste'],
      },
      includeAgentsMd: false,
    });

    const skill = await readFile(join(absTarget, 'skills/taste/SKILL.md'), 'utf-8');
    assert.match(skill, /name: taste/);
    assert.match(skill, /references\/design-taste-frontend\.md/);

    const ref = await readFile(join(absTarget, 'skills/taste/references/design-taste-frontend.md'), 'utf-8');
    assert.match(ref, /Anti-Slop Frontend Skill/);
    const brandkit = await readFile(join(absTarget, 'skills/taste/references/brandkit.md'), 'utf-8');
    assert.match(brandkit, /BRANDKIT IMAGE GENERATION SKILL/);
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});

test('install copies the unified effective-html skill and references', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);

    const absTarget = await install({
      targetDir: '.opencode',
      agentType: 'opencode',
      selections: { skills: ['effective-html'] },
      includeAgentsMd: false,
    });

    const skill = await readFile(join(absTarget, 'skills/effective-html/SKILL.md'), 'utf-8');
    assert.match(skill, /name: effective-html/);
    assert.match(skill, /references\/html-prototype\.md/);
    await access(join(absTarget, 'skills/effective-html/examples.md'));
    await access(join(absTarget, 'skills/effective-html/references/design-artifact.md'));
    await access(join(absTarget, 'skills/effective-html/references/html-prototype.md'));
    await access(join(absTarget, 'skills/effective-html/references/interfaces.md'));
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});

test('install copies the glab skill with its references', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);

    const absTarget = await install({
      targetDir: '.opencode',
      agentType: 'opencode',
      selections: { skills: ['glab'] },
      includeAgentsMd: false,
    });

    const skill = await readFile(join(absTarget, 'skills/glab/SKILL.md'), 'utf-8');
    assert.match(skill, /name: glab/);
    await access(join(absTarget, 'skills/glab/references/commands-detailed.md'));
    await access(join(absTarget, 'skills/glab/references/quick-reference.md'));
    await access(join(absTarget, 'skills/glab/references/troubleshooting.md'));
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});

test('install copies the jira-cli skill with its references', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);

    const absTarget = await install({
      targetDir: '.opencode',
      agentType: 'opencode',
      selections: { skills: ['jira-cli'] },
      includeAgentsMd: false,
    });

    const skill = await readFile(join(absTarget, 'skills/jira-cli/SKILL.md'), 'utf-8');
    assert.match(skill, /name: jira-cli/);
    await access(join(absTarget, 'skills/jira-cli/references/commands-detailed.md'));
    await access(join(absTarget, 'skills/jira-cli/references/quick-reference.md'));
    await access(join(absTarget, 'skills/jira-cli/references/troubleshooting.md'));
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});

test('loadLockFile reads the lock file written by install', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);

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
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});

test('install removes files for items dropped on re-install', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);

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

    await assert.rejects(
      access(join(absTarget, 'agents/reviewer.md')),
      { code: 'ENOENT' }
    );

    await access(join(absTarget, 'skills/backend-best-practices/SKILL.md'));
    await access(join(absTarget, 'commands/summarize-changes.md'));

    const lock = await loadLockFile(absTarget);
    assert.ok(lock);
    assert.deepEqual(lockToSelections(lock).skills, ['backend-best-practices']);
    assert.deepEqual(lockToSelections(lock).commands, ['summarize-changes']);
    assert.equal(lock.agents?.reviewer, undefined);
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});

test('re-install preserves user-edited managed files', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);
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
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});

test('loadLockFile rejects malformed and unknown selections', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);
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
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});

test('dry-run does not create the installation directory', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);
    await install({
      targetDir: '.opencode',
      agentType: 'opencode',
      selections: { commands: ['summarize-changes'] },
      includeAgentsMd: false,
      dryRun: true,
    });
    await assert.rejects(access(join(workspace, '.opencode')), { code: 'ENOENT' });
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});

test('installer rejects symlink destinations', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));
  const outside = await mkdtemp(join(tmpdir(), 'system-prompt-outside-'));

  try {
    process.chdir(workspace);
    await mkdir(join(workspace, '.opencode'), { recursive: true });
    await symlink(outside, join(workspace, '.opencode', 'commands'));
    await assert.rejects(install({
      targetDir: '.opencode',
      agentType: 'opencode',
      selections: { commands: ['summarize-changes'] },
      includeAgentsMd: false,
    }), /symlink/);
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

test('installer rejects nested symlinks during directory cleanup', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));
  const outside = await mkdtemp(join(tmpdir(), 'system-prompt-outside-'));

  try {
    process.chdir(workspace);
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
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

test('re-install preserves modified directory items when deselected', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);
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
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});

test('re-install removes deselected generated plugins', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);
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
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});
