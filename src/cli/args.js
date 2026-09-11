import { categories } from '../catalog.js';

const CATEGORY_FLAGS = new Set(Object.keys(categories));

export function parseArgs(argv) {
  const options = {
    targetDir: '.opencode',
    selections: {},
    all: false,
    dryRun: false,
    force: false,
    doctor: false,
    includeAgentsMd: true,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--all') options.all = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--doctor') options.doctor = true;
    else if (arg === '--no-agents-md') options.includeAgentsMd = false;
    else if (arg === '--target') {
      const value = argv[++index];
      if (!value || value.startsWith('--')) throw new Error('Missing value for --target');
      options.targetDir = value;
    }
    else if (arg.startsWith('--target=')) {
      const value = arg.slice('--target='.length);
      if (!value) throw new Error('Missing value for --target');
      options.targetDir = value;
    }
    else if (arg.startsWith('--')) {
      const [flag, inlineValue] = arg.slice(2).split('=', 2);
      if (!CATEGORY_FLAGS.has(flag)) throw new Error(`Unknown option: ${arg}`);
      const value = inlineValue ?? argv[++index];
      if (!value) throw new Error(`Missing value for --${flag}`);
      options.selections[flag] = value.split(',').filter(Boolean);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  options.nonInteractive = options.all || Object.keys(options.selections).length > 0;
  return options;
}

export function allSelections() {
  return Object.fromEntries(Object.entries(categories).map(([category, config]) => [
    category,
    config.items.filter(item => !item.removed).map(item => item.id),
  ]));
}
