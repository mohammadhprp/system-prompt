const RESET = '\u001b[0m';

const COLORS = {
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  cyan: '\u001b[36m',
};

const STATUS = {
  success: { symbol: '✓', color: 'green' },
  info: { symbol: '›', color: 'cyan' },
  warn: { symbol: '!', color: 'yellow' },
  error: { symbol: '✗', color: 'red' },
};

export function colorEnabled(stream = process.stdout) {
  if ('NO_COLOR' in process.env) return false;
  if (process.env.FORCE_COLOR && process.env.FORCE_COLOR !== '0') return true;
  return Boolean(stream?.isTTY);
}

function style(text, color, { enabled = colorEnabled() } = {}) {
  const code = COLORS[color];
  if (!enabled || !code) return text;
  return `${code}${text}${RESET}`;
}

export function status(kind, message, options = {}) {
  const config = STATUS[kind] || STATUS.info;
  return `${style(config.symbol, config.color, options)} ${message}`;
}
