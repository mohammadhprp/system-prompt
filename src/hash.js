import { createHash } from 'node:crypto';

export function hash(content) {
  return createHash('sha256').update(content).digest('hex');
}
