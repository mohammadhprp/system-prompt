import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { install, loadLockFile } from '../src/installer.js';

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
        commands: ['review'],
        standards: ['security'],
        templates: ['adr'],
        plugins: ['opencode-goal-plugin'],
        memory: ['codebase-insights', 'user-preferences'],
        mcps: ['notion-mcp'],
      },
      includeAgentsMd: true,
    });

    assert.equal(absTarget, resolve(process.cwd(), '.opencode'));

    const skill = await readFile(join(absTarget, 'skills/backend-best-practices/SKILL.md'), 'utf-8');
    assert.match(skill, /Backend Best Practices/);

    const agent = await readFile(join(absTarget, 'agents/reviewer.md'), 'utf-8');
    assert.match(agent, /review code changes/i);

    const command = await readFile(join(absTarget, 'commands/review.md'), 'utf-8');
    assert.match(command, /review/i);

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
    assert.equal(lock.agentType, 'opencode');
    assert.equal(lock.targetDir, '.opencode');
    assert.deepEqual(lock.selections.skills, ['backend-best-practices']);
    assert.match(lock.installedAt, /^\d{4}-\d{2}-\d{2}T/);
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

test('install creates merged .env from selected MCP .env.example files', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);

    const absTarget = await install({
      targetDir: '.opencode',
      agentType: 'opencode',
      selections: {
        mcps: ['gitlab-mcp', 'jira-mcp'],
      },
      includeAgentsMd: false,
    });

    const envContent = await readFile(join(absTarget, '.env'), 'utf-8');
    assert.match(envContent, /^GITLAB_API_URL=$/m);
    assert.match(envContent, /^GITLAB_PERSONAL_ACCESS_TOKEN=$/m);
    assert.match(envContent, /^JIRA_BASE_URL=$/m);
    assert.match(envContent, /^JIRA_PAT=$/m);
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});

test('install merges .env preserving existing values on re-install', async () => {
  const previousCwd = process.cwd();
  const workspace = await mkdtemp(join(tmpdir(), 'system-prompt-test-'));

  try {
    process.chdir(workspace);

    const absTarget = await install({
      targetDir: '.opencode',
      agentType: 'opencode',
      selections: {
        mcps: ['gitlab-mcp', 'jira-mcp'],
      },
      includeAgentsMd: false,
    });

    const seeded = 'GITLAB_API_URL=https://gitlab.example.com\nEXTRA_VAR=keep-me\n';
    await writeFile(join(absTarget, '.env'), seeded);

    await install({
      targetDir: '.opencode',
      agentType: 'opencode',
      selections: {
        mcps: ['gitlab-mcp', 'jira-mcp'],
      },
      includeAgentsMd: false,
    });

    const envContent = await readFile(join(absTarget, '.env'), 'utf-8');
    assert.match(envContent, /^GITLAB_API_URL=https:\/\/gitlab\.example\.com$/m);
    assert.match(envContent, /^EXTRA_VAR=keep-me$/m);
    assert.match(envContent, /^GITLAB_PERSONAL_ACCESS_TOKEN=$/m);
    assert.match(envContent, /^JIRA_BASE_URL=$/m);
    assert.match(envContent, /^JIRA_PAT=$/m);
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
    assert.equal(lock.agentType, 'opencode');
    assert.equal(lock.targetDir, '.opencode');
    assert.deepEqual(lock.selections.skills, ['backend-best-practices']);
    assert.deepEqual(lock.selections.agents, ['reviewer']);
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
        commands: ['review'],
      },
      includeAgentsMd: false,
    });

    await access(join(absTarget, 'skills/backend-best-practices/SKILL.md'));
    await access(join(absTarget, 'agents/reviewer.md'));
    await access(join(absTarget, 'commands/review.md'));

    await install({
      targetDir: '.opencode',
      agentType: 'opencode',
      selections: {
        skills: ['backend-best-practices'],
        commands: ['review'],
      },
      oldSelections: {
        skills: ['backend-best-practices'],
        agents: ['reviewer'],
        commands: ['review'],
      },
      includeAgentsMd: false,
    });

    await assert.rejects(
      access(join(absTarget, 'agents/reviewer.md')),
      { code: 'ENOENT' }
    );

    await access(join(absTarget, 'skills/backend-best-practices/SKILL.md'));
    await access(join(absTarget, 'commands/review.md'));

    const lock = await loadLockFile(absTarget);
    assert.ok(lock);
    assert.deepEqual(lock.selections.skills, ['backend-best-practices']);
    assert.deepEqual(lock.selections.commands, ['review']);
    assert.equal(lock.selections.agents, undefined);
  } finally {
    process.chdir(previousCwd);
    await rm(workspace, { recursive: true, force: true });
  }
});
