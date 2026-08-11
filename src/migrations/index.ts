import * as migration_20260811_200902_initial from './20260811_200902_initial';

export const migrations = [
  {
    up: migration_20260811_200902_initial.up,
    down: migration_20260811_200902_initial.down,
    name: '20260811_200902_initial'
  },
];
