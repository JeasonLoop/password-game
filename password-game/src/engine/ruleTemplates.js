// 规则模板库 —— 聚合所有分类
import { mathTemplates } from '../rules/mathRules.js';
import { stringTemplates } from '../rules/stringRules.js';
import { romanTemplates } from '../rules/romanRules.js';
import { memeTemplates } from '../rules/memeRules.js';
import { patternTemplates } from '../rules/patternRules.js';
import { emojiTemplates } from '../rules/emojiRules.js';
import { timeTemplates } from '../rules/timeRules.js';
import { chessTemplates } from '../rules/chessRules.js';
import { scienceTemplates } from '../rules/scienceRules.js';
import { wordplayTemplates } from '../rules/wordplayRules.js';
import { bonusTemplates } from '../rules/bonusRules.js';
import { megaTemplates } from '../rules/megaRules.js';
import { finalTemplates } from '../rules/finalRules.js';

export const ALL_TEMPLATES = [
  ...mathTemplates,
  ...stringTemplates,
  ...romanTemplates,
  ...memeTemplates,
  ...patternTemplates,
  ...emojiTemplates,
  ...timeTemplates,
  ...chessTemplates,
  ...scienceTemplates,
  ...wordplayTemplates,
  ...bonusTemplates,
  ...megaTemplates,
  ...finalTemplates,
];
