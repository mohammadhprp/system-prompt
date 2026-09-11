import { confirm, intro, isCancel, multiselect, note, outro, select, spinner } from '@clack/prompts';

export const defaultUi = {
  intro,
  outro,
  confirm,
  multiselect,
  spinner,
  select,
  note,
  isCancel,
  log: (...args) => console.log(...args),
};
