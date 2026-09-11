import { resolve } from 'node:path';

import { doctor } from '../doctor.js';
import { install } from '../install/index.js';
import { loadLockFile, lockToSelections } from '../install/lock.js';
import { getPackageVersion } from '../paths.js';
import { status } from '../ui.js';
import { allSelections, parseArgs } from './args.js';
import { defaultUi } from './clack-ui.js';
import { runInteractive } from './interactive.js';

export async function runNonInteractive({ targetDir, selections, all, includeAgentsMd, force = false, dryRun = false, agentType = 'opencode', ui = defaultUi }) {
  const resolvedSelections = all ? allSelections() : selections;
  const absTarget = resolve(process.cwd(), targetDir);
  const oldLock = await loadLockFile(absTarget);
  if (!dryRun) ui.log(status('info', `Installing selected components into ${absTarget}`));
  await install({
    targetDir,
    agentType,
    selections: resolvedSelections,
    includeAgentsMd,
    oldSelections: oldLock ? lockToSelections(oldLock) : undefined,
    oldLock,
    force,
    dryRun,
  });
  ui.log(status(dryRun ? 'info' : 'success', dryRun ? 'Dry run complete.' : 'Installation complete.'));
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.doctor) {
    const healthy = await doctor(args.targetDir);
    if (!healthy) process.exitCode = 1;
    return healthy;
  }

  const version = await getPackageVersion();
  defaultUi.intro(`System prompt  ·  v${version}`);

  const agentType = 'opencode';

  if (args.nonInteractive) {
    return runNonInteractive({ ...args, agentType });
  }
  return runInteractive({ ...args, agentType });
}
