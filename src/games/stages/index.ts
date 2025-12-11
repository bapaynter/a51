import type { StageConfig } from '../../core/types';
// We will import stages here as we build them.
import { stage1 } from './stage1';
import { stage2 } from './stage2';
import { stage3 } from './stage3';
import { stage4 } from './stage4';
import { stage5 } from './stage5';
import { stage6 } from './stage6';
import { stage7 } from './stage7';
import { stage8 } from './stage8';
import { stage9 } from './stage9';
import { stage10, endingStage } from './stage10';

export const stages: Record<number, StageConfig> = {
  1: stage1,
  2: stage2,
  3: stage3,
  4: stage4,
  5: stage5,
  6: stage6,
  7: stage7,
  8: stage8,
  9: stage9,
  10: stage10,
  11: endingStage,
};

export const getStage = (id: number): StageConfig | undefined => {
  return stages[id];
};
